CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  profile_pic TEXT,
  user_created_at TIMESTAMP DEFAULT NOW(),
  user_updated_at TIMESTAMP DEFAULT NOW(),
  user_deleted_at TIMESTAMP
);
