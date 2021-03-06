const {fromGuild, hasCommand, getChannel, getGuildSetting, setGuildSetting} = require("../functions.js");

module.exports = (client, member) => {
    // 1. That server has welcome set enabled
    // 2. That server has a welcome set channel set
    // 3. Make sure bot has proper permissions
    const guild = member.guild;
    client.logger.debug(`${member.displayName} joined the server ${guild.name}`);

    const welcome_channel_id = getGuildSetting(guild, 'welcome-channel-id');
    const channel = getChannel(guild, welcome_channel_id);

    if (channel === null) {
        console.debug(`${guild.name} does not have a welcome-channel-id set in settings.`);
        return;
    }

    channel.send(`${member.displayName} has joined ${guild.name}! Say hello!`);

};