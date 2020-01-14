const fs = require('fs');
const Discord = require('discord.js');

const {prefix, token, log_level} = require('./config.json');
const settings = require('./settings.json');
const message = require('./data/msg.json');
const users_data = require('./data/users_data.json');

const client = new Discord.Client();
client.config = require('./config');
client.commands = new Discord.Collection();
client.cogs = new Discord.Collection();
client.cogs.set("default", client.commands);
client.prefix = prefix;
client.commandCount = 0;

let logger = require('./logger.js');
client.logger = logger = new logger.Logger();
logger.setlevel(log_level);
logger.log(`Logger initialized. Log Level : ${log_level}`);

module.exports.client = client;


const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    logger.debug(`Loaded event '${eventName}'`);
    client.on(eventName, event.bind(null, client));
}
client.eventsCount = eventFiles.length;

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js') && !f.startsWith("_"));
const cogDirs = fs.readdirSync('./commands', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const cogDir of cogDirs) {
    const cogCommandFiles = fs.readdirSync(`./commands/${cogDir}`).filter(f => f.endsWith('.js'));
    let cogName, cogDescription, cogAuthor;
    if (fs.existsSync(`./commands/${cogDir}/cog-info.json`)) {
        let {name, description, author} = require(`./commands/${cogDir}/cog-info.json`);
        cogName = name; cogDescription = description; cogAuthor = author;
        logger.debug(`Loaded cog-info for '${name}'`);
    } else {
        logger.warn(`cog-info not found for cog '${cogDir}'`);
    }



    const cog = {
        name: cogName || cogDir,
        description: cogDescription || "No Description",
        author: cogAuthor || "SkullOG",
        commands: new Discord.Collection()
    };

    for (const file of cogCommandFiles) {
        const command = require(`./commands/${cogDir}/${file}`);
        cog.commands.set(command.name, command);
        logger.debug(`Loaded command '${command.name}' for cog '${cog.name}'`);
        client.commandCount++;
        //client.commands.set(command.name, command);
    }
    client.cogs.set(cogDir, cog);
    logger.debug(`Finished loading cog '${cog.name}'.  Commands : ${cog.commands.size}`);
}
//client.cogsCount = cogDirs.length;
const defaultCog = {
    name: "Default",
    description: "Uncategorized Commands",
    author: "SkullOG",
    commands: new Discord.Collection()
};

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    defaultCog.commands.set(command.name, command);
    client.commandCount++;
    //client.commands.set(command.name, command);
}
client.cogs.set("default", defaultCog);

client.login(token);