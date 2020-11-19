const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'harvest',
    description: 'Harvest either legal or illegal plants. Sell them for extra cash! But don\'t get caught.',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler, _LootboxHandler){

        if( _User.travel.location != "farm" ) {
            
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setColor('#ff4f4f')
                    .setDescription('You must be at the **FARM** to harvest.');

            return message.channel.send(embedded);
        }

        var n = moment().valueOf();

        var timeLimit = _JobHandler.harvestTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.harvest.last_updated;

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
                console.log("[HARVEST] Harvest success.");
                _User.jobs.harvest.last_updated = n;
                var reply = _JobHandler.doHarvest(message, _User);
                _User.save();
                message.author.send(">>> You have harvested a **" + reply.type + "**");
                return message.channel.send(reply.embd);
            }
        }
        else
        {
            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#ff4f4f')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription("You cannot harvest for the next " + moment.utc(timeLimit - timeDifference).format('HH:mm:ss'));
            return message.channel.send(embedded);
        }
        
    }
}