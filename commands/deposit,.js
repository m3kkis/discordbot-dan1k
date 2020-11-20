const Discord = require("discord.js");

module.exports = {
    name: 'deposit',
    description: 'Deposit cash to your bank',
    args: true,
    usage: '<amount>',
    aliases: ['dep'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.travel.location != "city" && _User.travel.location != "townhall" ) {
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **CITY** to deposit cash.');

            return message.channel.send(embedded);
        }

        if(args[0].toLowerCase() == "all")
        {
            if(_User.economy.cash <= 0)
            {
                console.log("[DEPOSIT] 0 in cash.");
                embedded.setColor('#ff4f4f')
                    .setDescription(`❌ You have \`$0\` in cash`)
                return message.channel.send(embedded);
            }

            console.log("[DEPOSIT] Deposit all");
    
            var tempCash = _User.economy.cash;
            _User.economy.bank += tempCash;
            _User.economy.cash -= tempCash;

            _User.save();

            embedded.setColor('#78de87')
                .setDescription(`✅ Deposited \`$${addCommas(tempCash)}\` to your bank!`)
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
    
            if( amount <= _User.economy.cash )
            {
                console.log("[DEPOSIT] Good deposit amount");
    
                _User.economy.cash -= amount;
                _User.economy.bank += amount;
    
                _User.save();
    
                embedded.setColor('#78de87')
                    .setDescription(`✅ Deposited \`$${addCommas(amount)}\` to your bank!`)
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

        function addCommas(num){

            var numToCommafy = num.toString();
            var numCommafied = '';
        
            for (var i = numToCommafy.length; i > 0; i -= 3) {
                numCommafied = numToCommafy.slice(Math.max(i - 3, 0), i) + (numCommafied ? ',' + numCommafied : '');
            }
            
            return numCommafied;
        }
    }
}