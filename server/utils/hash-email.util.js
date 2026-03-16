// import { normalizeEmail } from './index.js';
import crypto from 'crypto';

export const hashNormalizedEmail = (email) =>
  crypto.createHash('sha256').update(email).digest('hex');
