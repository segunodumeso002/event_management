// Database connection setup for PostgreSQL

import 'dotenv/config'; // Ensure environment variables are loaded
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
