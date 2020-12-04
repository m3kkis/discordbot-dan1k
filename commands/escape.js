const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'escape',
    description: 'Try to escape from prison!',
    args: false,
    usage: '',
    aliases: ['esc'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if( _User.arrest.isArrested != true ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You must be arrested first to be able to escape from prison.');

            return message.channel.send(embedded);
        }

        if( _User.travel.location != "prison" ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **PRISON** to escape.');

            return message.channel.send(embedded);
        }

        if( _User.arrest.canEscape != true ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You cannot try to escape prison anymore.');

            return message.channel.send(embedded);
        }


        var chanceEscape = 0.1;
        var randomNbr = Math.random();
        var n = moment().valueOf();

        if(randomNbr < chanceEscape)
        {
            _User.arrest.isArrested = false;
            _User.arrest.last_updated = n;
            _User.arrest.priceBail = 0;
            _User.arrest.canEscape = true;
            _User.save();

            embedded.setColor('#78de87')
                    .setDescription(`Escape from prison success. **RUN FREE!!!**`)

            return message.channel.send(embedded);
        }
        else
        {
            _User.arrest.canEscape = false;
            _User.save();

            embedded.setColor('#ff4f4f')
                    .setDescription('You failed to escape from prison.');

            return message.channel.send(embedded);
        }


    }
}