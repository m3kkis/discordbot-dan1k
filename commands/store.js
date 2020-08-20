const Discord = require("discord.js");

//dont forget what if the user doesnt have lbxKey field.

module.exports = {
    name: 'store',
    description: 'View whats in-store!',
    args: false,
    usage: '',
    execute(client, message, args, _User, _ItemHandler){
        return message.channel.send(_ItemHandler.displayAllStoreItems(message));
    }
}