const Discord = require("discord.js");

//dont forget what if the user doesnt have lbxKey field.

module.exports = {
    name: 'store',
    description: 'View whats in-store!',
    args: false,
    usage: '',
    execute(client, message, args, _User, _ItemHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription("To buy an item type `!buy <list_id_of_item>`.\n *example:* `!buy 1` ")
            .addField("Store Items",_ItemHandler.displayAllStoreItems(),true);

        
        return message.channel.send(embedded);
    }
}