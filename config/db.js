const { createClient } = require('@libsql/client');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const initializeDatabase = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_login TEXT NOT NULL DEFAULT '',
        user_pass TEXT NOT NULL DEFAULT '',
        fname TEXT NOT NULL,
        lname TEXT NOT NULL,
        gender TEXT NOT NULL,
        user_level INTEGER NOT NULL DEFAULT 0,
        branch_cd TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        registered DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_activation_key TEXT NOT NULL DEFAULT '',
        isActive INTEGER NOT NULL DEFAULT 1
      )
    `);
    console.log('✅ Database initialized — users table ready.');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  }
};

module.exports = { db, initializeDatabase };
