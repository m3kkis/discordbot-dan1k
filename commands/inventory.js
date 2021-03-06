const Discord = require("discord.js");

module.exports = {
    name: 'inventory',
    description: 'Show your inventory.',
    args: false,
    usage: '',
    aliases: ['inv'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setThumbnail('https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/inventory.jpg')
            .setColor('#03b6fc')
        
        
        if(_User.inventory != undefined && _User.inventory.length > 0)
        {
            var reply = "";
            var usedInv = 0;
            _User.inventory.map((item, idx) => {

                if(item.name == "coin_ltc" || item.name == "coin_eth" || item.name == "coin_btc")
                {
                    reply += `${idx+1}. **${item.display}** - *${item.description}*\n \`Sell value: $${addCommas(item.value)}\`\n`;
                }
                else
                {
                    reply += `${idx+1}. **${item.display}** - *${item.description}*\n \`Sell value: $${addCommas( Math.floor((item.value/2)) )}\`\n`;
                }

                usedInv++;
            });
            
            embedded.setDescription(`Inventory size: [ ${usedInv}/${_User.inventorySize}]`)
                .addField('Your Inventory',reply,true);

            return message.author.send(embedded);
            /*
            if(args[0] == "hide")
            {
                return message.author.send(embedded);
            }
            else
            {
                return message.channel.send(embedded);
            }
            */
        }
        else
        {
            embedded.setDescription(`Inventory size: [ 0/${_User.inventorySize}]`)
                .addField('Your Inventory','*- Empty -*',true);

            return message.author.send(embedded);
            /*
            if(args[0] == "hide")
            {
                return message.author.send(embedded);
            }
            else
            {
                return message.channel.send(embedded);
            }
            */
        }

        function addCommas(num){

            var numToCommafy = num.toString();
            var numCommafied = '';
        
            for (var i = numToCommafy.length; i > 0; i -= 3) {
                numCommafied = numToCommafy.slice(Math.max(i - 3, 0), i) + (numCommafied ? ',' + numCommafied : '');
            }
            
            return numCommafied;
        }
        
    }
}