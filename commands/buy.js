const Discord = require("discord.js");

module.exports = {
    name: 'buy',
    description: 'Buy an item from the store.',
    args: true,
    usage: '<store_item_id>',
    execute(client, message, args, _User, _ItemHandler){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        var id = parseInt(args[0]);

        if( isNaN(id) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid ID NUMBER.');

            return message.channel.send(embedded);
        }
        else
        {
            id--;
        }

        if( !_ItemHandler.checkIfIDExists(id) )
        {
            embedded.setColor('#ff4f4f')
                .setDescription('That ID doesn\'t ID exist in store list');

            return message.channel.send(embedded);
        }
        else
        {
            if(_User.inventory.length >= _User.inventorySize)
            {
                embedded.setColor('#ff4f4f')
                .setDescription('Your inventory is full');
    
                return message.channel.send(embedded);
            }
            else
            {
                if(_ItemHandler.jsonItems.store[id].price > _User.economy.cash)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t afford that item.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _ItemHandler.buyItem(id, _User);
    
                    embedded.setColor('#78de87')
                        .setDescription('Purchase successful');
        
                    _User.save();
        
                    return message.channel.send(embedded);
                }
            }
        }
    }
}