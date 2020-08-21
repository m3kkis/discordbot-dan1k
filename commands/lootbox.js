const Discord = require("discord.js");

//dont forget what if the user doesnt have lbxKey field.

module.exports = {
    name: 'lootbox',
    description: 'Open your lootbox using a key or view item drops chances from lootbox',
    args: true,
    usage: '<open|itemlist>',
    aliases: ['lbx'],
    execute(client, message, args, _User, _LootboxHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')

        if(args[0].toLowerCase() == 'open')
        {
            console.log('[LOOTBOX] Open a lootbox request.');
            embedded.setDescription("This is currently unavailable, but your lootboxes and keys that you got will be saved for now.");
            return message.channel.send(embedded);
        }
        if(args[0].toLowerCase() == 'itemlist')
        {
            console.log('[LOOTBOX] Show all items available in lootbox.');
            embedded.setDescription("This is currently unavailable, but your lootboxes and keys that you got will be saved for now.");
            return message.channel.send(embedded);
        }
       
    
    }
}