const moment = require('moment');
const Discord = require('discord.js');
const {fromGuild, hasCommand} = require("../../functions.js");

module.exports = {
    name: 'command',
    description: 'description',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        }


        // Start Command

    }
};