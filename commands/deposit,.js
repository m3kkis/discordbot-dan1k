const Discord = require("discord.js");

module.exports = {
    name: 'deposit',
    description: 'Deposit cash to your bank',
    args: true,
    usage: '<amount>',
    aliases: ['dep'],
    execute(client, message, args, _User){

        var amount = Math.abs(parseInt(args[0]));

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }

        if( amount <= _User.economy.cash )
        {
            console.log("[DEPOSIT] Good deposit amount");

            _User.economy.cash -= amount;
            _User.economy.bank += amount;

            _User.save();

            embedded.setColor('#78de87')
                .setDescription(`✅ Deposited $${amount} to your bank!`)
            return message.channel.send(embedded);
        }
        else
        {
            console.log("[DEPOSIT] Not enough cash.");
            embedded.setColor('#ff4f4f')
                .setDescription(`❌ Can't deposit to bank, not enough cash`)
            return message.channel.send(embedded);
        }

    }
}