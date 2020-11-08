const Discord = require("discord.js");

module.exports = {
    name: 'me',
    description: 'View info about yourself.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setThumbnail(message.member.user.avatarURL())
            .addFields(
                { name: 'Rob Protection', value: `${_User.rob_protection}`},
                { name: 'BJ Insurance', value: `${_User.bj_insurance}`},
                { name: 'Transports', value: `Bicycle: ${_User.travel.transportation.hasBicycle}\nCar: ${_User.travel.transportation.hasCar}\nBoat: ${_User.travel.transportation.hasBoat}\nHelicopter: ${_User.travel.transportation.hasHelicopter}\nPortal Gun: ${_User.travel.transportation.hasPortalGun}\n`},
            )


        return message.channel.send(embedded);
    }
}