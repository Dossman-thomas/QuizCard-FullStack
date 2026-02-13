import { normalizeEmail } from './index.js';
import crypto from 'crypto';

export const hashNormalizedEmail = (email) =>
  crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex');
