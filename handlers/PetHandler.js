const Discord = require("discord.js");

class PetHandler {

    constructor(){
        
    }

    createPet(name, _User){
        console.log("[PETHANDLER] Create new pet -> " + name);

        _User.pet.name = name;
        _User.save();
    }

    changeDescription(desc, _User){
        console.log("[PETHANDLER] Changed pet description");

        _User.pet.description = desc;
        _User.save();
    }

    deletePet(_User){
        console.log("[PETHANDLER] Deleting pet");
        _User.pet = undefined;
        _User.save();
    }

    changeColor(color, _User){
        console.log("[PETHANDLER] Changed pet color");

        _User.pet.color = color;
        _User.save();
    }

    changeImage(img, _User){
        console.log("[PETHANDLER] Changed pet image");

        _User.pet.img = img;
        _User.save();
    }

    changeSpecial(spec, _User){
        console.log("[PETHANDLER] Changed pet special");

        _User.pet.special = spec;
        _User.save();
    }

    spawnEnemy(_User){
        console.log("[PETHANDLER] Spawning enemy.");
        var arrNames = [
            'Morgan Freeman',
            'Natalie Portman',
            'Leonardo DiCaprio',
            'Emma Stone',
            'Rober De Niro',
            'Angelina Jolie',
            'Brad Pitt',
            'Scarlett Johansson',
            'Matt Damon',
            'Carrie Fisher',
            'Tom Hanks',
            'Al Pacino',
            'Harrison Ford',
            'Johnny Depp',
            'Bruce Willis',
            'Samuel L. Jackson',
            'George Clooney',
            'Liam Neeson',
            'Tom Cruise',
            'Ryan Gosling',
            'Bradley Cooper',
            'Bill Murray',
            'Mark Wahlberg',
            'Robert Downey Jr.',
            'Zach Galifianakis',
            'Daniel Craig',
            'Owen Wilson',
            'Jim Carrey',
            'John Travolta',
            'Keanu Reeves',
            'Dany DeVito',
            'Mark Hamill',
            'Hugh Jackman',
            'Benedict Cumberbatch',
            'Elijah Wood',
            'Jonah Hill',
            'Jason Statham',
            'Daniel Radcliffe',
            'Chris Hemsworth',
            'Nicolas Cage',
            'Seth Rogen',
            'Chriss Pratt',
            'Will Smith',
            'Jeff Goldblum',
            'Mel Gibson',
            'Jame Franco',
            'Jesse Eisenberg',
            'Vin Diesel',
            'Sylvester Stallone',
            'Neil Patrick Harris',
            'Channing Tatum',
            'Jack Black',
            'Ashton Kutcher',
            'Charlie Sheen',
            'Shia LeBeouf',
            'Ryan Reynolds',
            'Arnold Shwarzenegger',
            'Gerard Butler',
            'Adam Sandler',
            'Jet Li',
            'Jackie Chan',
            'Kevin Hart',
            'Dwayne Johnson',
            'Bruce Lee',
        ];

        var modifierLVL = (Math.floor(Math.random() * 3));

        var enemyHP = _User.pet.hp_max;
        var enemyATK = _User.pet.atk;
        var enemyDEF = _User.pet.def;
        var enemyCHA = _User.pet.chance;
        var enemyLVL = _User.pet.level + modifierLVL;

        for(var i = 0; i < modifierLVL; i++)
        {
            var randomStat = Math.floor(Math.random() * 4);

            if(randomStat == 0)
            {
                enemyHP++;
            }
            else if(randomStat == 1)
            {
                enemyATK++;
            }
            else if(randomStat == 2)
            {
                enemyDEF++;
            }
            else if(randomStat == 3)
            {
                enemyCHA++;
            }
        }

        var result = {
            "name": arrNames[Math.floor(Math.random() * arrNames.length)],
            "hp": enemyHP,
            "hp_max": enemyHP,
            "atk" : enemyATK,
            "def" : enemyDEF,
            "chance" : enemyCHA,
            "lvl": enemyLVL
        }

        return result;
    }

    calculateDamage(aATK,bDEF){
        // ((a.atk*a.atk) / (a.atk + b.def))
        var result = Math.floor(((aATK*aATK) / (aATK + bDEF)));

        // (2*a.att) - (1*b.def)
        //var result = Math.floor((2*aATK) - (1*bDEF));

        return Math.max(result,1);
    }

    calculateTotalXP(currentLevel){
        console.log("[PETHANDLER] Calculating XP Required");
        var result = Math.pow((currentLevel + (currentLevel - 1)) + 1, 2);
        return Math.floor(result);
    }

    giveExperiencePoints(type, _User){
        console.log("[PETHANDLER] Giving out XP");
        var me = this;
        var xp = 0;
        var petPoints = _User.pet.points;
        var reqPointsLevelUp = me.calculateTotalXP(_User.pet.level);
        var boolLevelUp = false;

        switch(type){
            case 'training_lost':
                xp = Math.floor(Math.pow(_User.pet.level,1)*1);
                break;
            case 'training_win':
                xp = Math.floor(Math.pow(_User.pet.level,1)*2);
                break;
            case 'pvp':
                xp = Math.floor(Math.pow(_User.pet.level,1)*3);
                break;
        }

        petPoints += xp;

        if(petPoints >= reqPointsLevelUp)
        {
            console.log("[PETHANDLER] Level UP!");
            var extraPoints = petPoints - reqPointsLevelUp;
            _User.pet.points = extraPoints;
            _User.pet.points_upgrade += 1;
            _User.pet.level += 1;
            boolLevelUp = true;

        }
        else
        {
            console.log("[PETHANDLER] Gave XP");
            _User.pet.points = petPoints;
            boolLevelUp = false;
        }

        return {points:xp, levelUp: boolLevelUp};
    }

}

module.exports = PetHandler;