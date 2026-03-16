// auth routes
import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
} from '../controllers/index.js';

import { validatePayload } from '../middleware/index.js';

export const authRouter = Router();

// sign up route
authRouter.post('/register', validatePayload, registerUserController);

// log in route
authRouter.post('/login', validatePayload, loginUserController);
