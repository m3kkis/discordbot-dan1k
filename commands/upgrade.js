const Discord = require("discord.js");

module.exports = {
    name: 'upgrade',
    description: 'Upgrade a location (ex. Farm).',
    args: false,
    usage: '<optional:id>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL());
        
        switch(_User.travel.location){
            case "farm":
                console.log("[UPGRADE] FARM.")

                var priceQuality = 20000;
                var priceQuantity = 75000;

                var priceQuantityUpdated = priceQuantity * _User.upgrades.farm.level_quantity;
                var priceQualityUpdated = priceQuality * (_User.upgrades.farm.level_quality + 1);

                if(args[0] != undefined){
                    if(args[0] == '1')
                    {
                        console.log("[UPGRADE] FARM UPGRADE 1.QUANTITY")

                        if(_User.upgrades.farm.level_quantity < 3)
                        {

                            if(_User.economy.cash < priceQuantityUpdated)
                            {
                                embedded.setColor('#ff4f4f')
                                        .setDescription('You don\'t have enough cash to upgrade.');
                                return message.channel.send(embedded);
                            }
                            else
                            {
                                embedded.setColor('#78de87')
                                        .setDescription(`Farm upgrade success.`)

                                _User.economy.cash -= priceQuantityUpdated;

                                _User.upgrades.farm.level_quantity++;
                                _User.save();

                                return message.channel.send(embedded);
                            }
                        }
                        else
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have already maxed out your Farm Size upgrade.');
                            return message.channel.send(embedded);
                        }

                    }
                    else if(args[0] == '2')
                    {
                        console.log("[UPGRADE] FARM UPGRADE 2.QUALITY")

                        if(_User.upgrades.farm.level_quality < 5)
                        {

                            if(_User.economy.cash < priceQualityUpdated)
                            {
                                embedded.setColor('#ff4f4f')
                                        .setDescription('You don\'t have enough cash to upgrade.');
                                return message.channel.send(embedded);
                            }
                            else
                            {
                                embedded.setColor('#78de87')
                                        .setDescription(`Farm upgrade success.`)

                                _User.economy.cash -= priceQualityUpdated;

                                _User.upgrades.farm.level_quality++;
                                _User.save();

                                return message.channel.send(embedded);
                            }
                        }
                        else
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have already maxed out your Seed Quality upgrade.');
                            return message.channel.send(embedded);
                        }
                        
                    }
                    else
                    {
                        embedded.setColor('#ff4f4f')
                            .setDescription('Make sure you typed the right number for upgrade.');
                        return message.channel.send(embedded);
                    }
                }
                else
                {

                    var strUpgrades = "";

                    if(_User.upgrades.farm.level_quantity == 3)
                    {
                        strUpgrades += `**1.** Farm Size (${_User.upgrades.farm.level_quantity}/3) - \`MAXED OUT\` - *Increase harvest quantity by 1*\n`;
                    }
                    else
                    {
                        strUpgrades += `**1.** Farm Size (${_User.upgrades.farm.level_quantity}/3) - \`$${addCommas(priceQuantityUpdated)}\` - *Increase harvest quantity by 1*\n`;
                    }

                    if(_User.upgrades.farm.level_quality == 5)
                    {
                        strUpgrades += `**2.** Seed Quality (${_User.upgrades.farm.level_quality}/5) - \`MAXED OUT\` - *Increase harvest item price by $500*`;
                    }
                    else
                    {
                        strUpgrades += `**2.** Seed Quality (${_User.upgrades.farm.level_quality}/5) - \`$${addCommas(priceQualityUpdated)}\` - *Increase harvest item price by $500*`;
                    }


                    embedded.setDescription(`You can upgrade your farm with the following options by doing \`${process.env.BOT_PREFIX}upgrade <1 or 2>\``)
                            .addField('UPGRADES', strUpgrades, true)
                    return message.channel.send(embedded);
                }
            default:
                embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **FARM** to upgrade.');
                return message.channel.send(embedded);
            
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