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
        var reply = "";
        me.jsonItems.store.map(function (item,idx) {
            reply += `${(idx+1)}. **${item.display}** ($${item.price}): *${item.description}*\n`;
        });
        return reply;
    }

    displayAllLootboxItems(){

    }

    checkIfIDExists(idx){
        console.log('[ITEM HANDLER] Check if item exists.');
        var me = this;
        var item = me.jsonItems.store[idx];
        
        if(item != undefined)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    buyItem(idx, _User){
        console.log('[ITEM HANDLER] Buying item.');
        var me = this;
        var item = me.jsonItems.store[idx];
        
        _User.inventory.push({
            "name":item.name,
            "display":item.display,
            "description":item.description,
            "source":"store"
        });
        
        _User.economy.cash -= item.price;

    }

}
module.exports = ItemHandler;