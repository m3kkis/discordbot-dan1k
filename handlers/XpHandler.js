const Discord = require("discord.js");

class XpHandler {

    constructor(){

    }

    calculateTotalPointsRequired(currentLevel){
        console.log("[XP] Calculating XP Required");
        var result = Math.pow((currentLevel + (currentLevel - 1)) + 1, 2);
        return Math.floor(result);
    }

    giveExperiencePoints(_User,jobType){
        console.log("[XP] Giving out XP");
        var me = this;
        var xp = 0;
        var userPoints = _User.experience.points;
        var reqPointsLevelUp = me.calculateTotalPointsRequired(_User.experience.level);
        var boolLevelUp = false;

        switch(jobType){
            case 'work':
                xp = Math.floor(Math.pow(_User.experience.level,1)*2);
                break;
            case 'slut':
                xp = Math.floor(Math.pow(_User.experience.level,1)*4);
                break;
            case 'crime':
                xp = Math.floor(Math.pow(_User.experience.level,1)*6);
                break;
            case 'rob':
                xp = Math.floor(Math.pow(_User.experience.level,1)*8);
                break;
            case 'bj':
                xp = Math.floor(Math.pow(_User.experience.level,1)*4);
                break;
            case 'sm':
                xp = Math.floor(Math.pow(_User.experience.level,1)*2);
                break;
            case 'harvest':
                xp = Math.floor(Math.pow(_User.experience.level,1)*8);
                break;
        }

        userPoints += xp;

        if(userPoints >= reqPointsLevelUp)
        {
            console.log("[XP] Level UP!");
            var extraPoints = userPoints - reqPointsLevelUp;
            _User.experience.points = extraPoints;
            _User.experience.level += 1;
            boolLevelUp = true;

            /* GIVE LOOTBOX */
            if(_User.inventory.length >= _User.inventorySize)
            {
                _User.economy.cash += 500;
            }
            else
            {
                _User.inventory.push({
                    "name":"lootbox",
                    "display":"Lootbox",
                    "description":"Open with a key and get surprise gift!",
                    "value":1000,
                    "source":"drop"
                });
            }

        }
        else
        {
            console.log("[XP] Gave XP");
            _User.experience.points = userPoints;
        }


        return {points:xp, levelUp: boolLevelUp};
    }

    getExperienceRank(currentLevel){

        var rankTitle;

        if(currentLevel > 0 && currentLevel <= 9)
        {
            rankTitle = 'Newbie';
        }
        else if(currentLevel >= 10 && currentLevel <= 19)
        {
            rankTitle = 'Amateur';
        }
        else if(currentLevel >= 20 && currentLevel <= 29)
        {
            rankTitle = 'Skilled';
        }
        else if(currentLevel >= 30 && currentLevel <= 39)
        {
            rankTitle = 'Experienced';
        }
        else if(currentLevel >= 40 && currentLevel <= 49)
        {
            rankTitle = 'Professional';
        }
        else if(currentLevel >= 50 && currentLevel <= 59)
        {
            rankTitle = 'Expert';
        }
        else if(currentLevel >= 60 && currentLevel <= 69)
        {
            rankTitle = 'Champion';
        }
        else if(currentLevel >= 70 && currentLevel <= 79)
        {
            rankTitle = 'Elite';
        }
        else if(currentLevel >= 80 && currentLevel <= 89)
        {
            rankTitle = 'Supreme';
        }
        else if(currentLevel >= 90 && currentLevel <= 99)
        {
            rankTitle = 'Master';
        }
        else if(currentLevel >= 100)
        {
            rankTitle = 'Legend';
        }

        return rankTitle;

    }
}

module.exports = XpHandler;