const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'release',
    description: 'Release a player from prison. Only police.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        
        if( _User.isPolice == false) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('Only a Police Officer can release a player from prison.');

            return message.channel.send(embedded);
        }
        

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        var victim = args[0];

        if( victim.substring(0,2) == '<@')
        {
            victim = victim.replace(/[^$\w\s]/gi, '');
        }
        else
        {
            try{
                victim = client.users.cache.find(u => u.username === victim).id;
            }
            catch{
                console.log("[RELEASE] ID of the Username provided does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        }

        User.findOne({
            dsid: victim
        }).then( _Victim => {

            if(_Victim)
            {
                console.log("[RELEASE] Found victim ID.");

                if( _Victim.arrest.isArrested != true ) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('The player is not arrested.');
        
                    return message.channel.send(embedded);
                }
                else if( _User.travel.location != _Victim.travel.location) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You must be in prison to release the player.');
        
                    return message.channel.send(embedded);
                }
                else
                {
                    var n = moment().valueOf();

                    _Victim.arrest.isArrested = false;
                    _Victim.arrest.last_updated = n;

                    _Victim.save();

                    embedded.setColor('#3849ff')
                            .setDescription(`You have release **${_Victim.tag}** from prison`);
                    return message.channel.send(embedded);
                }
 
            }
            else
            {
                console.log("[RELEASE] DSID does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        });

        function addCommas(num){

            var numToCommafy = num.toString();
            var numCommafied = '';
        
            for (var i = numToCommafy.length; i > 0; i -= 3) {
                numCommafied = numToCommafy.slice(Math.max(i - 3, 0), i) + (numCommafied ? ',' + numCommafied : '');
            }
            
            return numCommafied;
        }


    }
}