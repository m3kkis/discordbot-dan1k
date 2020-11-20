const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'arrest',
    description: 'Arrest a player and send them to prison.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        
        if( _User.isPolice == false) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('Only a Police Officer can arrest a player.');

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
                console.log("[ARREST] ID of the Username provided does not exist.");
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
                console.log("[ARREST] Found victim ID.");

                var n = moment().valueOf();

                var timeLimit = 15 * (1000 * 60); //prison time limit
                var timeDifference = n - _Victim.arrest.last_updated;

                if( _Victim.isPolice == true ) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('Can\'t arrest a Police Officer.');
        
                    return message.channel.send(embedded);
                }
                else if( _Victim.arrest.isArrested == true ) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('The user is already arrested.');
        
                    return message.channel.send(embedded);
                }
                else if( _Victim.isMayor == true ) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You cannot arrest a mayor.');
        
                    return message.channel.send(embedded);
                }
                else if( _Victim.travel.isTraveling == true ) {
                    embedded.setColor('#ff4f4f')
                    .setDescription('You cannot arrest the user because he is currently in travel');
                    
                    return message.channel.send(embedded);
                }
                else if( _User.travel.location != _Victim.travel.location ) {
                    embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the same location to arrest a player.');
                    
                    return message.channel.send(embedded);
                }
                else if( timeDifference < timeLimit ) {
                    embedded.setColor('#ff4f4f')
                            .setDescription(`You cannot arrest this user for the next ${moment.utc(timeLimit - timeDifference).format('mm:ss')}`);
        
                    return message.channel.send(embedded);
                }
                else
                {
                    _Victim.travel.location = "prison";
                    _Victim.arrest.isArrested = true;
                    _Victim.arrest.last_updated = n;

                    _Victim.save();

                    embedded.setColor('#3849ff')
                        .setDescription(`You have arrested **${_Victim.tag}**`);
                    return message.channel.send(embedded);
                }
 
            }
            else
            {
                console.log("[ARREST] DSID does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        });
    }
}