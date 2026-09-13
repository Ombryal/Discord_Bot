const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../database/db');
const { xpForLevel } = require('../../utils/leveling');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check your (or someone else\'s) level and XP')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Whose rank to check')
				.setRequired(false)),

	async execute(interaction) {
		const target = interaction.options.getUser('user') || interaction.user;

		const result = await db.execute({
			sql: 'SELECT * FROM levels WHERE user_id = ? AND guild_id = ?',
			args: [target.id, interaction.guild.id],
		});
		const row = result.rows[0];

		// nobody's talked yet, so there's nothing in the db for them
		if (!row) {
			return interaction.reply({
				content: `${target.id === interaction.user.id ? 'You haven\'t' : `${target.username} hasn't`} sent any messages here yet.`,
			});
		}

		const nextLevelXp = xpForLevel(row.level);
		const prevLevelXp = row.level > 0 ? xpForLevel(row.level - 1) : 0;
		const progress = row.xp - prevLevelXp;
		const needed = nextLevelXp - prevLevelXp;

		const embed = new EmbedBuilder()
			.setColor(0x5865F2)
			.setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
			.addFields(
				{ name: 'Level', value: `${row.level}`, inline: true },
				{ name: 'Total XP', value: `${row.xp}`, inline: true },
				{ name: 'Progress to next level', value: `${progress} / ${needed} XP`, inline: true },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
