const moment = require('moment');
const {fromGuild, hasCommand} = require("../../functions.js");

module.exports = {
    name: 'botinvite',
    description: 'Invite SkullBot to your guild',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`)
            client.logger.debug(`Arguments used : '${args}'`);
        } else {return;}
        //console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command "${this.name}"`);

        client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES'])
            .then(link => message.author.send(`Generated bot invite link: ${link}`))
            .catch(console.error);
    }
};