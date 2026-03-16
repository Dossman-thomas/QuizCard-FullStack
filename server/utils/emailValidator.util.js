import { createError } from './index.js';

export const validateEmail = (email) => {
  if (email.length > 254) {
    throw createError('Email too long.', 400, { code: 'EMAIL_TOO_LONG' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    throw createError('Invalid email format.', 400, {
      code: 'INVALID_EMAIL_FORMAT',
    });
  }
};
