const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

// discord caps timeouts at 28 days, so we don't let people type something absurd
const MAX_TIMEOUT_MINUTES = 40320; // 28 days

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Temporarily restrict a member from talking/reacting')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Who to time out')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('minutes')
				.setDescription('How long, in minutes (max 40320 = 28 days)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why are they getting timed out')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');
		const minutes = interaction.options.getInteger('minutes');
		const reason = interaction.options.getString('reason') || 'No reason given';

		if (minutes < 1 || minutes > MAX_TIMEOUT_MINUTES) {
			return interaction.reply({ content: `Minutes has to be between 1 and ${MAX_TIMEOUT_MINUTES} (28 days).`, ephemeral: true });
		}

		const member = await interaction.guild.members.fetch(target.id).catch(() => null);

		if (!member) {
			return interaction.reply({ content: 'That person isn\'t in this server.', ephemeral: true });
		}

		if (!member.moderatable) {
			return interaction.reply({ content: 'I can\'t time out that person, they might have a higher role than me.', ephemeral: true });
		}

		await member.timeout(minutes * 60 * 1000, reason);

		const embed = baseEmbed()
			.setTitle('⏱️ Member Timed Out')
			.addFields(
				{ name: 'User', value: `${target.tag}`, inline: true },
				{ name: 'Duration', value: `${minutes} minute(s)`, inline: true },
				{ name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
				{ name: 'Reason', value: reason },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
