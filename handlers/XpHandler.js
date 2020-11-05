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

    getExperienceRank(){

    }
}

module.exports = XpHandler;