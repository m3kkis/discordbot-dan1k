const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'rank',
    description: 'Display the level ranks.',
    args: false,
    usage: '',
    execute(client, message, args, _User, _XpHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setColor('#03b6fc')
            
        User.find({}).then( _User => {

            var arrAllUser = [];
            var fieldsToAdd = "";

            _User.map(function (user) {
                var jsonUser = {
                    "tag" : user.tag,
                    "level" : user.experience.level
                }
                arrAllUser.push(jsonUser);
            });

            arrAllUser.sort(function(a, b) {
                return parseFloat(b.level) - parseFloat(a.level);
            });

            arrAllUser.map( (user, index) => {
                fieldsToAdd += "**" + (index+1) + ".** " + user.tag + " • Lvl **" + user.level + "** - *" + _XpHandler.getExperienceRank(user.level)+ "*\n"
            });

            embedded.addField("Ranks",fieldsToAdd,true);

            return message.channel.send(embedded);
        });

    }
}