-- Users table schema
-- This is executed automatically on app startup via config/db.js
-- Kept here as a reference / manual migration script

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
);
