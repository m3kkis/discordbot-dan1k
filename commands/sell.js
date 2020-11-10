const Discord = require("discord.js");

module.exports = {
    name: 'sell',
    description: 'Sell an item from your inventory.',
    args: true,
    usage: '<inventory_item_number>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( _User.travel.location != "city" ) {
    
            embedded.setColor('#ff4f4f')
                .setDescription('You must be in the **CITY** to buy at the store.');

            return message.channel.send(embedded);
        }

        var id = parseInt(args[0]);

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

            _User.economy.cash += (_User.inventory[id].value/2);
            

            embedded.setColor('#78de87')
                .setDescription(`Sold ${_User.inventory[id].display} successfully for \`$${addCommas( (_User.inventory[id].value/2) ) }\``);

            _User.inventory.splice(id,1);
            
            _User.save();

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