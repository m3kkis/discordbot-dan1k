const Discord = require("discord.js");

module.exports = {
    name: 'law',
    description: 'Create, show , delete laws created by mayor.',
    args: false,
    usage: '',
    execute(client, message, args, _User, _Bot){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if(args[0] != undefined && args[0] == "add")
        {
            console.log("[LAW] Adding new law.");
            
            if(!_User.isMayor)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You must be a mayor to create a law.`);
                return message.channel.send(embedded);
            }

            if(_User.travel.location != "townhall")
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You must be a the **TOWNHALL** to add laws.`);
                return message.channel.send(embedded);
            }

            if(_Bot.law.length >= 3)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Max **3** laws are allowed.`);
                return message.channel.send(embedded);
            }

            if(args[1] == undefined) 
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Law text cannot be empty.`);
                return message.channel.send(embedded);
            }

            args.shift();

            var strLaw = args.join(" ");

            if(strLaw.length > 256)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Max 256 characters for a law.`);
                return message.channel.send(embedded);
            }

            _Bot.law.push(strLaw);
            _Bot.save();

            embedded.setColor('#78de87')
                    .setDescription(`A new law has been added!`);
    
            return message.channel.send(embedded);


        }
        else if(args[0] != undefined && (args[0] == "delete" || args[0] == "del"))
        {
            console.log("[LAW] Deleting law.");

            if(!_User.isMayor)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You must be a mayor to delete a law.`);
                return message.channel.send(embedded);
            }

            if(_User.travel.location != "townhall")
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You must be a the **TOWNHALL** to delete a law.`);
                return message.channel.send(embedded);
            }

            if(args[1] == undefined) 
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Please type the number of the law you wish to delete or just type 'all'.`);
                return message.channel.send(embedded);
            }


            if(args[1].toLowerCase() == "all")
            {
                _Bot.law = [];
                _Bot.save();

                embedded.setColor('#78de87')
                        .setDescription(`You have deleted **ALL** laws successfully!`);

                return message.channel.send(embedded);
            }
            else
            {
                var nbrLaw = Math.abs(parseInt(args[1]));

                if( isNaN(nbrLaw) ) {
                    
                    embedded.setColor('#ff4f4f')
                        .setDescription('That doesn\'t seem to be a valid NUMBER.');
        
                    return message.channel.send(embedded);
                }

                if(_Bot.law[nbrLaw-1] != undefined)
                {
                    _Bot.law.splice(nbrLaw-1,1);
                    _Bot.save();

                    embedded.setColor('#78de87')
                            .setDescription(`You have deleted a law successfully!`);
    
                    return message.channel.send(embedded);
                }
                else
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('That law number does not exist on the list.');

                    return message.channel.send(embedded);
                }
            }
        }
        else
        {
            console.log("[LAW] Display laws.");

           if(_Bot.law.length == 0)
           {
                embedded.setColor('#03b6fc')
                        .setDescription(`*Laws are to be followed by all players. The Police Officer has the duty to protect the law and to enforce it.*\n\n*${_Bot.election.mayor},\nThe Mayor*\n`)
                        .addField("LAWS","*-NONE-*")
                        .setFooter(`_____\nTo create a law, type \`${process.env.BOT_PREFIX}law create <text_law>\`\nTo delete a law, type \`${process.env.BOT_PREFIX}law del <number_law or all>\``);
                return message.channel.send(embedded);
           }
           else
           {
                var strLaws = "";

                _Bot.law.forEach( (law,idx) => {
                    strLaws += `**${idx+1}.** ${law}\n`;
                });

                embedded.setColor('#03b6fc')
                        .setDescription(`*Laws are to be followed by all players. The Police Officer has the duty to protect the law and to enforce it.*\n\n*${_Bot.election.mayor},\nThe Mayor*\n`)
                        .addField("LAWS",strLaws)
                        .setFooter(`_____\nTo create a law, type \`${process.env.BOT_PREFIX}law create <text_law>\`\nTo delete a law, type \`${process.env.BOT_PREFIX}law del <number_law or all>\``);
                return message.channel.send(embedded);
           }
        }

    }
}