import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'dev'; // set default to 'dev' if NODE_ENV is not set
dotenv.config({ path: `.env.${nodeEnv}` }); // load environment variables from .env file

export const env = {
    NodeEnv: nodeEnv,
    db: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
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