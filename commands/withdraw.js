const Discord = require("discord.js");

module.exports = {
    name: 'withdraw',
    description: 'Withdaw <amount> from your bank',
    args: true,
    usage: '<amount>',
    aliases: ['with'],
    execute(client, message, args, _User){

        var amount = Math.abs(parseInt(args[0]));

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }


        if( amount <= _User.economy.bank )
        {
            console.log("[WITHDRAW] Good withdraw amount");
            
            _User.economy.bank -= amount;
            _User.economy.cash += amount;

            _User.save();
            
            embedded.setColor('#78de87')
                .addField("Success withdraw","Thank you for doing business with us.",true)
            return message.channel.send(embedded);
        }
        else
        {
            console.log("[WITHDRAW] Not enough in bank.");
            embedded.setColor('#ff4f4f')
                .addField("Failed withdraw","It looks like you do not have enough in the bank to withdraw that amount.",true)
            return message.channel.send(embedded);
        }

    }
}