const Discord = require("discord.js");

module.exports = {
    name: 'statistics',
    description: 'Display your statistics. Can also view dealer stats if specified',
    args: false,
    usage: '<optional:dealer>',
    aliases: ['stats'],
    execute(client, message, args, _User, _Dealer){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')

        if(args[0] == 'dealer')
        {
            embedded.setDescription('Summary of the Dealer')
                .addFields(
                    { name:"Win", value: _Dealer.win, inline: true },
                    { name:"Loss", value: _Dealer.loss, inline: true },
                    { name:"Push", value: _Dealer.push, inline: true },
                    { name:"W/L", value: (_Dealer.win / _Dealer.loss), inline: true },
                    { name:"Cash Won", value: "$" + _Dealer.cash_won, inline: true },
                    { name:"Cash Lost", value: "$" + _Dealer.cash_lost, inline: true },
                );
        }
        else
        {
            embedded.setDescription('Summary of the player')
                .addFields(
                    { name:"Win", value: _User.blackjack.win, inline: true },
                    { name:"Loss", value: _User.blackjack.loss, inline: true },
                    { name:"Push", value: _User.blackjack.push, inline: true },
                    { name:"W/L", value: (_User.blackjack.win / _User.blackjack.loss), inline: true },
                    { name:"Cash Won", value: "$" + _User.blackjack.cash_won, inline: true },
                    { name:"Cash Lost", value: "$" + _User.blackjack.cash_lost, inline: true },
                    { name:"Cash Spent", value: "$" + _User.blackjack.cash_spent, inline: true },
                );
        }

        return message.channel.send(embedded);
    
    }
}