const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'battle',
    description: 'Battle against another player pet',
    args: false,
    usage: '<name>',
    aliases: ['pvp'],
    execute(client, message, args, _User, _PetHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if(_User.pet.name == undefined)
        {
            embedded.setColor('#ff4f4f')
                    .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
            return message.channel.send(embedded);
        }

        if( _User.pet.hp <= 1 ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You need to heal your pet before doing a battle.');

            return message.channel.send(embedded);
        }

        var victim = args[0];

        if( victim.substring(0,2) == '<@')
        {
            victim = victim.replace(/[^$\w\s]/gi, '');
        }
        else
        {
            try{
                victim = client.users.cache.find(u => u.username === victim).id;
            }
            catch{
                console.log("[BATTLE] ID of the Username provided does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        }

        User.findOne({
            dsid: victim
        }).then( _Victim => {

            if(_Victim)
            {

                /** travel time, probably needs its own class, fix later */
        
                var dTravel = new Date();
                var nTravel = dTravel.getTime();

                var objTravelMethodTime = {
                    "portal" : 0,
                    "helicopter" : 1,
                    "boat" : 2,
                    "car" : 3,
                    "bicycle" : 4,
                    "walk" : 5
                }

                var traveltimeLimit = objTravelMethodTime[_Victim.travel.last_method] * (1000 * 60);
                var traveltimeDifference = nTravel - _Victim.travel.last_updated;

                if( traveltimeDifference > traveltimeLimit )
                {
                    _Victim.travel.last_updated = nTravel;
                    _Victim.travel.isTraveling = false;
                }
        
                /******************************************************** */

                
                if( _Victim.travel.isTraveling == true ) {

                    embedded.setColor('#ff4f4f')
                            .setDescription('The player is currently in travel.');

                    return message.channel.send(embedded);
                }

                if( _User.travel.location != _Victim.travel.location ) {

                    embedded.setColor('#ff4f4f')
                            .setDescription('You must be in the same location to do a pet battle.');

                    return message.channel.send(embedded);
                }

                if(_Victim.pet.name == undefined)
                {
                    embedded.setColor('#ff4f4f')
                            .setDescription(`The Player you are trying to battle doesn't own a battle pet.`);
                    return message.channel.send(embedded);
                }

                if( _Victim.pet.inBattle == true ) {

                    embedded.setColor('#ff4f4f')
                            .setDescription('The player\'s pet is currently busy in a battle or training.');
        
                    return message.channel.send(embedded);
                }

                if( _Victim.pet.hp <= 1 ) {

                    embedded.setColor('#ff4f4f')
                            .setDescription('The player\'s pet is too low on health for you to battle.');
        
                    return message.channel.send(embedded);
                }

                var embedID;
                var gameOver = false;
                _User.pet.inBattle = true;
                _Victim.pet.inBattle = true;

                var playerDMG = _PetHandler.calculateDamage(_User.pet.atk,_Victim.pet.def);
                var enemyDMG = _PetHandler.calculateDamage(_Victim.pet.atk,_User.pet.def);
                
                _User.save().then(_Victim.save().then(()=>{

                    console.log("[BATTLE] Starting battle");
                    embedded.setColor(_User.pet.color)
                            .setThumbnail(_Victim.pet.img)
                            .setDescription(`*Battle in progress...*`)
                            .addFields(
                                { name:`HP: ${_User.pet.hp}/${_User.pet.hp_max}`, value: `${_User.pet.name}\n__\nLVL ${_User.pet.level}\natk: ${_User.pet.atk}\ndef: ${_User.pet.def}\ncha: +${_User.pet.chance}%`, inline: true },
                                { name: '\u200B', value: 'vs.', inline: true },
                                { name:`HP: ${_Victim.pet.hp}/${_Victim.pet.hp_max}`, value: `${_Victim.pet.name}\n__\nLVL ${_Victim.pet.level}\natk: ${_Victim.pet.atk}\ndef: ${_Victim.pet.def}\ncha: +${_Victim.pet.chance}%`, inline: true },
                            );

                    message.channel.send(embedded).then( sent => {

                        embedID = sent.id;
                        console.log("[BATTLE] Embed ID " + embedID);

                        var intr = setInterval(function() {
                            battle(playerDMG,enemyDMG);
                        if (gameOver == true) clearInterval(intr);
                        }, 2000)

                    });
                }));

                function battle(dmg1,dmg2){
                    var chancePlayer = Math.floor(Math.random() * 100) + 1 + (_User.pet.chance - _Victim.pet.chance);
                    var chanceEnemy = Math.floor(Math.random() * 100) + 1 + (_Victim.pet.chance - _User.pet.chance );

                    //console.log("[BATTLE] Chance player : " + chancePlayer + "% Chance Enemy : " + chanceEnemy + "%");

                    if(chancePlayer > chanceEnemy)
                    {
                        console.log("[BATTLE] Player attacks DMG: " + dmg1);
                        _Victim.pet.hp -= dmg1;
                        checkIfAlive("enemy");
                        
                    }
                    else
                    {
                        console.log("[BATTLE] Enemy attacks DMG: " + dmg2);
                        _User.pet.hp -= dmg2;
                        checkIfAlive("player");
                    }

                    

                }

                function checkIfAlive(participant){

                    if(participant == "enemy")
                    {
                        if(_Victim.pet.hp < 1)
                        {
                            gameOver = true;
                            update("win");
                        }
                        else
                        {
                            update();
                        }
                    }
                    else if(participant == "player")
                    {
                        if(_User.pet.hp < 1)
                        {
                            gameOver = true;
                            update("loss");
                        }
                        else
                        {
                            update();
                        }
                    }

                    
                };

                function update(result){

                    embedded.fields = [];
                    var jsonExpPlayer;
                    var jsonExpVictim;

                    if(result != undefined && result == "win")
                    {
                        console.log("[BATTLE] Battle ended. Player wins.");
                        embedded.setColor('#78de87')
                                .setDescription("*Battle ended. **You win**.*")

                        _User.pet.inBattle = false;
                        _Victim.pet.inBattle = false;

                        jsonExpPlayer = _PetHandler.giveExperiencePoints("battle_win", _User);
                        jsonExpVictim = _PetHandler.giveExperiencePoints("battle_lost", _Victim);

                        _User.save().then(_Victim.save());
                    }
                    else if(result != undefined && result == "loss")
                    {
                        console.log("[BATTLE] Battle ended. Enemy wins.");
                        embedded.setColor('#ff4f4f')
                                .setDescription("*Battle ended. **You lose**.*")

                        _User.pet.inBattle = false;
                        _Victim.pet.inBattle = false;

                        jsonExpPlayer = _PetHandler.giveExperiencePoints("battle_lost", _User);
                        jsonExpVictim = _PetHandler.giveExperiencePoints("battle_win", _Victim);

                        _User.save().then(_Victim.save());
                    }

                    embedded.addFields(
                                { name:`HP: ${_User.pet.hp}/${_User.pet.hp_max}`, value: `${_User.pet.name}\n__\nLVL ${_User.pet.level}\natk: ${_User.pet.atk}\ndef: ${_User.pet.def}\ncha: +${_User.pet.chance}%`, inline: true },
                                { name: '\u200B', value: 'vs.', inline: true },
                                { name:`HP: ${_Victim.pet.hp}/${_Victim.pet.hp_max}`, value: `${_Victim.pet.name}\n__\nLVL ${_Victim.pet.level}\natk: ${_Victim.pet.atk}\ndef: ${_Victim.pet.def}\ncha: +${_Victim.pet.chance}%`, inline: true },
                            );

                    if(gameOver == true){
                        /* XP */
                        if(jsonExpPlayer.levelUp == true && jsonExpVictim.levelUp == false)
                        {
                            embedded.addFields(
                                { name: 'Pet Gained XP', value: `+${jsonExpPlayer.points} XP\n**Level UP!**`,  inline: true },
                                { name: '\u200B', value: '\u200B', inline: true },
                                { name: 'Pet Gained XP', value: `+${jsonExpVictim.points} XP`,  inline: true },
                            )
                        }
                        else if(jsonExpPlayer.levelUp == false && jsonExpVictim.levelUp == true)
                        {
                            embedded.addFields(
                                { name: 'Pet Gained XP', value: `+${jsonExpPlayer.points} XP`,  inline: true },
                                { name: '\u200B', value: '\u200B', inline: true },
                                { name: 'Pet Gained XP', value: `+${jsonExpVictim.points} XP\n**Level UP!**`,  inline: true },
                            )
                        }
                        else if(jsonExpPlayer.levelUp == true && jsonExpVictim.levelUp == true)
                        {
                            embedded.addFields(
                                { name: 'Pet Gained XP', value: `+${jsonExpPlayer.points} XP\n**Level UP!**`,  inline: true },
                                { name: '\u200B', value: '\u200B', inline: true },
                                { name: 'Pet Gained XP', value: `+${jsonExpVictim.points} XP\n**Level UP!**`,  inline: true },
                            )
                        }
                        else if(jsonExpPlayer.levelUp == false && jsonExpVictim.levelUp == false)
                        {
                            embedded.addFields(
                                { name: 'Pet Gained XP', value: `+${jsonExpPlayer.points} XP`,  inline: true },
                                { name: '\u200B', value: '\u200B', inline: true },
                                { name: 'Pet Gained XP', value: `+${jsonExpVictim.points} XP`,  inline: true },
                            )
                        }
                    }

                    message.channel.messages.fetch(embedID).then(msg => {
                        if (msg) msg.edit(embedded);
                    });
                };


            }
            else
            {
                console.log("[BATTLE] DSID does not exist.");
                embedded.setColor('#ff4f4f')
                        .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
        });
    }
}