const Discord = require("discord.js");

module.exports = {
    name: 'slut',
    description: 'You slut yourself into dirty jobs for extra cash',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler){
        var reply = _JobHandler.doSlut(message.member.user.tag, message.member.user.avatarURL(), _User);
        return message.channel.send(reply);
    }
}