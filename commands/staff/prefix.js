const moment = require('moment');
const Discord = require('discord.js');
const {fromGuild, hasCommand, setGuildSetting} = require("../../functions.js");
const perms = Discord.Permissions.FLAGS;

module.exports = {
    name: 'prefix',
    description: 'Set the prefix to be used in the server',
    usage: `{prefix}prefix <prefix>`,
    permissions: [perms.MANAGE_CHANNELS],
    options: [],

    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        }
        else {
            return;
        }

        // This will verify that they said something after the command so that we can set it as the new prefix
        if (args.length < 1) {
            await message.channel.send('You must input a prefix for me to use.');
            return;
        }

        const desiredPrefix = args[0];
        let passed = setGuildSetting(message.guild, "commandPrefix", desiredPrefix);

        if(passed) {
            await message.channel.send(`Updated ${message.guild.name}'s command prefix to use \`${desiredPrefix}\``);
            client.logger.info(`Updated ${message.guild.name}'s command prefix to use \`${desiredPrefix}\``)
        }
        else {
            await message.channel.send(`An error occurred trying to set the prefix. Please check console and logs for more information.`);
            client.logger.error(`An error occurred trying to update ${message.guild.name}'s command prefix with ${desiredPrefix}`);
        }
    }
};