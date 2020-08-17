const Discord = require("discord.js");

module.exports = {
    name: 'clear',
    description: 'Delete the <amount> amount of last messages.',
    args: true,
    usage: '<quantity>',
    aliases: ['c'],
    execute(client, message, args, _User){

        const MAX_MSG = 25;
        var amount = parseInt(args[0]);

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());


        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }

        if( amount < 2 || amount >= MAX_MSG ) {

            embedded.setColor('#ff4f4f')
                .setDescription(`Need to put a NUMBER between 2 and ${MAX_MSG}`);

            return message.channel.send(embedded);
        }
        
        const arrReplies = [
            "you dirty animals...",
            "maybe you should think before sending.",
            "how about next time you do it yourself?",
            "why would you even send that then?",
            "stop sending junk."
        ];

        var reply = arrReplies[Math.floor(Math.random() * arrReplies.length)];

        embedded.setColor('#78de87')
            .setDescription(`Cleaned it... ${reply}`);

        message.channel.bulkDelete( ( amount ) )
            .then( messages => {
                return message.channel.send(embedded);
            });

    }
}