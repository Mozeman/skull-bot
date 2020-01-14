module.exports = (client) => {
    console.log('Ready!');
    console.log(`${client.commandCount} command(s) loaded!`);
    console.log(`${client.cogs.size} cog(s) loaded!`);
    console.log(`${client.eventsCount} events(s) loaded!`);
};