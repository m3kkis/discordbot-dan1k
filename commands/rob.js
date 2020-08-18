const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'rob',
    description: 'Rob someone\'s cash',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User, _JobHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        var victim = args[0];

        if( victim.substring(0,3) == '<@!')
        {
            victim = victim.replace(/[^$\w\s]/gi, '');
        }
        else
        {
            try{
                victim = client.users.cache.find(u => u.username === victim).id;
            }
            catch{
                console.log("[ROB] ID of the Username provided does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        }

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.robTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.rob.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.rob.last_updated = n;

            User.findOne({
                dsid: victim
            }).then( _Victim => {

                if(_Victim)
                {
                    console.log("[ROB] Found victim ID.");
                    var reply = _JobHandler.doRob(message.member.user.tag, message.member.user.avatarURL(), _User, _Victim);
                    return message.channel.send(reply);


                }
                else
                {
                    console.log("[ROB] DSID does not exist.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user doesn't exists.");
                    return message.channel.send(embedded);
                }
                
            });

        }
        else
        {

            embedded.setColor('#ff4f4f')
                .setDescription("You cannot rob for the next " + convertToMinutes(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }

        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

    }
}