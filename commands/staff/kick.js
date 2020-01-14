const moment = require('moment');
const Discord = require('discord.js');
const { fromGuild, guildLog } = require("../../functions.js");
const perms = Discord.Permissions.FLAGS;

module.exports = {
    name: 'kick',
    description: 'Kicks a user from the guild',
    usage: `{prefix}kick`,
    permissions: [perms.KICK_MEMBERS],
    async run(client, message, args) {
        //const client = message.client;
        const date = new Date();

        if (fromGuild(message)) {
            client.logger.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag} Ran command ${this.name}`);
            client.logger.debug(`Arguments used : '${args}'`);
        } else { return; }


        // Start Command
        let checks = message.member.hasPermission("KICK_MEMBERS") || message.author.id === client.config.ownerID;
        if (!checks) {
            await message.channel.send("You do not meet the permission requirements to use this command.");
            return;
        }

        const admin = message.member;
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        args.shift();
        const reason = args.join(" ").trim();

        if (user === null) return message.channel.send(`${message.author.username} You must tag the user`);

        if (user.hasPermission("KICK_MEMBERS"))
            return message.channel.send("You are not allowed to kick another admin.");

        if (!reason || reason === "")
            return message.channel.send("Reason must not be empty.");

        await user.kick(reason);
        user.send(`You have been kicked for ${reason} at ${message.guild.name} `)
            .catch(err => function () {
                console.log(err);
            });
        guildLog(message.guild, "kickMember", user, admin, reason);
    }
};

