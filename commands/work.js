const Discord = require("discord.js");

module.exports = {
    name: 'work',
    description: 'Your safest method of earning cash but the least rewarding',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler, _LootboxHandler){

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.workTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.work.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.work.last_updated = n;
            var reply = _JobHandler.doWork(message, _User);
            _User.save();
            return message.channel.send(reply);
        }
        else
        {
            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#ff4f4f')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription("You cannot work for the next " + convertToMinutes(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }

        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

    }
}