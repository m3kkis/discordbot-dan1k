const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'search',
    description: 'Search a players inventory. Must be in same location.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        
        if( _User.isPolice == false) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('Only a Police Officer can search a player\'s inventory.');

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
                console.log("[SEARCH] ID of the Username provided does not exist.");
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
                console.log("[SEARCH] Found victim ID.");

                if( _User.travel.location != _Victim.travel.location ) {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You must be in the same location to search a player\'s inventory.');
        
                    return message.channel.send(embedded);
                }
                else
                {

                    if(_Victim.inventory != undefined && _Victim.inventory.length > 0)
                    {
                        var reply = "";
                        var usedInv = 0;
                        _Victim.inventory.map((item, idx) => {
                            reply += `${idx+1}. **${item.display}**\n`;
                            usedInv++;
                        });
                        
                        embedded.setDescription(`Search results.`)
                            .setColor('#3849ff')
                            .addField("Cash",`\`$${addCommas(_Victim.economy.cash)}\``)
                            .addField(_Victim.tag + '\'s Inventory',reply,true);

                        return message.channel.send(embedded);
                    }
                    else
                    {
                        embedded.setDescription(`Search results.`)
                            .setColor('#3849ff')
                            .addField("Cash",`\`$${addCommas(_Victim.economy.cash)}\``,true)
                            .addField(_Victim.tag + '\'s Inventory','*- Empty -*');
                        return message.channel.send(embedded);
                    }
                    
                }
 
            }
            else
            {
                console.log("[SEARCH] DSID does not exist.");
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