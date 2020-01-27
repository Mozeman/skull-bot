const {getGuildDefaultSettings, save_settings} = require("../functions");

module.exports = (client) => {
    console.log('Bot is ready!');
    console.log(`${client.commandCount} command(s) loaded!`);
    console.log(`${client.cogs.size} cog(s) loaded!`);
    console.log(`${client.eventsCount} events(s) loaded!`);

    client.guilds.array().forEach(function (guild) {
        if (!client.settings.hasOwnProperty(guild.id)) { // If guild id not found in settings
            client.logger.info(`Generated Default GuildSettings for guild '${guild.name}' (${guild.id})`);
            client.settings[guild.id] = getGuildDefaultSettings(guild);
        }
    });

    save_settings();
};