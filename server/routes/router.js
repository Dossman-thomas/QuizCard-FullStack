import { Router } from 'express';
import { authRouter } from './auth.routes.js';

export const routes = Router();

// Define API routes here
routes.use('/auth', authRouter); // add auth routes
