const { createClient } = require('@libsql/client');

// this connects to our cloud database on Turso instead of a local file
// means both the bot AND the future website can read/write the same data
const db = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

// creates our tables if they don't already exist yet, safe to run every time the bot starts
async function initDb() {
	await db.execute(`
		CREATE TABLE IF NOT EXISTS levels (
			user_id TEXT NOT NULL,
			guild_id TEXT NOT NULL,
			xp INTEGER NOT NULL DEFAULT 0,
			level INTEGER NOT NULL DEFAULT 0,
			last_message_at INTEGER NOT NULL DEFAULT 0,
			PRIMARY KEY (user_id, guild_id)
		)
	`);

	await db.execute(`
		CREATE TABLE IF NOT EXISTS warnings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id TEXT NOT NULL,
			guild_id TEXT NOT NULL,
			moderator_id TEXT NOT NULL,
			reason TEXT NOT NULL,
			created_at INTEGER NOT NULL
		)
	`);
}

module.exports = { db, initDb };
