const Discord = require("discord.js");

module.exports = {
    name: 'slot-machine',
    description: 'Play the slot machine!',
    args: true,
    usage: '<amount>',
    aliases: ['sm'],
    execute(client, message, args, _User, _LootboxHandler){

        console.log("[SLOT MACHINE] Playing slot-machine.");

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        var amount = parseInt(args[0]);

        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }

        if( amount > _User.economy.cash ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('You do not have enough money.');

            return message.channel.send(embedded);
        }

        if( amount < 50 ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('Minimum \`$50\` is required to play slot machine.');

            return message.channel.send(embedded);
        }

        var slotItems = [':gem:',':eggplant:',':moneybag:', ':poop:'];

        var slotOne = slotItems[Math.floor(Math.random() * slotItems.length)];
        var slotTwo = slotItems[Math.floor(Math.random() * slotItems.length)];
        var slotThree = slotItems[Math.floor(Math.random() * slotItems.length)];

        var result;
        var lootBox = false;

        if(slotOne === slotTwo && slotOne === slotThree)
        {
            embedded.setColor('#78de87');
            var winnings;

            if(slotOne === ':eggplant:')
            {   
                winnings = (amount*3);
                _User.economy.cash += winnings;
            }
            else if(slotOne === ':moneybag:')
            {
                winnings = (amount*6);
                _User.economy.cash += winnings
            }
            else if(slotOne === ':gem:')
            {
                winnings = (amount*6);
                _User.economy.cash += winnings
                lootBox = true;
            }
            else if(slotOne === ':poop:')
            {
                winnings = "NOTHING";
            }

            result = `You **WIN** $${winnings}!`;

        }
        else
        {
            embedded.setColor('#ff4f4f');
            _User.economy.cash -= amount;
            result = 'Try again next time!';
        }

        embedded.setDescription('*Get three of the same and triple your amount. If you get 3x :gem:, you also get a LOOTBOX!*')
            .addField('Your roll',`+----------------+\n+ ${slotOne} | ${slotTwo} | ${slotThree} +\n+----------------+`, true)
            .addField('Result',`${result}`, true)
            .addField('Combo Rewards',':poop: :poop: :poop: = NOTHING\n:eggplant: :eggplant: :eggplant: = x3\n:moneybag: :moneybag: :moneybag: = x6\n:gem: :gem: :gem: = x6 + *LOOTBOX*\n', true)

        message.channel.send(embedded);

        if(lootBox == true)
        {

            if(_User.inventory.length >= _User.inventorySize)
            {
                var embedded = new Discord.MessageEmbed();
                embedded.setColor('#ffd900')
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setDescription("Your inventory is full, you will receive \`$500\` instead of a lootbox!");
                message.channel.send(embedded);
                
                _User.economy.cash += 500;
            }
            else
            {
                message.channel.send(_LootboxHandler.giveLootbox(message, _User));
            }
        }

        _User.save();
    }
} 