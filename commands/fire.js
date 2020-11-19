const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'fire',
    description: 'Fire a Police Officer. Only mayor can do this in the townhall.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        
        if( _User.isMayor == false) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('Only a Mayor can fire a Police Officer');

            return message.channel.send(embedded);
        }

        if( _User.travel.location != "townhall") {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **TOWNHALL** to fire a Police Officer.');

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
                console.log("[FIRE] ID of the Username provided does not exist.");
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
                console.log("[FIRE] Found victim ID.");

                if(_Victim.isPolice == true)
                {

                    _Victim.isPolice = false;
                    _Victim.save();

                    embedded.setColor('#ffd900')
                            .setTitle("FIRED")
                            .setDescription(`Thank you for your service, **${_Victim.tag}** is no longer a *Police Officer*!`);

                    var role = message.guild.roles.cache.find(r => r.name === "Police");

                    message.guild.members.cache.forEach(member => {
                        if(!member.roles.cache.find(r => r.name == 'Police')) return;
                        member.roles.remove(role.id).then(function() {
                            console.log(`[FIRE] Removed role from user ${member.user.tag}!`);
                        });
                    });

                    return message.channel.send(embedded);
                    
                }
                else
                {
                    console.log("[FIRE] The victim is not a police officer.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user is not a police officer.");
                    return message.channel.send(embedded);
                }

                
            }
            else
            {
                console.log("[FIRE] DSID does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        });


    }
}