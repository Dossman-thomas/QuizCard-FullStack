// contains business logic for signing up and logging in.

// imports
import { pool } from '../config/index.js';
import bcrypt from 'bcrypt';
import {
  hashPassword,
  validatePasswordStrength,
  logServiceError,
  createError,
} from '../utils/index.js';

// register a user (create)
export const registerUserService = async (payload) => {
  try {
    // register user business logic
    // validate payload
    // validate input
    // enforce uniqueness of email
    // hash password
    // store new user in DB securely
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
    if (!payload || typeof payload !== 'string') {
      throw createError('Invalid payload. Please provide valid data.', 400, {
        code: 'INVALID_PAYLOAD',
      });
    }

    // extract user_email, user_password, and rememberMe from payload
    const { user_email, user_password, rememberMe } = payload;

    // rate limiting logic for the future

    // Query database to find a matching user

    // check if user exists
    if (!user || user.length === 0) {
      throw createError('User not found.', 404, {
        code: 'USER_NOT_FOUND',
      });
    }

    // Compare decrypted inputted password with hashed password in the db
    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password,
    );

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
