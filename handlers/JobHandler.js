const Discord = require("discord.js");
const fetch = require('node-fetch');
const XpHandler = require('./XpHandler.js')
var fs = require('fs');

class JobHandler extends XpHandler{
    constructor(){

        super();

        // All in minutes
        this.workMinMax = [100,200]; 
        this.slutMinMax = [200,400]; 
        this.crimeMinMax = [600,800]; 
        this.workTimeout = 5;
        this.slutTimeout = 10;
        this.slutFailChance = 0.3;
        this.crimeTimeout = 15;
        this.crimeFailChance = 0.5;
        this.robTimeout = 15;
        this.harvestTimeout = 720;
        this.mineTimeout = 60;
        this.jsonJobSuccess;
        this.jsonJobFailed;
    }

    loadJsonFiles(){
        console.log('[JOB HANDLER] Loading job json file.');
        var me = this;

        fs.readFile('./json/Job_Success.json', (err, data) => {
            if (err) throw err;
            me.jsonJobSuccess = JSON.parse(data);
        });

        fs.readFile('./json/Job_Failed.json', (err, data) => {
            if (err) throw err;
            me.jsonJobFailed = JSON.parse(data);
        });
    }

    doWork(message, _User){
        console.log('[JOB HANDLER] Do work success.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#78de87')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())


        /* WORK */
        
        var randomReply =  me.jsonJobSuccess.work[Math.floor((Math.random() * me.jsonJobSuccess.work.length))].reply;
        var randomCashAmount = Math.floor(Math.random() * ( me.workMinMax[1] - me.workMinMax[0]) + me.workMinMax[0]);
        
        randomReply = randomReply.replace("##", "\`$"+randomCashAmount+"\`");

        if(_User.isMayor == true)
        {
            randomReply += '\n\nMayor Bonus: \`$300\`';
            randomCashAmount += 300;
        }

        _User.economy.cash += randomCashAmount;
        embedded.setDescription(randomReply);

        /* XP */
        var jsonExp = me.giveExperiencePoints(_User,'work');

        if(jsonExp.levelUp == true)
        {
            embedded.addFields(
                { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
            )
        }
        else
        {
            embedded.addFields(
                { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
            )
        }


        return embedded;
    }

    doHarvest(message, _User){
        console.log('[JOB HANDLER] Do harvest success.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#78de87')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())

        /* HARVEST */
        var randomNbr = Math.floor(Math.random() * 2);
        var arrHarvestItems = [
            {
                "name" : "harvest_drugs",
                "display" : "Bag of drugs ",
                "description" : "Sell this to make extra cash.",
                "value" : 10000,
                "source" :"farm"
            },
            {
                "name" : "harvest_crops",
                "display" : "Crate of crops ",
                "description" : "Sell this to make extra cash.",
                "value" : 5000,
                "source" :"farm"
            }
        ]
        var randomItem = arrHarvestItems[randomNbr];
        _User.inventory.push(randomItem);

        var reply =  "You have successfully harvested plants.";

        embedded.setDescription(reply);

        /* XP */
        var jsonExp = me.giveExperiencePoints(_User,'harvest');

        if(jsonExp.levelUp == true)
        {
            embedded.addFields(
                { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
            )
        }
        else
        {
            embedded.addFields(
                { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
            )
        }

        var jsonReply = {
            "type": randomItem.display,
            "embd": embedded
        }


        return jsonReply;
    }

    doMine(message, _User){
        console.log('[JOB HANDLER] Do mine success.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        getCryptoData().then(([ltc, eth, btc]) => {

            var priceLTC = Math.floor(ltc.prices[0][1]);
            var priceETH = Math.floor(eth.prices[0][1]);
            var priceBTC = Math.floor(btc.prices[0][1]);

            var embedded = new Discord.MessageEmbed();
            embedded.setColor('#78de87')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
    
            /* MINE */
            var randomNbr = Math.floor(Math.random() * 3);
            var arrMineItems = [
                {
                    "name" : "coin_ltc",
                    "display" : "LiteCoin",
                    "description" : "Sell this to make extra cash or buy at the CryptoStore.",
                    "value" : priceLTC,
                    "source" :"cryptofarm"
                },
                {
                    "name" : "coin_eth",
                    "display" : "Ethereum",
                    "description" : "Sell this to make extra cash or buy at the CryptoStore.",
                    "value" : priceETH,
                    "source" :"cryptofarm"
                },
                {
                    "name" : "coin_btc",
                    "display" : "Bitcoin",
                    "description" : "Sell this to make extra cash or buy at the CryptoStore.",
                    "value" : priceBTC,
                    "source" :"cryptofarm"
                }
            ]
            var randomItem = arrMineItems[randomNbr];
            
            _User.inventory.push(randomItem);
    
            var reply =  `You have successfully mined a ${randomItem.display}.`;
    
            embedded.setDescription(reply);
    
            /* XP */
            var jsonExp = me.giveExperiencePoints(_User,'mine');
    
            if(jsonExp.levelUp == true)
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                    { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
                )
            }
            else
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                )
            }

            _User.save();

            return message.channel.send(embedded);
        });
    }

    doSlut(message, _User){
        console.log('[JOB HANDLER] Do slut.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        /* SLUT*/
        var chance = Math.random();
        var randomCashAmount = Math.floor(Math.random() * ( me.slutMinMax[1] - me.slutMinMax[0]) + me.slutMinMax[0]);

        if(chance < me.slutFailChance && (_User.economy.cash + _User.economy.bank) > 2000)
        {
            console.log('[JOB HANDLER] Do slut failed.');
            embedded.setColor('#ff4f4f')
            var randomReply =  me.jsonJobFailed.slut[Math.floor((Math.random() * me.jsonJobFailed.slut.length))].reply;

            randomCashAmount = Math.floor((randomCashAmount/1.5));
            randomReply = randomReply.replace("##", "\`$"+randomCashAmount+"\`");
            _User.economy.cash -= randomCashAmount;
        }
        else
        {
            console.log('[JOB HANDLER] Do slut success.');
            embedded.setColor('#78de87')
            var randomReply =  me.jsonJobSuccess.slut[Math.floor((Math.random() * me.jsonJobSuccess.slut.length))].reply;
            randomReply = randomReply.replace("##", "\`$"+randomCashAmount+"\`");

            _User.economy.cash += randomCashAmount;

            /* XP */
            var jsonExp = me.giveExperiencePoints(_User,'slut');

            if(jsonExp.levelUp == true)
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                    { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
                )
            }
            else
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                )
            }

        }

        embedded.setDescription(randomReply);
        return embedded;
    }

    doCrime(message, _User){
        console.log('[JOB HANDLER] Do crime.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        /* CRIME */

        var chance = Math.random();
        var randomCashAmount = Math.floor(Math.random() * ( me.crimeMinMax[1] - me.crimeMinMax[0]) + me.crimeMinMax[0]);

        if(chance < me.crimeFailChance && (_User.economy.cash + _User.economy.bank)  > 2000)
        {
            console.log('[JOB HANDLER] Do crime failed.');
            embedded.setColor('#ff4f4f')
            var randomReply =  me.jsonJobFailed.crime[Math.floor((Math.random() * me.jsonJobFailed.crime.length))].reply;

            randomCashAmount = Math.floor((randomCashAmount/1.5));
            randomReply = randomReply.replace("##", "\`$"+ randomCashAmount +"\`");
            _User.economy.cash -= randomCashAmount;

        }
        else
        {
            console.log('[JOB HANDLER] Do crime success.');
            embedded.setColor('#78de87')
            var randomReply =  me.jsonJobSuccess.crime[Math.floor((Math.random() * me.jsonJobSuccess.crime.length))].reply;
            randomReply = randomReply.replace("##", "\`$"+randomCashAmount+"\`");

            _User.economy.cash += randomCashAmount;

            /* XP */
            var jsonExp = me.giveExperiencePoints(_User,'crime');

            if(jsonExp.levelUp == true)
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                    { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
                )
            }
            else
            {
                embedded.addFields(
                    { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                )
            }
        }

        embedded.setDescription(randomReply);
        return embedded;
    }

    doRob(message, _User, _Victim){
        console.log('[JOB HANDLER] Do rob.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());
        var reply;

        if(_Victim.travel.isTraveling == false)
        {

            if(_Victim.rob_protection == true)
            {
                console.log('[JOB HANDLER] Do rob failed, victim protected.');
                embedded.setColor('#ff4f4f');
                reply = `You tried to rob ${_Victim.tag}, but you got bamboozled beacause he had protection turned on.`;

                _Victim.rob_protection = false;

                embedded.setDescription(reply);
            }
            else
            {
                /* your networth / (their cash + your networth) */
                var robProbability = ( _User.economy.cash + _User.economy.bank ) / ( _Victim.economy.cash + ( _User.economy.cash + _User.economy.bank ) )
                var chance = Math.random();

                if(chance < robProbability)
                {
                    console.log('[JOB HANDLER] Do rob failed.');
                    var randomCashAmount = Math.floor(Math.random() * ( me.crimeMinMax[1] - me.crimeMinMax[0]) + me.crimeMinMax[0]);
                    embedded.setColor('#ff4f4f');
                    reply = `You tried to rob ${_Victim.tag}, but you failed and got caught with a fine of \`$${randomCashAmount}\``;

                    _User.economy.cash -= randomCashAmount;

                    embedded.setDescription(reply);

                }
                else
                {
                    console.log('[JOB HANDLER] Do rob success.');
                    var randomCashAmount = Math.floor(Math.random() * ( (_Victim.economy.cash/2) - (_Victim.economy.cash/4)) + (_Victim.economy.cash/4));
                    embedded.setColor('#78de87')

                    _User.economy.cash += randomCashAmount;
                    _Victim.economy.cash -= randomCashAmount;

                    reply = `You have successfully robbed ${_Victim.tag}, and stole \`$${addCommas(randomCashAmount)}\``;

                    embedded.setDescription(reply);

                    /* XP */
                    var jsonExp = me.giveExperiencePoints(_User,'crime');

                    if(jsonExp.levelUp == true)
                    {
                        embedded.addFields(
                            { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                            { name: 'Congratulation!', value: `You leveled up. Here's a lootbox or \`500$\` if your inventory is full`,  inline: true }
                        )
                    }
                    else
                    {
                        embedded.addFields(
                            { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                        )
                    }
                }


            }

        }
        else
        {
            console.log('[JOB HANDLER] Do rob failed, victim is traveling.');
            embedded.setColor('#ff4f4f');
            reply = `Can\'t rob a person while the person is traveling.`;

            embedded.setDescription(reply);
        }

        return embedded;
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

module.exports=JobHandler;