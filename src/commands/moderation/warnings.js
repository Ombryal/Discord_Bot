const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require('../../database/db');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('View a member\'s warning history')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Whose warnings to view')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');

		const result = await db.execute({
			sql: 'SELECT * FROM warnings WHERE user_id = ? AND guild_id = ? ORDER BY created_at DESC',
			args: [target.id, interaction.guild.id],
		});

		if (result.rows.length === 0) {
			return interaction.reply(`${target.tag} has no warnings here. Clean record.`);
		}

		const list = result.rows.map(row =>
			`**#${row.id}** — ${row.reason}\n<t:${Math.floor(row.created_at / 1000)}:R> by <@${row.moderator_id}>`,
		).join('\n\n');

		const embed = baseEmbed()
			.setTitle(`Warnings for ${target.username}`)
			.setDescription(list)
			.setThumbnail(target.displayAvatarURL());

		await interaction.reply({ embeds: [embed] });
	},
};
