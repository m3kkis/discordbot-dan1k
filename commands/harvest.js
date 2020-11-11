const Discord = require("discord.js");

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

        var d = new Date();
        var n = d.getTime();

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
                .setDescription("You cannot harvest for the next " + convertToHours(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }
        
        /*
        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }
        */

        function convertToHours(timestamp){
            var date = new Date(timestamp);
            var hours = date.getHours();
            var min = "0" + date.getMinutes();
            var sec = "0" + date.getSeconds();
            var formattedTime = hours + ':' + min.substr(-2) + ':' + sec.substr(-2);
            return formattedTime;
        }
        

    }
}