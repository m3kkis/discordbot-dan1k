const Discord = require("discord.js");

module.exports = {
    name: 'use',
    description: 'Use an item from your inventory.',
    args: true,
    usage: '<inventory_item_number>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        var id = parseInt(args[0]);

        if( isNaN(id) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }
        else
        {
            id--;
        }


        if(_User.inventory[id] == undefined)
        {
            embedded.setColor('#ff4f4f')
                .setDescription('That number doesn\'t exist in your inventory list');

            return message.channel.send(embedded);
        }
        else
        {
            if(_User.inventory[id].name == "lootbox" || _User.inventory[id].name == "key_lootbox")
            {
                embedded.setColor('#ff4f4f')
                    .setDescription(`To use a key or lootbox use the command \`${process.env.BOT_PREFIX}lootbox open\` or \`${process.env.BOT_PREFIX}loot open\``);
                
                return message.channel.send(embedded);
            }
            else if(_User.inventory[id].name == "card_debt_cleaner")
            {
                if( _User.economy.cash >= 0)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You have no debts to clear.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.economy.cash = 0;
                    
                }
            }
            else if(_User.inventory[id].name == "card_free_slot")
            {
                if( _User.inventorySize == 16)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You already upgraded your inventory slot to the max.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.inventorySize += 1;
                }
            }
            else if(_User.inventory[id].name == "card_double_cash")
            {
                if( _User.economy.cash <= 0)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t double your cash if you have $0 or if you\'re in debt');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.economy.cash = (_User.economy.cash * 2);
                    
                }
            }

            

            embedded.setColor('#78de87')
                .setDescription(`Used **${_User.inventory[id].display}** successfully`);

            _User.inventory.splice(id,1);

            _User.save();

            return message.channel.send(embedded);
        }

    }
}