const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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

		// unlike kick, we can ban people who aren't even in the server (useful for raid cleanup)
		// so we try to fetch the member but don't require them to exist
		const member = await interaction.guild.members.fetch(target.id).catch(() => null);

		if (member && !member.bannable) {
			return interaction.reply({ content: 'I can\'t ban that person, they might have a higher role than me.', ephemeral: true });
		}

		await interaction.guild.members.ban(target.id, { reason });

		await interaction.reply(`🔨 Banned **${target.tag}**. Reason: ${reason}`);
	},
};
