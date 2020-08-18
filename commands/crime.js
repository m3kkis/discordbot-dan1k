const Discord = require("discord.js");

module.exports = {
    name: 'crime',
    description: 'So you want to earn BIG, higher payout but higher chance to get caught',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler){

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.crimeTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.crime.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.crime.last_updated = n;
            var reply = _JobHandler.doCrime(message.member.user.tag, message.member.user.avatarURL(), _User);
            return message.channel.send(reply);
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