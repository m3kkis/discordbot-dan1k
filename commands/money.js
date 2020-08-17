const Discord = require("discord.js");

module.exports = {
    name: 'money',
    description: 'Display all of your available money',
    args: false,
    usage: '',
    aliases: ['bal'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')
            .addFields(
                { name:"Cash", value: "$" + _User.economy.cash, inline: true },
                { name: 'Bank', value: "$" + _User.economy.bank, inline: true },
                { name:"Net Worth", value: "$" + (_User.economy.cash + _User.economy.bank), inline: true },
            )

        return message.channel.send(embedded);
    
    }
}