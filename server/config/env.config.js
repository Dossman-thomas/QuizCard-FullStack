import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'dev'; // set default to 'dev' if NODE_ENV is not set
dotenv.config({ path: `.env.${nodeEnv}` }); // load environment variables from .env file

export const env = {
    NodeEnv: nodeEnv,
    db: {},
    server: {
        port: process.env.SERVER_PORT,
    },
    jwt: {},
    encryption: {},
    email: {},
    filePaths: {},
    multer: {},
    frontEndUrl: process.env.FRONTEND_URL,
    roles: {},
    booleans: {
        t: process.env.TRUE,
        f: process.env.FALSE
    }
}; 