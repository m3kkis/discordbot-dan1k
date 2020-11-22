const Discord = require("discord.js");
const fetch = require('node-fetch');

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

            if(_User.inventory[id].name == "coin_ltc" || _User.inventory[id].name == "coin_eth" || _User.inventory[id].name == "coin_btc")
            {
                getCryptoData().then(([ltc, eth, btc]) => {

                    var amount = 0;

                    if(_User.inventory[id].name == "coin_ltc")
                    {
                        amount = Math.floor(ltc.prices[0][1]);
                    }
                    else if(_User.inventory[id].name == "coin_eth")
                    {
                        amount = Math.floor(eth.prices[0][1]);
                    }
                    else if(_User.inventory[id].name == "coin_btc")
                    {
                        amount = Math.floor(btc.prices[0][1]);
                    }

                    _User.economy.cash += amount;
            
                    embedded.setColor('#78de87')
                            .setDescription(`Sold **${_User.inventory[id].display}** successfully for \`$${addCommas( amount ) }\``);

                    _User.inventory.splice(id,1);
        
                    _User.save();
        
                    return message.channel.send(embedded);


                });
            }
            else
            {
                _User.economy.cash += Math.floor((_User.inventory[id].value/2));
            
                embedded.setColor('#78de87')
                        .setDescription(`Sold **${_User.inventory[id].display}** successfully for \`$${addCommas( Math.floor(_User.inventory[id].value/2) ) }\``);

                _User.inventory.splice(id,1);
    
                _User.save();
    
                return message.channel.send(embedded);
            }
        }


        function requestLTC() {
            return fetch('https://api.coingecko.com/api/v3/coins/litecoin/market_chart?vs_currency=usd&days=0').then((res) => res.json());
        }

        function requestETH(){
            return fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=0').then((res) => res.json());
        }

        function requestBTC(){
            return fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=0').then((res) => res.json());
        }

        function getCryptoData(){
            return Promise.all([requestLTC(), requestETH(), requestBTC()])
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