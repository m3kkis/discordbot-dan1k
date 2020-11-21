const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: 'crypto',
    description: 'Display current cryptocurrency price live data.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL());

        const emjLTC = message.guild.emojis.cache.find(emoji => emoji.name === 'LTC');
        const emjETH = message.guild.emojis.cache.find(emoji => emoji.name === 'ETH');
        const emjBTC = message.guild.emojis.cache.find(emoji => emoji.name === 'BTC');

        //DATA https://www.coingecko.com/en/api#explore-api

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

        getCryptoData().then(([ltc, eth, btc]) => {


            var priceLTC = Math.floor(ltc.prices[0][1]);
            var priceETH = Math.floor(eth.prices[0][1]);
            var priceBTC = Math.floor(btc.prices[0][1]);

            embedded.setDescription("*Live data fetched from www.coingecko.com*")
                    .addFields(
                        { name: `${emjLTC} LiteCoin`, value: `\`$${addCommas(priceLTC)}\`` },
                        { name: `${emjETH} Ethereum`, value: `\`$${addCommas(priceETH)}\`` },
                        { name: `${emjBTC} Bitcoin`, value: `\`$${addCommas(priceBTC)}\`` },
                    )
                

            return message.channel.send(embedded);
        });


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