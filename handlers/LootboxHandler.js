const Discord = require("discord.js");
const moment = require("moment")
var fs = require('fs');

class LootboxHandler {

    constructor(){
        this.dropChance = 0.1;
        this.jsonLootboxItems;
        this.chanceCommon = 0.6;
        this.chanceUncommon = 0.3;
        this.chanceRare = 0.15;
        this.chanceEpic = 0.05;
        this.chanceLegendary = 0.01;
    }

    loadJsonFiles(){
        console.log('[LOOTBOX HANDLER] Load items json files.');
        var me = this;

        fs.readFile('./json/Items_Lootbox.json', (err, data) => {
            if (err) throw err;
            me.jsonLootboxItems = JSON.parse(data);
        });
    }

    checkForLootboxDrop(){
        console.log('[LOOTBOX HANDLER] Check if lootbox drop.');
        var me = this;
        var chance = Math.random();

        if(chance > me.dropChance)
        {
            console.log('[LOOTBOX HANDLER] No lootbox drop.');
            return false;
        }
        else
        {
            console.log('[LOOTBOX HANDLER] Yes lootbox drop.');
            return true;
        }
    }

    giveLootbox(message, _User){
        console.log('[LOOTBOX HANDLER] Giving a lootbox.');
        var me = this;
        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#ae00ff')
            .setThumbnail('https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/box_closed.jpg')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription("*...You found a **LOOTBOX** !*");

        _User.inventory.push({
            "name":"lootbox",
            "display":"Lootbox",
            "description":"Open with a key and get surprise gift!",
            "value":1000,
            "source":"drop"
        });

        return embedded;
    }

    getAllLootboxItems(){
        console.log('[LOOTBOX HANDLER] Getting all lootbox items.');
        var me = this;
        return me.jsonLootboxItems;
    }

    openLootbox(_User){
        console.log('[LOOTBOX HANDLER] Opening lootbox.');
        var me = this;
        var chance = Math.random();
        var randomRaritySelected;
        var reply;

        if(chance < me.chanceLegendary)
        {
            randomRaritySelected = me.jsonLootboxItems.legendary;
        }
        else if(chance < me.chanceEpic)
        {
            randomRaritySelected = me.jsonLootboxItems.epic;
        }
        else if(chance < me.chanceRare)
        {
            randomRaritySelected = me.jsonLootboxItems.rare;
        }
        else if(chance < me.chanceUncommon)
        {
            randomRaritySelected = me.jsonLootboxItems.uncommon;
        }
        else
        {
            randomRaritySelected = me.jsonLootboxItems.common;
        }
        
        var randomItem = randomRaritySelected[Math.floor(Math.random() * randomRaritySelected.length)];

        var idxKey = _User.inventory.findIndex(item => item.name == "key_lootbox");
        _User.inventory.splice(idxKey,1);    

        var idxLootbox = _User.inventory.findIndex(item => item.name == "lootbox");
        _User.inventory.splice(idxLootbox,1);    

        if(randomItem.type == "instant")
        {
            if(randomItem.name == "card_go_to_prison")
            {
                var n = moment().valueOf();
                _User.arrest.isArrested = true;
                _User.arrest.last_updated = n;
                _User.travel.location = "prison";
                reply = `You got a **${randomItem.display}** - ${randomItem.description}\n*It will by applied to you instantly. Sorry!*`;
            }
            else
            {
                _User.economy.cash += randomItem.value;
                reply = `You got a **${randomItem.display}** - ${randomItem.description}\n*It will by applied to your account instantly. Enjoy!*`;
            }

            return reply;
        }
        else if(randomItem.type == "card")
        {
            _User.inventory.push({
                "name":randomItem.name,
                "display":randomItem.display,
                "description":randomItem.description,
                "value":randomItem.value,
                "type":randomItem.type,
                "source":"lootbox"
            });

            reply = `You got a **${randomItem.display}** - ${randomItem.description}\n*It will be added to your inventory, you can use, sell or trade it later. Enjoy!*`;
            return reply;
        }


    }

}
module.exports = LootboxHandler;