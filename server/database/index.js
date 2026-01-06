// schema runner

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaDir = path.join(__dirname, 'schemas');

async function runSchema() {
  const files = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith('.sql'))
    .sort(); // ensures 001_, 002_, 003_ order

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(schemaDir, file), 'utf-8');

      console.log(`📄 Running ${file}`);
      await pool.query(sql);
    }

    console.log('✅ Database schema created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Schema creation failed:', err);
    process.exit(1);
  }
}

runSchema();
