const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'promote',
    description: 'Promote a player to Police Officer. Only mayor can use this in the townhall.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        if( _User.isMayor == false) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('Only a Mayor can promote a user to a Police Officer');

            return message.channel.send(embedded);
        }

        if( _User.travel.location != "townhall") {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **TOWNHALL** to promote a player to a Police Officer.');

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
                console.log("[PROMOTE] ID of the Username provided does not exist.");
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
                console.log("[PROMOTE] Found victim ID.");

                if(_Victim.isMayor != true)
                {

                    var countPolice = 0;

                    message.guild.members.cache.forEach(member => {
                        if(member.roles.cache.find(r => r.name == 'Police'))
                        {
                            console.log("[PROMOTE] There is a police officer already.");
                            countPolice++;
                            embedded.setColor('#ff4f4f')
                                    .setDescription("There is already a police officer. Fire the current one before promoting a new one. There can only be one.");
                            return message.channel.send(embedded);
                        }
                    });
                    
                    if(countPolice == 0)
                    {
                        _Victim.isPolice = true;
                        _Victim.save();

                        embedded.setColor('#3849ff')
                                .setTitle("PROMOTION")
                                .setDescription(`Congratulations, **${_Victim.tag}** is now a *Police Officer*!`);

                        var role = message.guild.roles.cache.find(r => r.name === "Police");

                        message.guild.member(victim).roles.add(role);

                        return message.channel.send(embedded);
                    }
                }
                else
                {
                    console.log("[PROMOTE] The victim is a mayor.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user is a mayor, he cannot be a police officer.");
                    return message.channel.send(embedded);
                }

                
            }
            else
            {
                console.log("[PROMOTE] DSID does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        });


    }
}