const Discord = require("discord.js");

module.exports = {
    name: 'slut',
    description: 'You slut yourself into dirty jobs for extra cash',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler){

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.slutTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.slut.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.slut.last_updated = n;
            var reply = _JobHandler.doSlut(message.member.user.tag, message.member.user.avatarURL(), _User);
            return message.channel.send(reply);
        }
        else
        {
            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#ff4f4f')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription("You cannot be a slut for the next " + convertToMinutes(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }

        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

    }
}