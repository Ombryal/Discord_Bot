const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Remove an active timeout from a member')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Who to remove the timeout from')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');

		const member = await interaction.guild.members.fetch(target.id).catch(() => null);

		if (!member) {
			return interaction.reply({ content: 'That person isn\'t in this server.', ephemeral: true });
		}

		if (!member.communicationDisabledUntil) {
			return interaction.reply({ content: `${target.tag} isn't timed out right now.`, ephemeral: true });
		}

		await member.timeout(null);

		const embed = baseEmbed()
			.setTitle('✅ Timeout Removed')
			.addFields(
				{ name: 'User', value: `${target.tag}`, inline: true },
				{ name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
