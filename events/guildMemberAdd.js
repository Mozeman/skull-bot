module.exports = (client, member) => {
    // 1. That server has welcome set enabled
    // 2. That server has a welcome set channel set
    // 3. Make sure bot has proper permissions
    const guild = member.guild;
    client.logger.debug(`${member.displayName} joined the server ${guild.name}`);
};