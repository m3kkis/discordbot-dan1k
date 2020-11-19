const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'tax',
    description: 'Take tax money from all the players.',
    args: true,
    usage: '<percentage>',
    aliases: ['tax'],
    execute(client, message, args, _User, _Bot){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.isMayor == false ) {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in a mayor to collect taxes.');

            return message.channel.send(embedded);
        }

        if( _User.travel.location != "townhall") {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **TOWNHALL** to collect taxes.');

            return message.channel.send(embedded);
        }
        
        var amount = Math.abs(parseInt(args[0]));

        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                    .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }

        if( amount > 15 ) {
            
            embedded.setColor('#ff4f4f')
                    .setDescription('Can\'t collect tax more than 15%.');

            return message.channel.send(embedded);
        }


        var n = moment().valueOf();
        var timeLimit =  7 * (((60 * 1000) * 60) * 24); // 7 days
        var timeDifference = n - _Bot.tax_last_updated;


        if( timeDifference > timeLimit )
        {

            _Bot.tax_last_updated = n;
            _Bot.save().then(()=>{

                User.find({}).then( _allUsers => {

                    var amountCollected = 0;
                    var strResults = "";
        
                    _allUsers.forEach( (usr,idx) => {
                        
                        var usrNetworth = usr.economy.cash + usr.economy.bank;
        
                        if(usrNetworth >= 100 && usr.isMayor == false)
                        {
                            var takeTax = Math.floor(usrNetworth * ( amount / 100 ));
                            
                            usr.economy.cash -= takeTax;
                            amountCollected += takeTax;
                            strResults += `• *${usr.username}*  \`$${addCommas(takeTax)}\`\n`;
        
                            usr.save(); // might cause problems?
                        }
                        
                    });
        
                    _User.economy.cash += amountCollected;
                    _User.save();
        
        
                    embedded.setColor("#03b6fc")
                        .setDescription("You have collected a total of \`$" +addCommas(amountCollected) + "\`\n")
                        .addField("Amounts collected from:", strResults)
        
                    return message.channel.send(embedded);
                });
            });

        }
        else
        {
            embedded.setColor('#ff4f4f')
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setDescription("You cannot collect tax until " + moment(_Bot.tax_last_updated + timeLimit).format('MMMM Do YYYY, hh:mm:ss'));

            return message.channel.send(embedded);
        }

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