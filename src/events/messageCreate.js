const { Events } = require('discord.js');
const db = require('../database/db');
const { levelFromXp, randomXp } = require('../utils/leveling');

// 60 second cooldown so people can't just spam one letter over and over to level up fast
const COOLDOWN_MS = 60 * 1000;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		// ignore bots (including ourselves) and DMs, only care about real server messages
		if (message.author.bot || !message.guild) return;

		const row = db.prepare('SELECT * FROM levels WHERE user_id = ? AND guild_id = ?')
			.get(message.author.id, message.guild.id);

		const now = Date.now();

		// still on cooldown, don't give xp this time
		if (row && now - row.last_message_at < COOLDOWN_MS) return;

		const currentXp = row ? row.xp : 0;
		const newXp = currentXp + randomXp();
		const oldLevel = row ? row.level : 0;
		const newLevel = levelFromXp(newXp);

		db.prepare(`
			INSERT INTO levels (user_id, guild_id, xp, level, last_message_at)
			VALUES (?, ?, ?, ?, ?)
			ON CONFLICT(user_id, guild_id) DO UPDATE SET
				xp = excluded.xp,
				level = excluded.level,
				last_message_at = excluded.last_message_at
		`).run(message.author.id, message.guild.id, newXp, newLevel, now);

		// they leveled up, let everyone know in the channel they were chatting in
		if (newLevel > oldLevel) {
			message.channel.send(`🎉 ${message.author} just hit **level ${newLevel}**!`).catch(() => {});
		}
	},
};
