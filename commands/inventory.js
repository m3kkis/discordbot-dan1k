const Discord = require("discord.js");

module.exports = {
    name: 'inventory',
    description: 'Show your inventory.',
    args: false,
    usage: '',
    aliases: ['inv'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setColor('#03b6fc')
        
        
        if(_User.inventory != undefined && _User.inventory.length > 0)
        {
            var reply = "";
            var usedInv = 0;
            _User.inventory.map((item, idx) => {
                reply += `${idx+1}. **${item.display}** - *${item.description}*\n`;
                usedInv++;
            });
            
            embedded.setDescription(`Inventory size: [ ${usedInv}/${_User.inventorySize}]`)
                .addField('Your Inventory',reply,true);

            return message.channel.send(embedded);
        }
        else
        {
            embedded.setDescription(`Inventory size: [ 0/${_User.inventorySize}]`)
                .addField('Your Inventory','*- Empty -*',true);
            return message.channel.send(embedded);
        }
        
    }
}