const Discord = require("discord.js");

module.exports = {
    name: 'roll',
    description: 'Displays a random number between 1-100.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        console.log("[ROLL] Displaying roll result.");

        var randomNbr = Math.floor(Math.random() * 100) + 1;

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription(`You have rolled a **${randomNbr}**`);


        return message.channel.send(embedded);
    }
}