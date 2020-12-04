const Discord = require("discord.js");

module.exports = {
    name: 'heal',
    description: 'Heal your pet to max health.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if(_User.pet.name == undefined)
        {
            embedded.setColor('#ff4f4f')
                    .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
            return message.channel.send(embedded);
        }

        if( _User.travel.location != "arena" ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **ARENA** to do pet training.');

            return message.channel.send(embedded);
        }

        if( _User.pet.inBattle == true ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('Your pet is currently in training or pvp.');

            return message.channel.send(embedded);
        }

        if( _User.pet.hp >= _User.pet.hp_max) {

            embedded.setColor('#ff4f4f')
                    .setDescription('Your pet is already at full health.');

            return message.channel.send(embedded);
        }

        var diffHP = _User.pet.hp_max - _User.pet.hp;
        var priceHeal = 10;
        var totalPrice = diffHP * priceHeal;
        
        if(args[0] != undefined && args[0].toLowerCase() == "price" )
        {
            embedded.setColor('#03b6fc')
                    .setDescription(`It will cost you \`$${totalPrice}\` to heal your pet.`);

            return message.channel.send(embedded);
        }
        else
        {

            if(_User.economy.cash < totalPrice)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`It costs \`$${totalPrice}\` to heal your pet. You do not have enough cash.`);

                return message.channel.send(embedded);
            }
            else
            {
                _User.economy.cash -= totalPrice;
                _User.pet.hp = _User.pet.hp_max;
                _User.save();

                embedded.setColor('#78de87')
                        .setDescription(`Fee of \`$${totalPrice}\` charged. Your pet is healed.`);

                return message.channel.send(embedded);
            }

        }

    }
}