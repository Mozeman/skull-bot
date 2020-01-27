const {fromGuild, hasCommand, getChannel, getGuildSetting, setGuildSetting} = require("../functions.js");
const discord = require('discord.js');

module.exports = (client, member) => {
    const guild = member.guild;
    client.logger.debug(`${member.displayName} left the server ${guild.name}`);

    const welcome_channel_id = getGuildSetting(guild, 'welcome-channel-id');
    const channel = getChannel(guild, welcome_channel_id);

    if (channel === null) {
        console.debug(`${guild.name} does not have a welcome-channel-id set in settings.`);
        return;
    }

    channel.send(`${member.displayName} has left ${guild.name}! This is big F moment :c!`);

};