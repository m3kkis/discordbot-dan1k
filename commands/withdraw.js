const Discord = require("discord.js");

module.exports = {
    name: 'withdraw',
    description: 'Withdaw cash from your bank',
    args: true,
    usage: '<amount>',
    aliases: ['with'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if(args[0].toLowerCase() == "all")
        {
            if(_User.economy.bank == 0)
            {
                console.log("[WITHDRAW] 0 in the bank.");
                embedded.setColor('#ff4f4f')
                    .setDescription(`❌ You have **$0** in the bank`)
                return message.channel.send(embedded);
            }

            console.log("[WITHDRAW] Withdraw all");

            var tempCash = _User.economy.bank;
            _User.economy.bank -= tempCash;
            _User.economy.cash += tempCash;

            _User.save();

            embedded.setColor('#78de87')
                .setDescription(`✅ Withdrew **$${tempCash}** from your bank!`)
            return message.channel.send(embedded);
        }
        else
        {
            var amount = Math.abs(parseInt(args[0]));

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
                    .setDescription(`✅ Withdrew **$${amount}** from your bank!`)
                return message.channel.send(embedded);
            }
            else
            {
                console.log("[WITHDRAW] Not enough in bank.");
                embedded.setColor('#ff4f4f')
                    .setDescription(`❌ Can't withdraw that amount from bank`)
                return message.channel.send(embedded);
            }
        }

    }
}