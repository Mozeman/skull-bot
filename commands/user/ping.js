const moment = require('moment');
const {fromGuild, hasCommand} = require("../../functions.js");

module.exports = {
    name: 'ping',
    description: 'Pings server and API latency',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`)
            client.logger.debug(`Arguments used : '${args}'`);
        }
        //console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command "${this.name}"`);

        const m = await message.channel.send("Ping?");

        const embed = {
            "embed": {
                "color": 0xd05333,
                "title": `:ping_pong:`,
                'fields': [
                    {
                        'name': 'Latency:',
                        'value': `${m.createdTimestamp - message.createdTimestamp}ms.`,
                    },
                    {
                        'name': 'API Latency:',
                        'value': `${Math.round(client.ping)}ms`,
                    },

                ],
                footer: {
                    'text': "Member ID: " + message.id + "  |  " + moment(message.createdAt).format('DD-MM-Y hh:mm:ss A')
                }
            }
        };
        await m.edit(embed)
    }
}