// contains business logic for signing up and logging in.

// imports
import { pool, env } from '../config/index.js';
import bcrypt from 'bcrypt';
import {
  hashPassword,
  validatePasswordStrength,
  logServiceError,
  createError,
  hashNormalizedEmail,
  normalizeEmail,
  validateEmail,
} from '../utils/index.js';

// import jwt from 'jsonwebtoken';

// validate jwt token before importing package
if (!env.jwt.secret || !env.jwt.expires || !env.jwt.rememberMe) {
  throw createError(
    'Missing one or more required JWT environment variables.',
    500,
    {
      code: 'JWT_ENV_VARIABLES_MISSING',
    },
  );
}

import jwt from 'jsonwebtoken';

// register a user (create)
export const registerUserService = async (payload) => {
  try {
    // register user business logic

    // validate payload
    if (!payload || typeof payload !== 'object') {
      throw createError('Invalid payload. Please provide valid data.', 400, {
        code: 'INVALID_PAYLOAD',
      });
    }

    // extract user_email payload
    const { email, password } = payload;

    // validate input
    if (!email || !password) {
      throw createError('Missing required fields.', 400, {
        code: 'MISSING_FIELDS',
      });
    }

    // validate password strength
    validatePasswordStrength(password);

    // normalize email
    const normalizedEmail = normalizeEmail(email);

    // validate email regex
    validateEmail(normalizedEmail);

    // hash email
    const emailHash = hashNormalizedEmail(normalizedEmail);

    // enforce uniqueness of hash email
    const emailCheckQuery = `
      SELECT user_id
      FROM users
      WHERE email_hash = $1
      LIMIT 1;
    `;

    const { rowCount } = await pool.query(emailCheckQuery, [emailHash]);

    if (rowCount > 0) {
      throw createError('Email already in use', 409, {
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // store new user in DB securely
    const insertUserQuery = `
      INSERT INTO users (
        user_id,
        username,
        email_encrypted,
        email_hash,
        password
      )
      VALUES (
      gen_random_uuid(),
      NULL,
      pgp_sym_encrypt($1, $2),
      $3,
      $4
      )
      RETURNING user_id;
    `;

    const { rows } = await pool.query(insertUserQuery, [
      normalizedEmail,
      env.encryption.emailSecret,
      emailHash,
      hashedPassword,
    ]);

    const userId = rows[0].user_id;

    // Generate JWT token if authentication is successful
    const token = jwt.sign({ sub: userId, type: 'access' }, env.jwt.secret, {
      expiresIn: env.jwt.expires,
    });

    return {
      token,
      userId,
    };

    // return safe response
  } catch (error) {
    // handle errors and log them for debugging
    logServiceError('registerUserService', error);
    throw createError(
      error.message || 'An error occurred during signup.',
      error.status || 500,
      {
        code: error.code || 'SIGNUP_SERVICE_ERROR',
      },
    );
  }
};

// login
export const loginUserService = async (payload) => {
  try {
    // login business logic

    // validate payload
    if (!payload || typeof payload !== 'object') {
      throw createError('Invalid payload. Please provide valid data.', 400, {
        code: 'INVALID_PAYLOAD',
      });
    }

    // extract email, password, and rememberMe from payload
    const { email, password, rememberMe } = payload;

    // validate inputs
    if (!email || !password) {
      throw createError('Missing credentials.', 400, {
        code: 'MISSING_CREDENTIALS',
      });
    }
    // rate limiting logic for the future

    const normalizedEmail = normalizeEmail(email);
    // hash email
    const emailHash = hashNormalizedEmail(normalizedEmail);

    // hash email for lookup
    const emailHashQuery = `
    SELECT $1 AS email_hash;
    `;

    const {
      rows: [{ email_hash }],
    } = await pool.query(emailHashQuery, [emailHash]);

    // Query database to find a matching user
    const findUserQuery = `
      SELECT
        user_id,
        password
      FROM users
      WHERE email_hash = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(findUserQuery, [email_hash]);
    const user = rows[0];

    // check if user exists
    if (!user) {
      throw createError('Invalid credentials', 401, {
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Compare decrypted inputted password with hashed password in the db
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // check if password is valid
    if (!isPasswordValid) {
      throw createError('Invalid credentials.', 401, {
        code: 'INVALID_CREDENTIALS',
      });
    }

    // set token expiration based on "Remember Me" flag
    const tokenExpiry = rememberMe ? env.jwt.rememberMe : env.jwt.expires;

    // Generate JWT token if authentication is successful
    const token = jwt.sign(
      { sub: user.user_id, type: 'access' },
      env.jwt.secret,
      {
        expiresIn: tokenExpiry,
      },
    );

    const userId = user.user_id;

    // on successful login, reset the attempt count

    // return packaged response payload
    return {
      token,
      userId,
    };
  } catch (error) {
    // handle errors and log them for debugging
    logServiceError('loginUserService', error);
    throw createError(
      error.message || 'An error occurred during login.',
      error.status || 500,
      {
        code: error.code || 'LOGIN_SERVICE_ERROR',
      },
    );
  }
};
