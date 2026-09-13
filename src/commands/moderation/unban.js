const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Remove a ban from a user')
		.addStringOption(option =>
			option.setName('user_id')
				.setDescription('The user ID of the banned person (they\'re not in the server anymore, so no @ mention)')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
		const userId = interaction.options.getString('user_id');

		const bannedUser = await interaction.guild.bans.fetch(userId).catch(() => null);

		if (!bannedUser) {
			return interaction.reply({ content: 'That user isn\'t banned here (or the ID is wrong).', ephemeral: true });
		}

		await interaction.guild.members.unban(userId);

		const embed = baseEmbed()
			.setTitle('✅ Ban Removed')
			.addFields(
				{ name: 'User', value: `${bannedUser.user.tag}`, inline: true },
				{ name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
