const Discord = require("discord.js");

module.exports = {
    name: 'craft',
    description: 'Make something great out of crops or weed.',
    usage: '<item>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.travel.location != "lab") {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **LAB** to craft items.');

            return message.channel.send(embedded);
        }
        
        
        if(args[0] == undefined)
        {

            embedded.setColor('#03b6fc')
                    .setDescription(`Craft items using either Crops or Marijuana. To craft an item, type \`${process.env.BOT_PREFIX}craft <itemname>\``)
                    .addField("ITEMS","Cookies\nCake\nOil", true)
                    .addField("INGREDIENT","2x\n4x\n6x", true)
                    .addField("FEE","\`$100\`\n\`$150\`\n\`$300\`\n", true)

            return message.channel.send(embedded);
        }
        else
        {
            var typeFood = args[0].toLowerCase();
            var arrIdxCrop = [];
            var arrIdxWeed = [];

            const REGCOOKIES = Math.floor(2.3 * (5000 + (_User.upgrades.farm.level_quality * 1000)));
            const THCCOOKIES = Math.floor(2.3 * (10000 + (_User.upgrades.farm.level_quality * 1000)));
            const REGCAKE = Math.floor(4.6 * (5000 + (_User.upgrades.farm.level_quality * 1000)));
            const THCCAKE = Math.floor(4.6 * (10000 + (_User.upgrades.farm.level_quality * 1000)));
            const REGOIL = Math.floor(6.9 * (5000 + (_User.upgrades.farm.level_quality * 1000)));
            const THCOIL = Math.floor(6.9 * (10000 + (_User.upgrades.farm.level_quality * 1000)));

            //check for ingredients
            _User.inventory.forEach( (item,idx) => {
                if(item.name == "harvest_crops")
                {
                    arrIdxCrop.unshift(idx);
                }
                else if(item.name == "harvest_drugs")
                {
                    arrIdxWeed.unshift(idx);
                }

            });

            if(typeFood == "cookies")
            {   
                console.log("[CRAFT] Cookies");

                if(_User.economy.cash < 100)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You do not have enough cash to craft cookies.');

                    return message.channel.send(embedded);
                }

                if(arrIdxWeed.length >= 2)
                {
                    var jsonTHC = {
                        "name" : "process_cookies_thc",
                        "display" : "[THC] Weed Cookies",
                        "description" : "Smells like your grandpa\'s cookies.",
                        "value" : THCCOOKIES,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 2; i++)
                    {
                        _User.inventory.splice(arrIdxWeed[i],1);
                    }

                    _User.economy.cash -= 100;
                    _User.inventory.push(jsonTHC);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$100\`!`);

                    message.author.send(">>> You have made **" + jsonTHC.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else if( arrIdxCrop.length >= 2)
                {
                    var jsonREG = {
                        "name" : "process_cookies_reg",
                        "display" : "[REG] Batch of Cookies",
                        "description" : "Smells like your grandma\'s cookies.",
                        "value" : REGCOOKIES,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 2; i++)
                    {
                        _User.inventory.splice(arrIdxCrop[i],1);
                    }

                    _User.economy.cash -= 100;
                    _User.inventory.push(jsonREG);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$100\`!`);

                    message.author.send(">>> You have made **" + jsonREG.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You do not have enough ingredients for cookies.');

                    return message.channel.send(embedded);
                }
            }
            else if(typeFood == "cake")
            {
                console.log("[CRAFT] Cake");

                if(_User.economy.cash < 150)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You do not have enough cash to craft a cake.');

                    return message.channel.send(embedded);
                }

                if(arrIdxWeed.length >= 4)
                {
                    var jsonTHC = {
                        "name" : "process_cake_thc",
                        "display" : "[THC] Space Cake",
                        "description" : "The cake is a lie.",
                        "value" : THCCAKE,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 4; i++)
                    {
                        _User.inventory.splice(arrIdxWeed[i],1);
                    }

                    _User.economy.cash -= 150;
                    _User.inventory.push(jsonTHC);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$150\`!`);

                    message.author.send(">>> You have made **" + jsonTHC.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else if( arrIdxCrop.length >= 4)
                {
                    var jsonREG = {
                        "name" : "process_cake_reg",
                        "display" : "[REG] Massive cake",
                        "description" : "Enough cake to feed a family for a month.",
                        "value" : REGCAKE,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 4; i++)
                    {
                        _User.inventory.splice(arrIdxCrop[i],1);
                    }

                    _User.economy.cash -= 150;
                    _User.inventory.push(jsonREG);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$150\`!`);

                    message.author.send(">>> You have made **" + jsonREG.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You do not have enough ingredients for cake.');

                    return message.channel.send(embedded);
                }

            }
            else if(typeFood == "oil")
            {
                console.log("[CRAFT] Oil");

                if(_User.economy.cash < 300)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You do not have enough cash to craft oil.');

                    return message.channel.send(embedded);
                }

                if(arrIdxWeed.length >= 6)
                {
                    var jsonTHC = {
                        "name" : "process_oil_thc",
                        "display" : "[THC] Vape Oil",
                        "description" : "Enough oil to get invaded.",
                        "value" : THCOIL,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 6; i++)
                    {
                        _User.inventory.splice(arrIdxWeed[i],1);
                    }

                    _User.economy.cash -= 300;
                    _User.inventory.push(jsonTHC);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$300\`!`);

                    message.author.send(">>> You have made **" + jsonTHC.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else if( arrIdxCrop.length >= 6)
                {
                    var jsonREG = {
                        "name" : "process_oil_reg",
                        "display" : "[REG] Vegetable Oil",
                        "description" : "Enough oil to make a forehead shine.",
                        "value" : REGOIL,
                        "source" :"lab"
                    };

                    for(var i = 0; i < 6; i++)
                    {
                        _User.inventory.splice(arrIdxCrop[i],1);
                    }

                    _User.economy.cash -= 300;
                    _User.inventory.push(jsonREG);
                    _User.save();

                    embedded.setColor('#78de87')
                            .setDescription(`Crafting Success. Service fee of \`$300\`!`);

                    message.author.send(">>> You have made **" + jsonREG.display + "** in the Lab.");
                    return message.channel.send(embedded);

                }
                else
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You do not have enough ingredients for oil.');

                    return message.channel.send(embedded);
                }

            }   
            else
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Make sure you wrote the type of item you want to process correctly.\`${process.env.BOT_PREFIX}craft <cookies, cake or oil>\``);

                return message.channel.send(embedded);
            }

        }
    }
}