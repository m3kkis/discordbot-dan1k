const Discord = require("discord.js");
const XpHandler = require("../handlers/XpHandler");

module.exports = {
    name: 'level',
    description: 'Show your current level status.',
    args: false,
    usage: '',
    aliases: ['xp','lvl'],
    execute(client, message, args, _User, _XpHandler){

        console.log("[LEVEL] Showing Level Info.");

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')

        var requiredXp = _XpHandler.calculateTotalPointsRequired(_User.experience.level);
        var currentPoints = _User.experience.points;

        /* PROGRESS BAR*/
        var pointsPercentage = Math.floor((currentPoints * 100) / requiredXp);
        var amountOfTens = Math.floor(pointsPercentage/10)*2;
        var strProgressBar = "[";
        for(var i = 0; i < 20; i++)
        {
            if(i <= amountOfTens)
            {
                strProgressBar += "■";
            }
            else
            {
                strProgressBar += "-";
            }
        }
        strProgressBar += "]"

        embedded.setDescription( "*" + _XpHandler.getExperienceRank(_User.experience.level) + "*" );

        embedded.addFields(
            { name: 'Level', value: _User.experience.level, inline: true  },
            { name: 'Progress', value: strProgressBar, inline: true },
            { name: '\u200B', value: `${_User.experience.points}/${requiredXp}`, inline: true }
        )
        
        return message.channel.send(embedded);

    }
}