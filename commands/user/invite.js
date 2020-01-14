const moment = require('moment');
const Discord = require('discord.js');
const {fromGuild, hasCommand} = require("../../functions.js");

module.exports = {
    name: 'invite',
    description: 'Creates a invite link for a guild',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`)
            client.logger.debug(`Arguments used : '${args}'`);
        } else {return; }


        // Start Command
        message.channel.createInvite({"maxUses" : 1})
            .then(invite => {
                message.channel.send("Invite link send via direct message");
                message.author.send("Invite link discord.gg/" + invite.code)
            });
    }
};