const Discord = require("discord.js");

module.exports = {
    name: 'store',
    description: 'View whats in-store!',
    args: false,
    usage: '',
    execute(client, message, args, _User, _StoreHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setThumbnail('https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/store.jpg')
            .setDescription(`To buy an item type \`${process.env.BOT_PREFIX}buy <list_id_of_item>\`.\n **Must be in the City**. *Example:* \`${process.env.BOT_PREFIX}buy 1\``)
            .addField("***- STORE ITEMS -***",_StoreHandler.displayAllStoreItems(),true);

        
        return message.channel.send(embedded);
    }
}