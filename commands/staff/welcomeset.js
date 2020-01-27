const moment = require('moment');
const Discord = require('discord.js');
const {fromGuild, hasCommand, getChannel, getGuildSetting, setGuildSetting} = require("../../functions.js");
const perms = Discord.Permissions.FLAGS;

module.exports = {
    name: 'welcomeset',
    description: 'Configure the channel to welcome users in',
    usage: `{prefix}welcomeset [channel]`,
    permissions: [],
    options: [],
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        }


        // Start Command
        let prefix = getGuildSetting(message.guild, "commandPrefix");
        prefix = (prefix != null) ? prefix : client.prefix;
        if (args[0] == null) {
            await message.channel.send("No channel defined. Please enter a channel name or id.\n" +
                `*\`Syntax : ${this.usage}\`*`.replace('{prefix}', prefix));
            return;
        }



        checks = message.member.hasPermission("ADMINISTRATOR") || message.author.id === client.config.ownerID;
        if (!checks) {
            await message.channel.send("You do not meet the permission requirements to use this command.");
            return;
        }

        let channel = getChannel(message.guild, args[0]);
        if (channel === null) {
            await message.channel.send(`Could not find a text-channel using input ${args[0]}`);
            return;
        }

        // if (typeof channel === Discord.TextChannel)  {
        //     // channel: Discord.TextChannel
        //     channel = channel.id;
        // }

        const passed = setGuildSetting(message.guild, "welcome-channel-id", channel.id);
        if (passed) {
            await message.channel.send(`Set welcome channel to ${channel}`);
        } else {
            await message.channel.send(`An error occurred trying to set the welcome channel. Please check console and logs for more information.`);
            client.logger.error(`An error occurred trying to update ${message.guild.name}'s welcome channel id prefix with ${channel.id}`);
        }
    }
};