const moment = require('moment');
const Discord = require('discord.js');
const {fromGuild, hasCommand, getGuildTextChannels} = require("../../functions.js");

module.exports = {
    name: 'stats',
    description: 'Interactive stats page for the guild',
    usage: `{prefix}${this.name}`,
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        } else { return; }
        //console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command "${this.name}"`);

        const guild = message.guild;
        let verificationLevel;

        switch (guild.verificationLevel) {
            case 4:
                verificationLevel = "Very High";
                break;
            case 3:
                verificationLevel = "High";
                break;
            case 2:
                verificationLevel = "Medium";
                break;
            case 1:
                verificationLevel = "Low";
                break;
            case 0:
            default:
                verificationLevel = "None";
                break;
        }

        const embed = new Discord.RichEmbed()
            .setColor(0x19bf0a)
            .setTitle("Server Stats Page 1")
            .addField("Server Name", `${guild.name}`, true)
            .addField("Member Count", `${guild.memberCount} Members`, true)
            .setFooter(`Member ID: ${message.id} | ${moment(message.createdAt).format("DD-MM-Y hh:mm:ss A")}`);

        const embed2 = new Discord.RichEmbed()
            .setColor(0x19bf0a)
            .setTitle("Server Stats Page 2")
            .addField("Server Created On", `${moment(guild.createdAt).format('DD-MM-Y hh:mm:ss A')}`, false)
            .addField("Verification Level", verificationLevel, true)
            .addField("Number of Channels", getGuildTextChannels(guild).length, true)
            .setFooter(`Member ID: ${message.id} | ${moment(message.createdAt).format("DD-MM-Y hh:mm:ss A")}`);

        const embed3 = new Discord.RichEmbed()
            .setColor(0x19bf0a)
            .setTitle("Server Stats Page 3")
            .addField("Server Owner", `${guild.owner}`, false)
            .addField("Server Default Role", `${guild.defaultRole}`, false)
            .addField("Server verified", `${guild.verified}`, false)
            .addField("Server Afk timeout", `${guild.afkTimeout}s`, false)
            .setFooter(`Member ID: ${message.id} | ${moment(message.createdAt).format("DD-MM-Y hh:mm:ss A")}`);

        const showPage = async function (page) {
            switch (page) {
                default:
                case 1:
                    await msg.edit(embed);
                    break;
                case 2:
                    await msg.edit(embed2);
                    break;
                case 3:
                    await msg.edit(embed3);
                    break;

            }

            //if (!request_response == null) await request_response.delete();
            //request_response = await message.channel.send("Enter the page number to change to.");
        };

        // Initialize by showing first page.
        let msg = await message.channel.send(embed);

        // Get response to view another page
        let request_response = await message.channel.send("Enter the page number to change to.");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 5000 });

        let resp;
        collector.on('collect', async response => {
            if (request_response != null) {
                await request_response.delete()
                    //           .then(msg => console.log("Deleted request response message"))
                    .catch(console.error);
                //       console.log("Deleted Request Response");
            }
            resp = true;
            let index = parseInt(response.content);
            if (isNaN(index)) {
                await message.channel.send("This does not seem to be a valid page number. Interactive paging cancelled.");
                return;
            }
            await response.delete()
                //       .then(msg => console.log("Deleted response"))
                .catch(console.error);

            await showPage(index);
            request_response = await message.channel.send("Enter the page number to change to.");

        });

        collector.on("end", async _collected => {
            //   console.log("Response: " + resp);
            if (resp == null || !resp) {
                await message.channel.send("Time has run out. Interactive paging cancelled.");
            }
            if (request_response != null) {
                await request_response.delete()
                    //       .then(msg => console.log("Deleted Request Response"))
                    .catch(console.error);
            }
        });
    }
};