const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'leaderboard',
    description: 'Display the leaderboard.',
    args: false,
    usage: '',
    aliases: ['lb'],
    execute(client, message, args, _User){

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
                    "score" : (user.economy.cash + user.economy.bank)
                }
                arrAllUser.push(jsonUser);
            });

            arrAllUser.sort(function(a, b) {
                return parseFloat(b.score) - parseFloat(a.score);
            });

            arrAllUser.map( (user, index) => {
                fieldsToAdd += "**" + (index+1) + ".** " + user.tag + " • \`$" + user.score + "\`\n"
            });

            embedded.addField("Leaderboard",fieldsToAdd,true);

            return message.channel.send(embedded);
        });
    }
}