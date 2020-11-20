const Discord = require("discord.js");

module.exports = {
    name: 'bail',
    description: 'Pay the bail amount to get released from prison',
    args: false,
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.isArrested == false ) {
            embedded.setColor('#ff4f4f')
                    .setDescription('You are not arrested.');

            return message.channel.send(embedded);
        }

        var usrNetworth = _User.economy.cash + _User.economy.bank;
        var priceBail = 0;
        if(usrNetworth > 100)
        {
            priceBail = Math.floor( usrNetworth * 0.15);
        }
        else
        {
            priceBail = 100;
        }

        if(args[0] != undefined)
        {
            var amount = Math.abs(parseInt(args[0]));

            if( isNaN(amount) ) {
                
                embedded.setColor('#ff4f4f')
                    .setDescription('That doesn\'t seem to be a valid NUMBER.');
    
                return message.channel.send(embedded);
            }

            if(amount < priceBail)
            {
                embedded.setColor('#ff4f4f')
                    .setDescription(`You have to pay a minimum of \`$${addCommas(priceBail)}\``);
    
                return message.channel.send(embedded);
            }
            if(amount >= _User.economy.cash)
            {
                embedded.setColor('#ff4f4f')
                    .setDescription('You don\`t have that amount in cash.');
    
                return message.channel.send(embedded);
            }
            else
            {
                _User.economy.cash -= amount;
                _User.arrest.isArrested = false;
                _User.save();

                embedded.setColor('#78de87')
                        .setDescription(`A payment of \`$${addCommas(amount)}\` received. You are free to go.`);

                return message.channel.send(embedded);
            }

        }
        else
        {    
            embedded.setColor('#03b6fc')
                    .setDescription(`You need to pay 15% of your networth or \`$100\` if you have a networth less than $100, to be able to bail out of prison.\nIn your case, it will be \`$${addCommas(priceBail)}\` to do so, you need to type \`${process.env.BOT_PREFIX}bail ${priceBail}\` you must have the money in cash`);
    
            return message.channel.send(embedded);
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