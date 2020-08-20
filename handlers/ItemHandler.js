const Discord = require("discord.js");
var fs = require('fs');

class ItemHandler {

    constructor(){
        this.jsonItems;
    }

    loadJsonFiles(){
        console.log('[ITEM HANDLER] Load items json files.');
        var me = this;

        fs.readFile('./json/Items.json', (err, data) => {
            if (err) throw err;
            me.jsonItems = JSON.parse(data);
        });
    }

    displayAllStoreItems(message){
        console.log('[ITEM HANDLER] Display all store items');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription("To buy an item type `!buy <list_id_of_item>`.\n *example:* `!buy 1` ");

        var reply = "";
        me.jsonItems.store.map(function (item,idx) {
            reply += `${(idx+1)}. **${item.display}** ($${item.price}): *${item.description}*\n`;
        });
        

        embedded.addField("Store Items",reply,true);
        return embedded;

    }

    displayAllLootboxItems(){

    }

}
module.exports = ItemHandler;