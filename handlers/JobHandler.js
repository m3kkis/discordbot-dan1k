const Discord = require("discord.js");
var fs = require('fs');

class JobHanlder{
    constructor(){
        this.workMinMax = [1,150]; 
        this.slutMinMax = [150,300]; 
        this.crimeMinMax = [300,600]; 
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

    doWork(tag, avatar, _User){
        console.log('[JOB HANDLER] Do work.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#78de87')
            .setAuthor(tag, avatar)

        var randomReply =  me.jsonJobSuccess.work[Math.floor((Math.random() * me.jsonJobSuccess.work.length))].reply;
        var randomCashAmount = Math.floor(Math.random() * ( me.workMinMax[1] - me.workMinMax[0]) + me.workMinMax[0]);
        
        randomReply = randomReply.replace("##", "**$"+randomCashAmount+"**");

        _User.economy.cash += randomCashAmount;
        _User.save();

        embedded.setDescription(randomReply);
        return embedded;
    }

    doSlut(tag, avatar, _User){
        console.log('[JOB HANDLER] Do slut.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(tag, avatar)

        var chance = Math.random();
        var randomCashAmount = Math.floor(Math.random() * ( me.slutMinMax[1] - me.slutMinMax[0]) + me.slutMinMax[0]);

        if(chance < 0.4)
        {
            embedded.setColor('#ff4f4f')
            var randomReply =  me.jsonJobFailed.slut[Math.floor((Math.random() * me.jsonJobFailed.slut.length))].reply;
            randomReply = randomReply.replace("##", "**$"+randomCashAmount+"**");
            _User.economy.cash -= randomCashAmount;
        }
        else
        {
            embedded.setColor('#78de87')
            var randomReply =  me.jsonJobSuccess.slut[Math.floor((Math.random() * me.jsonJobSuccess.slut.length))].reply;
            randomReply = randomReply.replace("##", "**$"+randomCashAmount+"**");
            _User.economy.cash += randomCashAmount;
        }

        embedded.setDescription(randomReply);
        _User.save();
        return embedded;
    }

    doCrime(tag, avatar, _User){
        console.log('[JOB HANDLER] Do crime.');
        var me = this;

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(tag, avatar)

        var chance = Math.random();
        var randomCashAmount = Math.floor(Math.random() * ( me.crimeMinMax[1] - me.crimeMinMax[0]) + me.crimeMinMax[0]);

        if(chance < 0.6)
        {
            embedded.setColor('#ff4f4f')
            var randomReply =  me.jsonJobFailed.crime[Math.floor((Math.random() * me.jsonJobFailed.crime.length))].reply;
            randomReply = randomReply.replace("##", "**$"+randomCashAmount+"**");
            _User.economy.cash -= randomCashAmount;
        }
        else
        {
            embedded.setColor('#78de87')
            var randomReply =  me.jsonJobSuccess.crime[Math.floor((Math.random() * me.jsonJobSuccess.crime.length))].reply;
            randomReply = randomReply.replace("##", "**$"+randomCashAmount+"**");
            _User.economy.cash += randomCashAmount;
        }

        embedded.setDescription(randomReply);
        _User.save();
        return embedded;
    }

}
module.exports=JobHanlder;