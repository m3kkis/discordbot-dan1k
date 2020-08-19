const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Get the list of commands',
    args: false,
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setTitle("List of commands")

        var reply = "For more info visit https://github.com/m3kkis/discordbot-dan1k \n\n";
        client.commands.map(function (cmd) {
            reply += "\`" + process.env.BOT_PREFIX + cmd.name + "\` : " + cmd.description + "\n";
        });

        embedded.setDescription(reply);

        return message.channel.send(embedded);

    }
}