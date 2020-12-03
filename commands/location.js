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
                        { name: ':lock: Prison', value: '*Be a good citizen of discord or else a police officer will stop you  and you will end up here.*'},
                        { name: ':rice_scene: Farm', value: '*Farm your resources, legal or illegal. Just don\'t get caught.*'},
                        { name: ':classical_building: Townhall', value: '*Only the mayor can be at the townhall to feel safe and secure to do his stuff.*'},
                        { name: `:desktop: Cryptofarm`, value: '*Mine crypto coins and sell using real data. Must have __Access Card__ to enter.*'},
                        { name: `:dna: Lab`, value: '*Visit here to process your crops or drugs... into something better!*'},
                        { name: `:crossed_swords: Arena`, value: '*Fight, train and upgrade your battle pet!*'},
                    )
            return message.channel.send(embedded);
        }
        else
        {





            /** travel time, probably needs its own class, fix later */
        
            var dTravel = new Date();
            var nTravel = dTravel.getTime();

            var objTravelMethodTime = {
                "portal" : 0,
                "helicopter" : 1,
                "boat" : 2,
                "car" : 3,
                "bicycle" : 4,
                "walk" : 5
            }

            var traveltimeLimit = objTravelMethodTime[_User.travel.last_method] * (1000 * 60);
            var traveltimeDifference = nTravel - _User.travel.last_updated;

            if( traveltimeDifference > traveltimeLimit )
            {
                _User.travel.last_updated = nTravel;
                _User.travel.isTraveling = false;
                _User.save();
            }


            function convertToMinutes(timestamp) {
                var min = Math.floor(timestamp / 60000);
                var sec = ((timestamp % 60000) / 1000).toFixed(0);
                return min + ":" + (sec < 10 ? '0' : '') + sec;
            }
    
            /******************************************************** */





            if( _User.travel.isTraveling == true ) {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You are currently traveling to the **${_User.travel.location.toUpperCase()}** by ***${_User.travel.last_method.toUpperCase()}***, cannot use __that command__ until you arrive in **${convertToMinutes(traveltimeLimit - traveltimeDifference)}**`);
                
                return message.channel.send(embedded);
            }
            else
            {

                console.log("[LOCATION] Displaying curent location.");

                var jsonLocEmoji = {
                    "city":":cityscape:",
                    "casino":":slot_machine:",
                    "townhall":":classical_building:",
                    "prison":":lock:",
                    "cryptofarm":":desktop:",
                    "farm":":rice_scene:",
                    "lab":":dna:",
                    "arena":":crossed_swords:"
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
}