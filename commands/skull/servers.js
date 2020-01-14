const Discord = require("discord.js");
const moment = require('moment');
const {fromGuild, hasCommand} = require("../../functions.js");

module.exports = {
    name: 'servers',
    description: 'Shows all servers the bot is in',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        }
        //console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command "${this.name}"`);

        if (client.config.hasOwnProperty("ownerID")) {
            if (message.author.id !== client.config.ownerID) {
                await message.channel.send(`Who is this man. ${message.author} ?`);
                return;
            }
        };


        let msg = '';
        client.guilds.array().forEach(server => {
            msg += '[ ' + (client.guilds.array().indexOf(server) + 1) + ' ] ' + server.name + '\n'
        });
        await message.channel.send(msg)
            .catch(console.error);
        await message.channel.send("Enter the number for the server you would like to leave.")

        // Collector to get the response, parse the number
        // If the number isn't indexed in the list, respond saying That server isn't on the list
        // If it is on the list, use guild.leave()

        let guild, index, confirmation;

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { maxMatches: 1, time: 5000 })

        let resp;
        collector.on('collect', async response => {
            resp = true;
            index = parseInt(response.content);
            if (isNaN(index)) {
                await message.channel.send("this is not a number.");
                return;
            }


            guild = client.guilds.array()[index - 1];

            if (guild) {
                await message.channel.send(`Is this the server you wanted to leave? ${guild.name}`);
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { maxMatches: 1, time: 5000 });
                let resp;
                collector2.on('collect', async response => {
                    resp = true;
                    if (response.content.toLowerCase().trim().startsWith("y")) {
                        await guild.leave();
                        await message.channel.send("I have left the server")
                    }
                    else if (response.content.toLowerCase().trim().startsWith("n")) {
                        var msg = await message.channel.send("No U");
                        setTimeout(function () {
                            msg.delete()
                        }, 2000);
                        await message.channel.send("I have not left the server :)")
                    }
                });

                collector2.on("end", async _collected => {
                    if (!resp) {
                        await message.channel.send("time has run out");
                    }
                });

            }
            else
                await message.channel.send("Guild not found!");
        });

        collector.on("end", async _collected => {
            if (!resp) {
                await message.channel.send("time has run out");
            }
        });
    }
};