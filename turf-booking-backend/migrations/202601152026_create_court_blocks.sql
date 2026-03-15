
-- “If THIS court is booked, which OTHER court becomes unavailable?”

CREATE TABLE IF NOT EXISTS court_blocks (
  id SERIAL PRIMARY KEY,

  court_id UUID NOT NULL,
  blocks_court_id UUID NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_court_blocks_court
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,

  CONSTRAINT fk_court_blocks_blocks
    FOREIGN KEY (blocks_court_id) REFERENCES courts(id) ON DELETE CASCADE,

  CONSTRAINT unique_block_pair UNIQUE (court_id, blocks_court_id)
);