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

// Define the port from environment variables
const PORT = env.server.port || process.env.SERVER_PORT; 

// Validate critical environment variables
if (!PORT) {
    console.error('Error: SERVER_PORT is not defined in environment variables.');
    process.exit(1); // Stop the server if critical env vars are missing
}

// Initialize Express app
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -----------------------------
// Middleware
// -----------------------------

// compression middleware for response compression
app.use(compression());

// restricting CORS to specific origins
const allowedOrigins = [env.frontEndUrl];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// logging middleware
app.use(morgan('dev'));

// reduce payload size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// serve static files from environment variables
app.use(
  env.filePaths.relativePath,
  express.static(path.join(__dirname, env.filePaths.staticFilePath))
);

// define routes
app.use('/api', routes);

// Handle 404 errors
app.use((req, res, next) => {
  return response(res, {
    statusCode: 404,
    success: false,
    message: messages.general.NOT_FOUND,
  });
});

// Handle 500 errors
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Internal Server Error:`, {
    message: err.message,
    stack: err.stack,
  });

  return response(res, {
    statusCode: 500,
    success: false,
    message: messages.general.INTERNAL_SERVER_ERROR,
  });
});

// Synchronize database and start server
(async () => {
  try {
    // Test database connection before starting
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] ❌ Unable to connect to database:`,
      error
    );
    process.exit(1);
  }
})();
