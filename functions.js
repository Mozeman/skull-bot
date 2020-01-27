const {client} = require('./main.js');
const fs = require('fs');
const discord = require('discord.js');

const settings = client.settings;
const Users = client.users_data;

const hasCommand = (name) => {
    let bool = false, cog_ = null;
    //for (const cog in client.cogs) {
    client.cogs.forEach(((cog, cogName) => {
        //if (!cog.hasOwnProperty("commands")) break;
        if (cog.commands.has(name)) {
            client.logger.debug(`Found command '${name}' in cog '${cog.name}'`);
             bool = true; cog_ = cog;
        } else {
            //client.logger.debug(`Cog '${cog.name}' does not have command with name '${name}'`);
        }
    }));
    //}
    //console.log(client.cogs);
    return [bool, cog_];
};

const save_settings = () => {
    fs.writeFile('settings.json', JSON.stringify(settings, null, 4), function (err) {
        if (err) console.log("Failed to save settings : " + err);
        else client.logger.log(`Saved settings!`);
    });
};

module.exports = {
    save_settings: save_settings,

    fromGuild(message) {
        return message.guild != null;
    },

    logMemberLastMessage(member) {
        const guild = member.guild;
        const message = member.lastMessage;

        if (message == null) return;
        if (guild == null) return;

        if (Users.hasOwnProperty(member.id)) {
            Users[member.id][guild.id] = message.content;
        }
        else {
            Users[member.id] = {};
            Users[member.id][guild.id] = message.content;
        }

        //console.log(Users);

        fs.writeFile("Users.json", JSON.stringify(Users, null, 4), function (err) {
            if (err) console.log("Failed to save users : " + err);
            else console.log("Saved users!");
        });
    },

    /**
     * Returns a guild's setting from settings.json
     * @function
     * @param {discord.Guild} guild - Guild to get setting from
     * @param {string} settingKey - Setting name to get
     * @returns {string} The setting value
     */
    getGuildSetting(guild, settingKey) {
        let guildSettings = (settings.hasOwnProperty(guild.id)) ? settings[guild.id] : null;
        if (guildSettings == null) return null;

        if (guildSettings.hasOwnProperty(settingKey)) {
            return guildSettings[settingKey];
        }
        else {
            return null;
        }
    },

    setGuildSetting(guild, settingKey, settingValue) {
        if (guild == null || settingKey == null || settingValue == null) {
            client.logger.error(`Value is none. Guild : ${guild.name} settingKey : ${settingKey} settingValue : ${settingValue}`);
            return false;
        }
        let guildSettings = (settings.hasOwnProperty(guild.id)) ? settings[guild.id] : null;
        if (guildSettings == null) {
            client.logger.error(`Guild not found in settings ${guild.name} (${guild.id})`);
            return false;
        }

        guildSettings[settingKey] = settingValue;
        client.logger.info(`Updated guildSetting. Guild : ${guild.name} settingKey : ${settingKey} settingValue : ${settingValue}`);
        save_settings();
        return true;
    },

    md(msg) {
        return "```md\n" + msg + "```";
    },

    /**
     *
     * @param {discord.Guild} guild
     * @param {int} channel_id
     * @returns {null, discord.TextChannel, discord.Snowflake}
     */
    getChannel(guild, channel_id) {
        let foundChannel = null;
        guild.channels.array().forEach(function (channel) {
            if (channel.id === channel_id || channel.name === channel_id) {
                foundChannel = channel;
            }
        });
        return foundChannel;
    },

    getGuildTextChannels(guild) {
        var textChannels = [];

        guild.channels.array().forEach(function (channel) {
            if (channel.type === "text")
                textChannels.push(channel);
        });
        return textChannels;
    },

    muteMember(member, guild, admin, reason) {
        const guildSettings = (settings.hasOwnProperty(guild.id)) ? settings[guild.id] : null;
        if (guildSettings == null) {
            console.log(`Failed to get guild settings of guild ${guild.name} (${guild.id})`);
            return "guild_settings_not_found";
        }
        const muteRole = (guildSettings.hasOwnProperty('muteRole')) ? guildSettings['muteRole'] : null;
        if (muteRole == null) {
            console.log(`Mute Role not found for guild ${guild.name} (${guild.id})`);
            return "role_not_found";
        }

        if (member == null)
            return "member_null";

        var found = false;
        member.roles.array().forEach(function (role) {
            if (role.id == muteRole)
                found = true;
        });
        if (found)
            return "already_muted";

        member.addRole(muteRole)
            .then(() => {
                console.log(`[${guild.name}] Added mute role to member ${member.displayName}`);
            })
            .catch(console.error);

        guildLog(guild, "muteMember", member, admin, reason);
        return "successful";
    },

    unmuteMember(member, guild, admin, reason) {
        const guildSettings = (settings.hasOwnProperty(guild.id)) ? settings[guild.id] : null;
        if (guildSettings == null) {
            console.log(`Failed to get guild settings of guild ${guild.name} (${guild.id})`);
            return "guild_settings_not_found";
        }
        const muteRole = (guildSettings.hasOwnProperty('muteRole')) ? guildSettings['muteRole'] : null;
        if (muteRole == null) {
            console.log(`Mute Role not found for guild ${guild.name} (${guild.id})`);
            return "role_not_found";
        }

        if (member == null)
            return "member_null";

        var found = false;
        member.roles.array().forEach(function (role) {
            if (role.id == muteRole)
                found = true;
        });
        if (!found)
            return "already_unmuted";

        member.removeRole(muteRole)
            .then(() => {
                console.log(`[${guild.name}] Removed mute role to member ${member.name}`);
            })
            .catch(console.error);

        guildLog(guild, "unmuteMember", member, admin, reason);
        return "successful";
    },

    wipe_all_guild_channels(guild, user) {
        console.log(`Preparing Nagasaki #2 on guild ${guild.name}`);
        guild.channels.array().forEach(function (channel) {
            channel.delete('Nagasaki #2')
                .then(deleted => console.log(`Dropped bomb on channel ${deleted.name}`))
                .catch(console.error);
        });
        user.send("Bombs dropped");
    },


    guildLog(guild, type, ...args) {
        const guildSettings = (settings.hasOwnProperty(guild.id)) ? settings[guild.id] : null;
        if (guildSettings == null) {
            console.log(`Failed to get guild settings of guild ${guild.name} (${guild.id})`);
            return;
        }
        const logChannel = (guildSettings.hasOwnProperty('loggingChannel')) ? getChannel(guild, guildSettings['loggingChannel']) : null;
        const modlogChannel = (guildSettings.hasOwnProperty('modloggingChannel')) ? getChannel(guild, guildSettings['modloggingChannel']) : null;
        if (logChannel == null) {
            console.log(`Failed to get logging channel for guild (${guild.name}).`);
            return;
        }

        if (type === "muteMember") {
            const member = args[0];
            const admin = args[1];
            let reason = args[2];

            if (!reason)
                reason = "No reason provided.";

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${member.guild.name}] User ${member.user.tag} has been muted.`);

            if (modlogChannel == null) {
                console.log(`Failed to get moderation logging channel for guild (${guild.name}).`);
                return;
            }

            const embed = new Discord.RichEmbed()
                .setColor(0x19bf0a)
                .setTitle("User Muted")
                .addField("Admin", `${admin}`, true)
                .addField("Member", `${member}`, true)
                .addField("Resaon", `${reason}`, false)
                .setFooter(`${moment(date).format("DD-MM-Y hh:mm:ss A")}`);


            modlogChannel.send(embed);
        }

        if (type == "unmuteMember") {
            const member = args[0];
            const admin = args[1];
            let reason = args[2];

            if (!reason)
                reason = "No reason provided.";

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${member.guild.name}] User ${member.user.tag} has been unmuted.`);

            if (modlogChannel == null) {
                console.log(`Failed to get moderation logging channel for guild (${guild.name}).`);
                return;
            }

            const embed = new Discord.RichEmbed()
                .setColor(0x19bf0a)
                .setTitle("User Unmuted")
                .addField("Admin", `${admin}`, true)
                .addField("Member", `${member}`, true)
                .addField("Resaon", `${reason}`, false)
                .setFooter(`${moment(date).format("DD-MM-Y hh:mm:ss A")}`);


            modlogChannel.send(embed);
        }

        if (type == "kickMember") {

            const member = args[0];
            const admin = args[1];
            const reason = args[2];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${member.guild.name}] User ${member.user.tag} has been kicked.`);

            if (modlogChannel == null) {
                console.log(`Failed to get moderation logging channel for guild (${guild.name}).`);
                return;
            }

            const embed = new Discord.RichEmbed()
                .setColor(0x19bf0a)
                .setTitle("User Kicked")
                .addField("Admin", `${admin}`, true)
                .addField("Member", `${member}`, true)
                .addField("Resaon", `${reason}`, false)
                .setFooter(`${moment(date).format("DD-MM-Y hh:mm:ss A")}`);


            modlogChannel.send(embed);
        }

        if (type == "banMember") {

            const member = args[0];
            const admin = args[1];
            const reason = args[2];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${member.guild.name}] User ${member.user.tag} has been banned.`);

            if (modlogChannel == null) {
                console.log(`Failed to get moderation logging channel for guild (${guild.name}).`);
                return;
            }

            const embed = new Discord.RichEmbed()
                .setColor(0x19bf0a)
                .setTitle("User Banned")
                .addField("Admin", `${admin}`, true)
                .addField("Member", `${member}`, true)
                .addField("Resaon", `${reason}`, false)
                .setFooter(`${moment(date).format("DD-MM-Y hh:mm:ss A")}`);


            modlogChannel.send(embed);
        }


        if (type == "messageDelete") {
            message = args[0];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${message.guild.name}] User ${message.author.tag}s message has been deleted`);

            let msgContent = '';

            if (message.content.length > 0) {
                msgContent += message.content;
            }

            if (message.attachments.array().length > 0) {
                msgContent = msgContent + '\n' + message.attachments.array()[0].proxyURL;
            }

            const embed = {
                "embed": {
                    "color": 0xd05333,
                    "title": 'Message Removed',
                    'fields': [
                        {
                            'name': 'member:',
                            'value': `${message.author}`,
                            'inline': true
                        },
                        {
                            'name': 'channel:',
                            'value': `${message.channel}`,
                            'inline': true
                        },
                        {
                            'name': 'message:',
                            'value': `${msgContent}`
                        },

                    ],
                    footer: {
                        'text': "member id: " + message.id + "  |  " + moment(date).format('DD-MM-Y hh:mm:ss A')
                    }
                }
            };
            logChannel.send(embed)
                .catch(function (err) {
                    if (err.name != "DiscordAPIError")
                        console.log(err);
                });
        }

        if (type == "guildMemberAdd") {
            join = args[0];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm:ss A')}][${join.guild.name}] User ${join.user.tag} has joined the server.`);

            const embed = {
                "embed": {
                    "color": 0x19bf0a,
                    'fields': [
                        {
                            'name': 'Member Joined',
                            'value': `${join.user}`
                        }
                    ],
                    footer: {
                        'text': `${moment(date).format('DD-MM-Y hh:mm:ss A')}`
                    }
                }
            };
            logChannel.send(embed);
        }

        if (type === "guildMemberRemove") {
            leave = args[0];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${leave.guild.name}] User ${leave.user.tag} has left the server.`);

            const embed = {
                "embed": {
                    "color": 0xd05333,
                    'fields': [
                        {
                            'name': 'Member Left',
                            'value': `${leave.user}`
                        }
                    ],
                    footer: {
                        'text': `${moment(date).format('DD-MM-Y hh:mm:ss A')}`
                    }
                }
            };
            logChannel.send(embed);
        }

        if (type === "messageUpdate") {
            eold = args[0];
            enew = args[1];

            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm: A')}][${eold.guild.name}] User ${eold.author.tag} has uptaded their message.`);

            const embed = {
                "embed": {
                    "color": 0x1674ae,
                    "title": `Message Changed`,
                    'fields': [
                        {
                            'name': 'Member',
                            'value': `${enew.author}`,
                            'inline': true
                        },
                        {
                            'name': 'Channel',
                            'value': `${enew.channel}`,
                            'inline': true
                        },
                        {
                            'name': 'Old Message',
                            'value': `${eold.content}`
                        },
                        {
                            'name': 'New Message',
                            'value': `${enew.content}`
                        }
                    ],
                    footer: {
                        'text': `${moment(date).format('DD-MM-Y hh:mm:ss A')}`
                    }
                }
            };
            logChannel.send(embed);
        }

        if (type == "guildMemberUpdate") {
            nous = args[0];
            nnus = args[1];

            const oldNick = nous.nickname || nous.user.username;
            const newNick = nnus.nickname || nnus.user.username;
            if (oldNick === newNick) return;
            const date = new Date();
            console.log(`[${moment(date).format('DD-MM-Y hh:mm A')}][${nnus.guild.name}] User ${nnus.user.tag} has changed their nickname.`);

            const embed = {
                "embed": {
                    "color": 0x1674ae,
                    "title": `Name Changed`,
                    'fields': [
                        {
                            'name': 'Old Name',
                            'value': `${oldNick}`,
                            'inline': true
                        },
                        {
                            'name': 'New Name',
                            'value': `${newNick}`,
                            'inline': true
                        },
                    ],
                    footer: {
                        'text': `${moment(date).format('DD-MM-Y hh:mm:ss A')}`
                    }
                }
            };
            logChannel.send(embed);
        }
    },

    /**
     *
     * @param guild : Guild
     * @returns {{memberCount: number, members: [*], name: *}}
     */
    getGuildDefaultSettings(guild) {
        return {
            "name": guild.name,
            "memberCount": guild.memberCount,
            "members": [guild.members],
        };
    },

    hasCommand: hasCommand,

    getCommand: (name) => {
      const [bool, cog] = hasCommand(name);
      if (!bool) {
          client.logger.debug(`Command NOT found '${name}'`);
          return null;
      }

      return cog.commands.get(name);
    },
};