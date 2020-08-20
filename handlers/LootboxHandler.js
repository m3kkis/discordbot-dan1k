const Discord = require("discord.js");

class LootboxHandler {

    constructor(){
        this.dropChance = 0.1;
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
        var me = this;
        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#ae00ff')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription("*...You found a **LOOTBOX** !*");

        if(_User.lootbox == undefined)
        {
            _User.lootbox = 1;
        }
        else
        {
            _User.lootbox += 1;
        }
        return embedded;
    }

}
module.exports = LootboxHandler;