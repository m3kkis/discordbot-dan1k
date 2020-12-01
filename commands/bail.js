const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'bail',
    description: 'Bail out prison for free in time or pay the bail amount to get released from prison right away',
    args: false,
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.isArrested == false ) {
            embedded.setColor('#ff4f4f')
                    .setDescription('You are not arrested.');

            return message.channel.send(embedded);
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
                    .setDescription(`You have to pay a minimum of \`$${addCommas(_User.arrest.priceBail)}\``);
    
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
                _User.arrest.last_updated = n;
                _User.arrest.priceBail = 0;
                _User.save();

                embedded.setColor('#78de87')
                        .setDescription(`A payment of \`$${addCommas(amount)}\` received. You are free to go.`);

                return message.channel.send(embedded);
            }

        }
        else
        {    
            var n = moment().valueOf();
            var timeLimit = 6 * ((1000 * 60) * 60); //time in prison 6 hours.
            var timeDifference = n - _User.arrest.last_updated;

            if( timeDifference > timeLimit )
            {
                _User.arrest.isArrested = false;
                _User.arrest.last_updated = n;
                _User.arrest.priceBail = 0;
                _User.save();

                embedded.setColor('#78de87')
                        .setDescription(`You have finished your sentence, you are free to go!`);

                return message.channel.send(embedded);
            }
            else
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You have ${moment.utc(timeLimit - timeDifference).format('HH:mm:ss')} left until you can bail for free\nOr you can pay bail at a price of \`$${addCommas(_User.arrest.priceBail)}\` by doing \`${process.env.BOT_PREFIX}bail ${priceBail}\``);

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