const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: 'cooldown',
    description: 'View info about all of your cooldowns.',
    args: false,
    usage: '',
    aliases: ['cd'],
    execute(client, message, args, _User, _JobHandler){

        console.log("[COOLDOWN] Displaying cooldown info.");

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
        

        var n = moment().valueOf();
        var timeLimit;
        var timeDifference;
        var timeLeft;

        var sJob = "";
        var sTimeleft = "";


        /* TIMELEFT WORK */

        timeLimit = _JobHandler.workTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.work.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Work*\n";
        sTimeleft += timeLeft + "\n";

        /* TIMELEFT SLUT */
        
        timeLimit = _JobHandler.slutTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.slut.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Slut*\n";
        sTimeleft += timeLeft + "\n";

        /* TIMELEFT CRIME */

        timeLimit = _JobHandler.crimeTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.crime.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Crime*\n";
        sTimeleft += timeLeft + "\n";

        /* TIMELEFT ROB */

        timeLimit = _JobHandler.robTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.rob.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Rob*\n";
        sTimeleft += timeLeft + "\n";

        /* TIMELEFT HARVEST */

        timeLimit = _JobHandler.harvestTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.harvest.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Harvest*\n";
        sTimeleft += timeLeft + "\n";

        /* TIMELEFT MINE */

        timeLimit = _JobHandler.mineTimeout * (1000 * 60);
        timeDifference = n - _User.jobs.mine.last_updated;

        if( (timeLimit - timeDifference) <= 0)
        {
            timeLeft = "*Ready...*";
        }
        else
        {
            timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
        }

        sJob += "*Mine*\n";
        sTimeleft += timeLeft + "\n";

        /* RESULTS */
        embedded.addField('JOBS', sJob, true);
        embedded.addField('TIMELEFT', sTimeleft, true);


        return message.channel.send(embedded);
    }
}