import express from 'express';
import cors from 'cors';
import morgan from 'morgan';    
import compression from 'compression';
import path from 'path';
import { routes } from './routes/router.js';
import { env } from './config/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from './config/index.js'; 
import { response } from './utils/index.js'; 
import { messages } from './messages/index.js'; 

const PORT = env.server.port || process.env.PORT; 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
