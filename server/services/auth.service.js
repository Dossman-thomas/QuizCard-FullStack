// contains business logic for signing up and logging in.

// imports
import { pool } from '../config/index.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  hashPassword,
  validatePasswordStrength,
  logServiceError,
  createError,
} from '../utils/index.js';

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
import { env } from 'process';

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
    const { username, email, password } = payload;

    // validate input
    if (!username || !email || !password) {
      throw createError('Missing required fields.', 400, {
        code: 'MISSING_FIELDS',
      });
    }

    // validate password strength
    validatePasswordStrength(password);

    // enforce uniqueness of hash email
    const emailCheckQuery = `
      SELECT user_id
      FROM users
      WHERE email_hash = encode(digest(lower($1), 'sha256'), 'hex')
      LIMIT 1;
    `;

    const { rowCount } = await pool.query(emailCheckQuery, [email]);

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
      $1,
      pgp_sym_encrypt($2, $3),
      encode(digest(lower($2), 'sha256'), 'hex'),
      $4
      )
      RETURNING user_id;
    `;

    const { rows } = await pool.query(insertUserQuery, [
      username,
      email,
      env.encryption.emailSecret,
      hashedPassword,
    ]);

    return {
      userId: rows[0].user_id,
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

    // Query database to find a matching user
    const findUserQuery = `
      SELECT
        user_id,
        password
      FROM users
      WHERE email_hash = encode(digest(lower($1), 'sha256'), 'hex')
      LIMIT 1;
    `;

    const { rows } = await pool.query(findUserQuery, [email]);
    const user = rows[0];

    // check if user exists
    if (!user || user.length === 0) {
      throw createError('User not found.', 404, {
        code: 'USER_NOT_FOUND',
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
    const token = jwt.sign({ id: user.user_id }, env.jwt.secret, {
      expiresIn: tokenExpiry,
    });

    // package token and user details before sending them back
    responsePayload = { token: token, userId: user_id };

    // validate payload structure
    if (!responsePayload.token || !responsePayload.userId) {
      throw createError('Invalid payload structure.', 400, {
        code: 'INVALID_PAYLOAD_STRUCTURE',
      });
    }

    // on successful login, reset the attempt count

    // return packaged response payload
    return { responsePayload };
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
