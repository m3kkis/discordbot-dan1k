const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'location',
    description: 'View your current location or list all locations',
    args: false,
    aliases: ['loc'],
    usage: '<optional:list>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL());
        
        if(args[0] != undefined && args[0].toLowerCase() == "list")
        {
            console.log("[LOCATION] Displaying location list.");

            embedded.setDescription(`You can travel to any of these location listed by using the command \`${process.env.BOT_PREFIX}travel <location>\``)
                    .addFields(
                        { name: ':cityscape: City', value: '*Main area where you can work at different jobs, buy and sell at the store, withdraw and deposit your money at the bank.*' },
                        { name: ':slot_machine: Casino', value: '*What happens at the casino, stays at the casino. Gamble your life savings away with blackjack or slot machines!*'},
                        { name: ':crossed_swords: Arena', value: '*Coming Soon...*'},
                        { name: ':hospital: Hospital', value: '*Coming Soon...*'},
                        { name: ':muscle: Gym', value: '*Coming Soon...*'},
                    )
            return message.channel.send(embedded);
        }
        else
        {
            console.log("[LOCATION] Displaying curent location.");

            var jsonLocEmoji = {
                "city":":cityscape:",
                "casino":":slot_machine:",
            };

            embedded.setDescription(`You are currently in the ${jsonLocEmoji[_User.travel.location]} **${_User.travel.location.toUpperCase()}**`)

            User.find({}).then( _AllUsers => {

                var arrPlayers = [];
                var fieldsToAdd = "";
    
                _AllUsers.map(function (otherUser) {
                    if( otherUser.tag != _User.tag && otherUser.travel.location == _User.travel.location)
                    {
                        arrPlayers.push(otherUser.tag);
                    }          
                });

                if(arrPlayers.length > 0)
                {
                    arrPlayers.forEach(player =>{
                        fieldsToAdd += "- " + player + "\n";
                    });

                    embedded.addFields(
                        { name: 'Other players near you:', value: fieldsToAdd },
                    );

                }
                else
                {
                    embedded.addFields(
                        { name: 'Other players near you:', value: '*-NONE-*' },
                    );
                }

                return message.channel.send(embedded);

            });
        }
    }
}