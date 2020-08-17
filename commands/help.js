const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Get the list of commands',
    args: false,
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setTitle("List of commands")

        client.commands.map(function (cmd) {
            embedded.addFields({
                name: cmd.name,
                value: cmd.description,
                inline: false
            });
        });

        return message.channel.send(embedded);

    }
}