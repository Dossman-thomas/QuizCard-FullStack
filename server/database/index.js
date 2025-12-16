import fs from 'fs';
import path from 'path';
import { pool } from '../config/index';

const schemaDir = path.resolve('database/schema');

async function runSchemas() {
  const files = fs.readdirSync(schemaDir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(schemaDir, file), 'utf8');
    console.log(`Running ${file}`);
    await pool.query(sql);
  }

  console.log('✅ Database schema created successfully');
  process.exit(0);
}

runSchemas().catch((err) => {
  console.error('❌ Schema creation failed', err);
  process.exit(1);
});
