const moment = require('moment');
const Discord = require("discord.js");
const {fromGuild, hasCommand, getCommand} = require("../../functions.js");

module.exports = {
    name: 'help',
    description: 'See command list and command usage',
    usage: '{prefix}help',

    run: async function (client, message, args) {
        let embed;
        if (fromGuild(message)) {
            const date = new Date();
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`)
        }
        //let client = message.client;
        if (args.length > 0) {
            const requested_command = args[0].toLocaleLowerCase();
            if (requested_command) {
                if (hasCommand(requested_command)) {
                    const command = getCommand(requested_command);
                    embed = new Discord.RichEmbed()
                        .setTitle(client.user.username + " Help Manual")
                        .setDescription("**Usage** :`" + command.usage.replace("{0}", client.prefix) + "`\n\n" + "__" + command.description + "__")
                        .setFooter(`Type ${client.prefix}help <command> to see more about a command.`);

                    await message.channel.send(embed);

                } else
                    message.channel.send(`Command not found "${requested_command}"`);
                return;
            }
        }

        let prefix = client.prefix;
        for (let [ cogName, cog ] of client.cogs) {
            embed = new Discord.RichEmbed()
                .setColor(0x19bf0a)
                .setTitle(`${cogName} Cog Commands`)
                .setFooter(`Type ${prefix}help <command> to see more info about a specific command.`);

            if (cog.commands.size <= 0) {
                continue;
            }

            cog.commands.forEach((command, commandName) => {
                if (message.member.hasPermission(command.permissions)) {
                    embed.addField(`${prefix}${commandName}`, command.description, false);
                }
            });
            await message.channel.send(embed);
        }
    }
};