const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member from the server')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Who to ban')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why are they getting banned')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'No reason given';

		const member = await interaction.guild.members.fetch(target.id).catch(() => null);

		if (member && !member.bannable) {
			return interaction.reply({ content: 'I can\'t ban that person, they might have a higher role than me.', ephemeral: true });
		}

		await interaction.guild.members.ban(target.id, { reason });

		const embed = baseEmbed()
			.setTitle('🔨 Member Banned')
			.addFields(
				{ name: 'User', value: `${target.tag}`, inline: true },
				{ name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
				{ name: 'Reason', value: reason },
			);

		await interaction.reply({ embeds: [embed] });
	},
};
