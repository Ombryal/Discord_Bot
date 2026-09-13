const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require('../../database/db');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('Remove a specific warning by its ID')
		.addIntegerOption(option =>
			option.setName('warning_id')
				.setDescription('The warning ID, get this from /warnings')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		const warningId = interaction.options.getInteger('warning_id');

		const result = await db.execute({
			sql: 'DELETE FROM warnings WHERE id = ? AND guild_id = ? RETURNING user_id',
			args: [warningId, interaction.guild.id],
		});

		if (result.rows.length === 0) {
			return interaction.reply({ content: `No warning with ID #${warningId} found here.`, ephemeral: true });
		}

		const embed = baseEmbed()
			.setTitle('🗑️ Warning Removed')
			.setDescription(`Warning **#${warningId}** was deleted by ${interaction.user.tag}.`);

		await interaction.reply({ embeds: [embed] });
	},
};
