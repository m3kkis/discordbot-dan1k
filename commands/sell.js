const Discord = require("discord.js");

module.exports = {
    name: 'sell',
    description: 'Sell an item from your inventory.',
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

            _User.economy.cash += (_User.inventory[id].value/2);
            

            embedded.setColor('#78de87')
                .setDescription(`Sold ${_User.inventory[id].display} successfully for **$${(_User.inventory[id].value/2)}**`);

            _User.inventory.splice(id,1);
            
            _User.save();

            return message.channel.send(embedded);
        }

    }
}