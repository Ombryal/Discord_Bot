const path = require('node:path');
const Database = require('better-sqlite3');

// this file just gets created automatically the first time the bot runs, no setup needed on my end (Yehhhh)
const db = new Database(path.join(__dirname, '..', '..', 'nexus.sqlite'));

// makes writes way more reliable if the bot ever crashes mid-save
db.pragma('journal_mode = WAL');

// one row per user per server, since someone's level should be different in each server
db.exec(`
	CREATE TABLE IF NOT EXISTS levels (
		user_id TEXT NOT NULL,
		guild_id TEXT NOT NULL,
		xp INTEGER NOT NULL DEFAULT 0,
		level INTEGER NOT NULL DEFAULT 0,
		last_message_at INTEGER NOT NULL DEFAULT 0,
		PRIMARY KEY (user_id, guild_id)
	)
`);

// keeps a running log of every warning given out, so mods can pull someone's history
db.exec(`
	CREATE TABLE IF NOT EXISTS warnings (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id TEXT NOT NULL,
		guild_id TEXT NOT NULL,
		moderator_id TEXT NOT NULL,
		reason TEXT NOT NULL,
		created_at INTEGER NOT NULL
	)
`);

module.exports = db;
