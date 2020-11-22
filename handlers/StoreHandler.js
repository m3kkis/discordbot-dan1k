const Discord = require("discord.js");
var fs = require('fs');

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

    displayAllStoreItems(_User){
        console.log('[STORE HANDLER] Display all store items');
        var me = this;
        var reply = "";
        me.jsonStoreItems.map(function (item,idx) {
            if(item.name == "upgrade_inventory")
            {
                if(_User.inventorySize == 16)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`MAXED OUT\` : *${item.description}*~~\n`;
                }
                else
                {
                    var lvlDiff = _User.inventorySize - 4;
                    var finalPrice = item.value * Math.pow(lvlDiff,2);
    
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(finalPrice)}\` : *${item.description}*\n`;
                }

            }
            else if(item.name == "transport_bicycle")
            {
                if(_User.travel.transportation.hasBicycle == true)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`OWNED\` : *${item.description}*~~\n`;
                }
                else
                {
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
                }
            }
            else if(item.name == "transport_car")
            {
                if(_User.travel.transportation.hasCar == true)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`OWNED\` : *${item.description}*~~\n`;
                }
                else
                {
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
                }
            }
            else if(item.name == "transport_boat")
            {
                if(_User.travel.transportation.hasBoat == true)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`OWNED\` : *${item.description}*~~\n`;
                }
                else
                {
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
                }
            }
            else if(item.name == "transport_helicopter")
            {
                if(_User.travel.transportation.hasHelicopter == true)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`OWNED\` : *${item.description}*~~\n`;
                }
                else
                {
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
                }
            }
            else if(item.name == "transport_portalgun")
            {
                if(_User.travel.transportation.hasPortalGun == true)
                {
                    reply += `~~**${(idx+1)}. ${item.display}** \`OWNED\` : *${item.description}*~~\n`;
                }
                else
                {
                    reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
                }
            }
            else
            {
                reply += `**${(idx+1)}. ${item.display}** \`$${addCommas(item.value)}\` : *${item.description}*\n`;
            }
            
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
                var lvlDiff = _User.inventorySize - 4;
                var finalPrice = item.value * Math.pow(lvlDiff,2);

                _User.inventorySize += 1;
                _User.economy.cash -= finalPrice;
                return reply = "Successfully upgraded inventory slot";
            }
            else
            {
                return reply = "Cannot upgrade inventory. Max 16 slots."; 
            }
        }
        else if(item.name == "rob_protection"){
            if(_User.rob_protection != true)
            {
                _User.rob_protection = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully turned on rob protection.";
            }
            else
            {
                return reply = "You are already protected from being robbed."; 
            }
        }
        else if(item.name == "transport_bicycle"){
            if(_User.travel.transportation.hasBicycle != true)
            {
                _User.travel.transportation.hasBicycle = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully bought a bicycle.";
            }
            else
            {
                return reply = "You already own a bicycle."; 
            }
        }
        else if(item.name == "transport_car"){
            if(_User.travel.transportation.hasCar != true)
            {
                _User.travel.transportation.hasCar = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully bought a car.";
            }
            else
            {
                return reply = "You already own a car."; 
            }
        }
        else if(item.name == "transport_boat"){
            if(_User.travel.transportation.hasBoat != true)
            {
                _User.travel.transportation.hasBoat = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully bought a boat.";
            }
            else
            {
                return reply = "You already own a boat."; 
            }
        }
        else if(item.name == "transport_helicopter"){
            if(_User.travel.transportation.hasHelicopter != true)
            {
                _User.travel.transportation.hasHelicopter = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully bought a helicopter.";
            }
            else
            {
                return reply = "You already own a helicopter."; 
            }
        }
        else if(item.name == "transport_portalgun"){
            if(_User.travel.transportation.hasPortalGun != true)
            {
                _User.travel.transportation.hasPortalGun = true;
                _User.economy.cash -= item.value;
                return reply = "Successfully bought a portal gun.";
            }
            else
            {
                return reply = "You already own a portal gun."; 
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

function addCommas(num){

    var numToCommafy = num.toString();
    var numCommafied = '';

    for (var i = numToCommafy.length; i > 0; i -= 3) {
        numCommafied = numToCommafy.slice(Math.max(i - 3, 0), i) + (numCommafied ? ',' + numCommafied : '');
    }
    
    return numCommafied;
}
module.exports = StoreHandler;