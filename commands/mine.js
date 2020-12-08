const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'mine',
    description: 'Mine a crypto coin and then sell it in store using real data. Or buy stuff from the CryptoStore',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler, _LootboxHandler){

        if( _User.travel.location != "cryptofarm" ) {
            
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setColor('#ff4f4f')
                    .setDescription('You must be at the **CRYPTOFARM** to mine.');

            return message.channel.send(embedded);
        }

        if ( _User.inventory.filter(item => item.name === 'access_card_cryptofarm').length < 1) {
            embedded.setColor('#ff4f4f')
                    .setDescription('You need an __Access Card__ to mine cryptocurrency.');

            return message.channel.send(embedded);
        }

        var n = moment().valueOf();

        var timeLimit = _JobHandler.mineTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.mine.last_updated;

        if( timeDifference > timeLimit )
        {
            if(_User.inventory.length >= _User.inventorySize)
            {
                var embedded = new Discord.MessageEmbed();
                embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                        .setColor('#ff4f4f')
                        .setDescription('Your inventory is full');
    
                return message.channel.send(embedded);
            }
            else
            {
                console.log("[MINE] Mine success.");
                _User.jobs.mine.last_updated = n;
                _JobHandler.doMine(message, _User);
            }
        }
        else
        {
            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#ff4f4f')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription("You cannot mine for the next " + moment.utc(timeLimit - timeDifference).format('HH:mm:ss'));
            return message.channel.send(embedded);
        }
        
    }
}