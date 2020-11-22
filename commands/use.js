const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'use',
    description: 'Use an item from your inventory.',
    args: true,
    usage: '<inventory_item_number> <optional: user>',
    execute(client, message, args, _User, _DeckHandler){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        var id = parseInt(args[0]);
        var victim;
        var strDestination;

        if(args[1] != undefined)
        {
            if(
                args[1].toLowerCase() == "city" ||
                args[1].toLowerCase() == "casino" ||
                args[1].toLowerCase() == "prison" ||
                args[1].toLowerCase() == "farm"
            )
            {
                strDestination = args[1].toLowerCase();
                victim = undefined;
            }
            else
            {
                victim = args[1];
            }
            
        }
        else
        {
            victim = undefined;
        }

        if( isNaN(id) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }
        else
        {
            id--;
        }


        if(_User.inventory[id] == undefined)
        {
            embedded.setColor('#ff4f4f')
                .setDescription('That number doesn\'t exist in your inventory list');

            return message.channel.send(embedded);
        }
        else
        {
            if(_User.inventory[id].name == "lootbox" || _User.inventory[id].name == "key_lootbox")
            {
                embedded.setColor('#ff4f4f')
                    .setDescription(`To use a key or lootbox use the command \`${process.env.BOT_PREFIX}lootbox open\` or \`${process.env.BOT_PREFIX}loot open\``);
                
                return message.channel.send(embedded);
            }
            else if(_User.inventory[id].name == "card_rob_protection")
            {
                if( _User.rob_protection == true)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You are already protected from rob.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.rob_protection = true;
                    
                }
            }
            else if(_User.inventory[id].name == "card_debt_cleaner")
            {
                if( _User.economy.cash >= 0)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You have no debts to clear.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.economy.cash = 0;
                    
                }
            }
            else if(_User.inventory[id].name == "card_next_one")
            {

                if(_DeckHandler.deck.length < 1){
                    console.log("[USE] Not enough cards in deck.");
                    _DeckHandler.deck = new Array();
                    _DeckHandler.createDeck(_DeckHandler.deckAmount);
                }

                embedded.setColor('#03b6fc')
                    .setDescription(`The next card is : \`[${_DeckHandler.deck[_DeckHandler.deck.length - 1].Value}]\``);

                message.channel.send(embedded);
            }
            else if(_User.inventory[id].name == "card_next_three")
            {

                if(_DeckHandler.deck.length < 3){
                    console.log("[USE] Not enough cards in deck.");
                    _DeckHandler.deck = new Array();
                    _DeckHandler.createDeck(_DeckHandler.deckAmount);
                }

                var nextCards = "";

                for( i = 1; i < 4; i++)
                {
                    nextCards += "\`[" + _DeckHandler.deck[_DeckHandler.deck.length - i].Value + "]\` ";
                }

                embedded.setColor('#03b6fc')
                    .setDescription(`The next three cards are : ${nextCards}`);

                message.channel.send(embedded);
            }
            else if(_User.inventory[id].name == "card_free_slot")
            {
                if( _User.inventorySize == 16)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You already upgraded your inventory slot to the max.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.inventorySize += 1;
                }
            }
            else if(_User.inventory[id].name == "card_double_cash")
            {
                if( _User.economy.cash <= 0)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t double your cash if you have $0 or if you\'re in debt');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.economy.cash = (_User.economy.cash * 2);
                    
                }
            }
            else if(_User.inventory[id].name == "card_shuffle_deck")
            {
                if(_DeckHandler.deck.length == 0){
                    console.log("[USE] Not enough cards in deck.");
                    _DeckHandler.deck = new Array();
                    _DeckHandler.createDeck(_DeckHandler.deckAmount);
                }

                _DeckHandler.shuffleDeck();
            }
            else if(_User.inventory[id].name == "card_bj_insurance")
            {
                if( _User.bj_insurance == true)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You are already insured for blackjack loss.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    _User.bj_insurance = true;
                    
                }
            }
            else if(_User.inventory[id].name == "card_jail_pass")
            {
                if( _User.arrest.isArrested == false)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You are currently not under arrest.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    var n = moment().valueOf();
                    _User.arrest.isArrested = false;
                    _User.arrest.last_updated = n;
                }
            }
            else if(_User.inventory[id].name == "card_teleport")
            {

                if(strDestination == _User.travel.location)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You are already located in the **' + strDestination.toUpperCase() + '**');
    
                    return message.channel.send(embedded);
                }
                else if(_User.travel.isTraveling)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You are currently traveling already.');

                    return message.channel.send(embedded);
                }
                else if(_User.arrest.isArrested)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You are under arrest and can\'t teleport out.');

                    return message.channel.send(embedded);
                }
                else if( _User.isMayor == false && strDestination == "townhall") {
                    embedded.setColor('#ff4f4f')
                        .setDescription('Only the mayor can teleport to the **' + strDestination.toUpperCase() + '**');
        
                    return message.channel.send(embedded);
                }
                else if (strDestination == "cryptofarm" && _User.inventory.filter(item => item.name === 'access_card_cryptofarm').length < 1) {
                    embedded.setColor('#ff4f4f')
                            .setDescription('You need an __Access Card__ to teleport to the **' + strDestination.toUpperCase() + '**');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    var n = moment().valueOf();
                    _User.travel.location = strDestination;
                    _User.travel.last_updated = n;
                }

            }
            else if(_User.inventory[id].name == "card_bitch_box")
            {
                if( victim != undefined)
                {
                    if( victim.substring(0,2) == '<@')
                    {
                        victim = victim.replace(/[^$\w\s]/gi, '');
                    }
                    else
                    {
                        try{
                            victim = client.users.cache.find(u => u.username === victim).id;
                        }
                        catch{
                            console.log("[USE] ID of the Username provided does not exist.");
                            embedded.setColor('#ff4f4f')
                                .setDescription("This user doesn't exists.");
                            return message.channel.send(embedded);
                        }
                    }

                    victim = client.users.cache.find(u => u.id === victim);
                    
                    var userRole = message.guild.member(victim).roles.cache.find(r => r.name === "BitchBox")

                    if(userRole != undefined)
                    {
                        console.log("[USE] This user has the role already.");
                        embedded.setColor('#ff4f4f')
                            .setDescription("This user has the role already.");
                        return message.channel.send(embedded);
                    }
                    else
                    {
                        var role = message.guild.roles.cache.find(r => r.name === "BitchBox");

                        message.guild.members.cache.forEach(member => {
                            if(!member.roles.cache.find(r => r.name == 'BitchBox')) return;
                            member.roles.remove(role.id).then(function() {
                                console.log(`[USE] Removed role from user ${member.user.tag}!`);
                            });
                        });
                        
                        message.guild.member(victim).roles.add(role);
                        
                    }
                }
                else
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription("Player name missing. Add it at the end.");

                    return message.channel.send(embedded);
                }

            }
            else
            {
                embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t use that.');
    
                return message.channel.send(embedded);
            }

            
            console.log(`[USE] Used **${_User.inventory[id].display}** successfully`);

            embedded.setColor('#78de87')
                .setDescription(`Used **${_User.inventory[id].display}** successfully`);

            _User.inventory.splice(id,1);

            _User.save();

            return message.channel.send(embedded);
        }

    }
}