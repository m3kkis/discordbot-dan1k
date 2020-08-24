const Discord = require("discord.js");

module.exports = {
    name: 'lootbox',
    description: 'Open your lootbox using a key or view item drops chances from lootbox',
    args: true,
    usage: '<open|itemlist>',
    aliases: ['loot'],
    execute(client, message, args, _User, _LootboxHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')

        if(args[0].toLowerCase() == 'open')
        {
            console.log('[LOOTBOX] Open a lootbox request.');

            var lootbox = _User.inventory.filter(item => item.name === "lootbox");

            if( !lootbox.length > 0)
            {
                embedded.setColor('#ff4f4f')
                    .setDescription("You don\'t have any lootboxes.");
                return message.channel.send(embedded);
            }
            else
            {
                var keys = _User.inventory.filter(item => item.name === "key_lootbox");
                
                if( !keys.length > 0)
                {
                    embedded.setColor('#ff4f4f')
                    .setDescription("You don\'t have any keys to open a lootbox.");
                    return message.channel.send(embedded);
                }
                else
                {
                    var reply = _LootboxHandler.openLootbox(_User);
                    embedded.setColor('#ae00ff')
                        .setDescription(reply);
                    _User.save();
                    return message.channel.send(embedded);
                }
                
                
            }
        }
        if(args[0].toLowerCase() == 'items')
        {
            console.log('[LOOTBOX] Show all items available in lootbox.');
            var allItems = _LootboxHandler.getAllLootboxItems();

            var reply = "";

            allItems.common.map((item)=>{
                reply += `\`${item.display}\` - *${item.description}*\n`;
            });

            embedded.addField("Common",reply,false);
            reply = "";

            allItems.uncommon.map((item)=>{
                reply += `\`${item.display}\` - *${item.description}*\n`;
            });

            embedded.addField("Uncommon",reply,false);
            reply = "";

            allItems.rare.map((item)=>{
                reply += `\`${item.display}\` - *${item.description}*\n`;
            });

            embedded.addField("Rare",reply,false);
            reply = "";

            allItems.epic.map((item)=>{
                reply += `\`${item.display}\` - *${item.description}*\n`;
            });

            embedded.addField("Epic",reply,false);
            reply = "";

            allItems.legendary.map((item)=>{
                reply += `\`${item.display}\` - *${item.description}*\n`;
            });
            embedded.addField("Legendary",reply,false);
            reply = "";

            return message.channel.send(embedded);
        }
       
    
    }
}