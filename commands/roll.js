const Discord = require("discord.js");

module.exports = {
    name: 'roll',
    description: 'Displays a random number between 1-100.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        console.log("[ROLL] Displaying roll result.");


        if(args[0] != undefined)
        {
            var amount = Math.abs(parseInt(args[0]));

            if( isNaN(amount) ) {
                
                embedded.setColor('#ff4f4f')
                    .setDescription('That doesn\'t seem to be a valid NUMBER.');
    
                return message.channel.send(embedded);
            }

            var randomNbr = Math.floor(Math.random() * amount) + 1;

            embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription(`You have rolled a **${randomNbr}**`);


            return message.channel.send(embedded);
        }
        else
        {
            var randomNbr = Math.floor(Math.random() * 100) + 1;

            embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription(`You have rolled a **${randomNbr}**`);


            return message.channel.send(embedded);


        }



    }
}