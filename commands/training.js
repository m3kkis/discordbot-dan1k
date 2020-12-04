const Discord = require("discord.js");

module.exports = {
    name: 'training',
    description: 'Train your pet to increase its skills at the arena',
    args: false,
    usage: '',
    aliases: ['train'],
    execute(client, message, args, _User, _PetHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if(_User.pet.name == undefined)
        {
            embedded.setColor('#ff4f4f')
                    .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
            return message.channel.send(embedded);
        }

        if( _User.travel.location != "arena" ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You must be in the **ARENA** to do pet training.');

            return message.channel.send(embedded);
        }

        if( _User.pet.inBattle == true ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('Your pet is currently doing training.');

            return message.channel.send(embedded);
        }

        if( _User.pet.hp <= 1 ) {

            embedded.setColor('#ff4f4f')
                    .setDescription('You need to heal your pet before training.');

            return message.channel.send(embedded);
        }

        var embedID;
        var gameOver = false;
        _User.pet.inBattle = true;



        var jsonEnemy = _PetHandler.spawnEnemy(_User);
        var playerDMG = _PetHandler.calculateDamage(_User.pet.atk,jsonEnemy.def);
        var enemyDMG = _PetHandler.calculateDamage(jsonEnemy.atk,_User.pet.def);
        
        _User.save().then(()=>{

            console.log("[TRAINING] Starting training");
            embedded.setColor('#03b6fc')
                    .setDescription(`*Training in progress...*`)
                    .setThumbnail(_User.pet.img)
                    .addFields(
                        { name:`HP: ${_User.pet.hp}/${_User.pet.hp_max}`, value: `${_User.pet.name}\n__\nLVL ${_User.pet.level}\natk: ${_User.pet.atk}\ndef: ${_User.pet.def}\ncha: +${_User.pet.chance}%`, inline: true },
                        { name: '\u200B', value: 'vs.', inline: true },
                        { name:`HP: ${jsonEnemy.hp}/${jsonEnemy.hp_max}`, value: `${jsonEnemy.name}\n__\nLVL ${jsonEnemy.lvl}\natk: ${jsonEnemy.atk}\ndef: ${jsonEnemy.def}\ncha: +${jsonEnemy.chance}%`, inline: true },
                    );

            message.channel.send(embedded).then( sent => {

                embedID = sent.id;
                console.log("[TRAINING] Embed ID " + embedID);

                var intr = setInterval(function() {
                    battle(playerDMG,enemyDMG);
                  if (gameOver == true) clearInterval(intr);
                }, 2000)

            });
        });

        function battle(dmg1,dmg2){
            var chancePlayer = Math.floor(Math.random() * 100) + 1 + (_User.pet.chance - jsonEnemy.chance);
            var chanceEnemy = Math.floor(Math.random() * 100) + 1 + (jsonEnemy.chance - _User.pet.chance );

            //console.log("[TRAINING] Chance player : " + chancePlayer + "% Chance Enemy : " + chanceEnemy + "%");

            if(chancePlayer > chanceEnemy)
            {
                console.log("[TRAINING] Player attacks DMG: " + dmg1);
                jsonEnemy.hp -= dmg1;
                checkIfAlive("enemy");
                
            }
            else
            {
                console.log("[TRAINING] Enemy attacks DMG: " + dmg2);
                _User.pet.hp -= dmg2;
                checkIfAlive("player");
            }

            

        }

        function checkIfAlive(participant){

            if(participant == "enemy")
            {
                if(jsonEnemy.hp < 1)
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
            var jsonExp;

            if(result != undefined && result == "win")
            {
                console.log("[TRAINING] Training ended. Player wins.");
                embedded.setColor('#78de87')
                        .setDescription("*Training ended. **You win**.*")
                _User.pet.inBattle = false;
                jsonExp = _PetHandler.giveExperiencePoints("training_win", _User);

                _User.save();
            }
            else if(result != undefined && result == "loss")
            {
                console.log("[TRAINING] Training ended. Enemy wins.");
                embedded.setColor('#ff4f4f')
                        .setDescription("*Training ended. **You lose**.*")
                _User.pet.inBattle = false;
                jsonExp = _PetHandler.giveExperiencePoints("training_lost", _User);

                _User.save();
            }

            embedded.addFields(
                        { name:`HP: ${_User.pet.hp}/${_User.pet.hp_max}`, value: `${_User.pet.name}\n__\nLVL ${_User.pet.level}\natk: ${_User.pet.atk}\ndef: ${_User.pet.def}\ncha: +${_User.pet.chance}%`, inline: true },
                        { name: '\u200B', value: 'vs.', inline: true },
                        { name:`HP: ${jsonEnemy.hp}/${jsonEnemy.hp_max}`, value: `${jsonEnemy.name}\n__\nLVL ${jsonEnemy.lvl}\natk: ${jsonEnemy.atk}\ndef: ${jsonEnemy.def}\ncha: +${jsonEnemy.chance}%`, inline: true },
                    );

            if(gameOver == true){
                /* XP */

                if(jsonExp.levelUp == true)
                {
                    embedded.addFields(
                        { name: 'Pet Gained XP', value: `+${jsonExp.points} XP`,  inline: false },
                        { name: 'Congratulation!', value: `Your pet leveled up. Your pet gains \`1\` upgrade point.`,  inline: false }
                    )
                }
                else
                {
                    embedded.addFields(
                        { name: 'Pet Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                    )
                }
            }

            message.channel.messages.fetch(embedID).then(msg => {
                if (msg) msg.edit(embedded);
            });
        };

    }
}