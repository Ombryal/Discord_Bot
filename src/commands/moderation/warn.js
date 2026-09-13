const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../../database/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Give a member a warning (saved to their history)')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Who to warn')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why are they getting warned')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason');

		db.prepare(`
			INSERT INTO warnings (user_id, guild_id, moderator_id, reason, created_at)
			VALUES (?, ?, ?, ?, ?)
		`).run(target.id, interaction.guild.id, interaction.user.id, reason, Date.now());

		const totalWarnings = db.prepare('SELECT COUNT(*) AS count FROM warnings WHERE user_id = ? AND guild_id = ?')
			.get(target.id, interaction.guild.id).count;

		await interaction.reply(`⚠️ Warned **${target.tag}**. Reason: ${reason}\nThey now have **${totalWarnings}** warning(s).`);

		// try to let them know via DM too, but don't break the command if their DMs are closed
		target.send({
			embeds: [
				new EmbedBuilder()
					.setColor(0xFFCC00)
					.setTitle(`You were warned in ${interaction.guild.name}`)
					.setDescription(reason),
			],
		}).catch(() => {});
	},
};
