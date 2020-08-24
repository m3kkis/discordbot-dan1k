const Discord = require("discord.js");

module.exports = {
    name: 'crime',
    description: 'So you want to earn BIG, higher payout but higher chance to get caught',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler, _LootboxHandler){

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.crimeTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.crime.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.crime.last_updated = n;
            var reply = _JobHandler.doCrime(message, _User);
            var hasDrop = _LootboxHandler.checkForLootboxDrop();

            if(hasDrop){
                message.channel.send(reply);

                if(_User.inventory.length >= _User.inventorySize)
                {

                    var embedded = new Discord.MessageEmbed();
                    embedded.setColor('#ffd900')
                        .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                        .setDescription("Your inventory is full, you will receive $500 instead of a lootbox!");
                    return message.channel.send(embedded);
                }
                else
                {

                    var replyLootbox = _LootboxHandler.giveLootbox(message, _User);
                    message.channel.send(replyLootbox);
                }
            }
            else
            {
                message.channel.send(reply);
            }

            _User.save();
        }
        else
        {
            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#ff4f4f')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription("You cannot commit a crime for the next " + convertToMinutes(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }

        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

    }
}