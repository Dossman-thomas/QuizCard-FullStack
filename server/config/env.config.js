import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'dev'; // set default to 'dev' if NODE_ENV is not set
dotenv.config({ path: `.env.${nodeEnv}` }); // load environment variables from .env file

export const env = {
    NodeEnv: nodeEnv,
    db: {},
    server: {},
    jwt: {},
    encryption: {},
    email: {},
    filePaths: {},
    multer: {},
    frontEndUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    roles: {},
    booleans: {
        t: process.env.TRUE,
        f: process.env.FALSE
    }
}; 