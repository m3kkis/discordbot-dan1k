const Discord = require("discord.js");

module.exports = {
    name: 'crime',
    description: 'So you want to earn BIG, higher payout but higher chance to get caught',
    args: false,
    usage: '',
    execute(client, message, args, _User, _JobHandler){
        var reply = _JobHandler.doCrime(message.member.user.tag, message.member.user.avatarURL(), _User);
        return message.channel.send(reply);
    }
}