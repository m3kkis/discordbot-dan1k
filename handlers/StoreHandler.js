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
            reply += `${(idx+1)}. **${item.display}** ($${item.value}): *${item.description}*\n`;
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
        var reply = "";

        if(item.name == "upgrade_inventory")
        {
            if(_User.inventorySize < 16)
            {
                _User.inventorySize += 1;
                _User.economy.cash -= item.value;
                return reply = "Successfully upgraded inventory slot";
            }
            else
            {
                return reply = "Cannot upgrade inventory. Max 16 slots."; 
            }
        }
        else
        {
            _User.inventory.push({
                "name":item.name,
                "display":item.display,
                "description":item.description,
                "value":item.value,
                "source":"store"
            });

            _User.economy.cash -= item.value;

            return reply = `Succesfully purchased **${item.display}**!`; 

        }

    }

}
module.exports = StoreHandler;