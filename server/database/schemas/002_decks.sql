CREATE TABLE IF NOT EXISTS decks (
  deck_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(50) NOT NULL,
  deck_created_at TIMESTAMP DEFAULT NOW(),
  deck_updated_at TIMESTAMP DEFAULT NOW(),
  deck_deleted_at TIMESTAMP
);
