const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Who to kick')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why are they getting kicked')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
		const target = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'No reason given';

		const member = await interaction.guild.members.fetch(target.id).catch(() => null);

		if (!member) {
			return interaction.reply({ content: 'That person isn\'t in this server.', ephemeral: true });
		}

		// can't kick someone whose role is higher than or equal to your own, discord blocks this anyway
		// but checking here means we can give a clean error instead of a confusing discord.js one
		if (!member.kickable) {
			return interaction.reply({ content: 'I can\'t kick that person, they might have a higher role than me.', ephemeral: true });
		}

		await member.kick(reason);

		await interaction.reply(`👢 Kicked **${target.tag}**. Reason: ${reason}`);
	},
};
