const {getCommand} = require("../functions");

module.exports = (client, message) => {
    let prefix = client.prefix;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    //if (!client.commands.has(commandName)) return;

    try {
        const command = getCommand(commandName);
        if (command == null) {
            // client.logger.error(`Command returned as null '${commandName}'`);
            return;
        }
        //const command = client.commands.get(commandName);
        command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply(`Error handling command: \`${commandName}\`. Check console and logs for more info.`);
    }
};