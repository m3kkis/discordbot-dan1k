const Discord = require("discord.js");
var fs = require('fs');

//change this to store handler
class StoreHandler {

    constructor(){
        this.jsonStoreItems;
    }

    loadJsonFiles(){
        console.log('[STORE HANDLER] Load items json files.');
        var me = this;

        fs.readFile('./json/Items_Store.json', (err, data) => {
            if (err) throw err;
            me.jsonStoreItems = JSON.parse(data);
        });
    }

    displayAllStoreItems(){
        console.log('[STORE HANDLER] Display all store items');
        var me = this;
        var reply = "";
        me.jsonStoreItems.map(function (item,idx) {
            reply += `${(idx+1)}. **${item.display}** ($${item.price}): *${item.description}*\n`;
        });
        return reply;
    }

    checkIfIDExists(idx){
        console.log('[STORE HANDLER] Check if item exists.');
        var me = this;
        var item = me.jsonStoreItems[idx];
        
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
        console.log('[STORE HANDLER] Buying item.');
        var me = this;
        var item = me.jsonStoreItems[idx];
        
        _User.inventory.push({
            "name":item.name,
            "display":item.display,
            "description":item.description,
            "source":"store"
        });
        
        _User.economy.cash -= item.price;

    }

}
module.exports = StoreHandler;