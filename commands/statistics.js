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
            embedded.addFields(
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
            embedded.addFields(
                    { 
                        name:"Cash", 
                        value: "$"+_User.economy.cash, 
                        inline: true 
                    },
                    { 
                        name:"Bank", 
                        value: "$"+_User.economy.bank, 
                        inline: true 
                    },
                    { 
                        name:"Networth", 
                        value: "$"+(_User.economy.cash + _User.economy.bank), 
                        inline: true 
                    },
                    { 
                        name:"Work", 
                        value: "Success: " + _User.jobs.work.times_used_success + 
                               "\nFailed: " + _User.jobs.work.times_used_failed + 
                               "\nEarned: $" + _User.jobs.work.cash_earned +
                               "\nLost: $" + _User.jobs.work.cash_lost,
                        inline: true 
                    },
                    { 
                        name:"Slut", 
                        value: "Success: " + _User.jobs.slut.times_used_success + 
                               "\nFailed: " + _User.jobs.slut.times_used_failed + 
                               "\nEarned: $" + _User.jobs.slut.cash_earned +
                               "\nLost: $" + _User.jobs.slut.cash_lost,
                        inline: true 
                    },
                    { 
                        name:"Crime", 
                        value: "Success: " + _User.jobs.crime.times_used_success + 
                               "\nFailed: " + _User.jobs.crime.times_used_failed + 
                               "\nEarned: $" + _User.jobs.crime.cash_earned +
                               "\nLost: $" + _User.jobs.crime.cash_lost,
                        inline: true 
                    },
                    { 
                        name:"BlackJack", 
                        value: "Win: " + _User.blackjack.win + 
                               "\nFailed: " + _User.blackjack.loss + 
                               "\nPush: " + _User.blackjack.push +
                               "\nW/L: " + (_User.blackjack.win / _User.blackjack.loss),
                        inline: true 
                    },
                    { 
                        name:"---", 
                        value: "Cash made: $" + _User.blackjack.cash_won + 
                               "\nCash lost: $" + _User.blackjack.cash_lost + 
                               "\nCash spent: $" + _User.blackjack.cash_spent,
                        inline: true 
                    },
                    { 
                        name:"-----", 
                        value: "\u200B",
                        inline: true 
                    },
                );
        }

        return message.channel.send(embedded);
    
    }
}