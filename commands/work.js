const Discord = require("discord.js");

module.exports = {
    name: 'work',
    description: 'Your safest method of earning cash but the least rewarding',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler){
        var reply = _JobHandler.doWork(message.member.user.tag, message.member.user.avatarURL(), _User);
        return message.channel.send(reply);
    }
}