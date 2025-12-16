CREATE TABLE IF NOT EXISTS cards (
  card_id SERIAL PRIMARY KEY,
  deck_id INT NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  question VARCHAR(50) NOT NULL,
  answer VARCHAR(250) NOT NULL,
  is_starred BOOLEAN DEFAULT FALSE,
  card_created_at TIMESTAMP DEFAULT NOW(),
  card_updated_at TIMESTAMP DEFAULT NOW(),
  card_deleted_at TIMESTAMP
);
