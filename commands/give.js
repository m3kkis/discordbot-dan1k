const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'give',
    description: 'Give cash to another user.',
    args: true,
    usage: '<user> cash <amount>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        var victim = args[0];
        var giveType = args[1];
        var amount = parseInt(args[2]);

        if(giveType == 'cash')
        {
            if( isNaN(amount) ) {
            
                embedded.setColor('#ff4f4f')
                    .setDescription('That doesn\'t seem to be a valid NUMBER.');
    
                return message.channel.send(embedded);
            }
    
            if( amount > _User.economy.cash ) {
                
                embedded.setColor('#ff4f4f')
                    .setDescription('You do not have enough money to give.');
    
                return message.channel.send(embedded);
            }
    
            if( amount < 1 ) {
                
                embedded.setColor('#ff4f4f')
                    .setDescription('Minimum amount to give is $1');
    
                return message.channel.send(embedded);
            }
    
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
                    console.log("[GIVE] ID of the Username provided does not exist.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user doesn't exists.");
                    return message.channel.send(embedded);
                }
                
            }
    
            if(_User.dsid == victim) {
    
                embedded.setColor('#ff4f4f')
                    .setDescription('Can\'t give cash to yourself.');
    
                return message.channel.send(embedded);
    
            }
    
            
            User.findOne({
                dsid: victim
            }).then( _Victim => {
    
                if(_Victim)
                {
                    console.log("[GIVE] Found victim ID.");
    
                    _User.economy.cash -= amount;
                    _User.save().then(()=>{
                        _Victim.economy.cash += amount;
                        _Victim.save();
                    });
    
                    embedded.setColor('#78de87')
                        .setDescription(`You successfully gave \`$${amount}\` to **${_Victim.tag}** `);
                    
                    return message.channel.send(embedded);
    
    
                }
                else
                {
                    console.log("[GIVE] DSID does not exist.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user doesn't exists.");
                    return message.channel.send(embedded);
                }
                
            });
        }
        else{
            embedded.setColor('#ff4f4f')
                .setDescription("Make sure you wrote give command in the following order \`<user> cash <amount>\`");
            return message.channel.send(embedded);
        }
    }
}