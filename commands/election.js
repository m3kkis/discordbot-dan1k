const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'election',
    description: 'Start a vote to elect new mayor.',
    args: false,
    usage: '',
    aliases: ['ele'],
    execute(client, message, args, _User, _Bot){

        var embedded = new Discord.MessageEmbed();

        var n = moment().valueOf();
        var timeLimit =  7 * (((60 * 1000) * 60) * 24); // 7 days
        var timeDifference = n - _Bot.election.last_updated;
 
        if( timeDifference > timeLimit )
        {
            _Bot.election.inProgress = true;
            _Bot.save().then(()=>{
                User.find({}).then( _ColUsers => {
                    var arrAllUser = [];
                    var arrVoters = [];
                    var countEggplant = 0; //Candidate 1
                    var countCucumber = 0; //Candidate 2
                    var randomCandidateOne;
                    var randomCandidateTwo;
                    var currentMayor = undefined;

                    var VOTE_TIME = 10; // in seconds

                    _ColUsers.map(function (user) {
                        if(user.experience.level >= 10 && user.tag != _Bot.election.mayor )
                        {
                            arrAllUser.push(user.tag);
                        }
                        else if(user.tag == _Bot.election.mayor)
                        {   
                            currentMayor = user.tag;
                        }
                    });

                    if(arrAllUser.length == 1 && currentMayor != undefined)
                    {
                        console.log("[ELECTION]Two candidates found.")
                        randomCandidateOne = arrAllUser[0];
                        randomCandidateTwo = currentMayor;
                    }
                    else if(arrAllUser.length == 1)
                    {
                        console.log("[ELECTION] Only one candidate found.")
                        
                        //CANDIDATE 1 WINS
                        console.log("[ELECTION] CANDIDATE 1 WINS");
                        _Bot.election.mayor = arrAllUser[0];
                        _Bot.election.last_updated = n;
                        _Bot.election.inProgress = false;

                        var pos = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(arrAllUser[0]);

                        _Bot.save().then(()=>{
                            _ColUsers[pos].isMayor = true;
                            _ColUsers[pos].save();
                        });
                        
                        var winner = client.users.cache.find(user => user.id === _ColUsers[pos].dsid)
                        embedded.setColor("#78de87")
                                .setTitle(`★${arrAllUser[0]} WINS★`)
                                .setDescription("Congratulations! You are now the new mayor.")
                                .setThumbnail(winner.avatarURL())
                            
                        return message.channel.send(embedded);
                    }
                    else if( arrAllUser.length < 1 )
                    {
                        console.log("[ELECTION] No available candidates")

                        _Bot.election.inProgress = false;
                        _Bot.save();
                        
                        embedded.setColor('#ff4f4f')
                                .setTitle('★★★')
                                .setDescription('There are no candidates available to vote for.\nA player needs to reach **level 10** to be considered in the elections.\nIf the only candidate is already a mayor, he will not be part of the candidates.')

                        return message.channel.send(embedded);;
                    }
                    else
                    {

                        randomCandidateOne = arrAllUser[Math.floor(Math.random() * arrAllUser.length)];
                        randomCandidateTwo = arrAllUser[Math.floor(Math.random() * arrAllUser.length)];
        
                        while(randomCandidateOne == randomCandidateTwo){
        
                            randomCandidateOne = arrAllUser[Math.floor(Math.random() * arrAllUser.length)];
                            randomCandidateTwo = arrAllUser[Math.floor(Math.random() * arrAllUser.length)];
        
                        }

                    }
                    
                
                    embedded.setColor('#031cfc')
                            .setTitle('★★★ ELECTION ★★★')
                            .setDescription('Click on one of the emojis below to vote or react to this message with an emoji to give your vote for the next mayor! Only players with minimum level 10 will be able to become a mayor.\n\n***IMPORTANT:*** *__Only your first vote counts!__*')
                            .addField(randomCandidateOne, 'React Eggplant :eggplant: to vote.', true)
                            .addField(randomCandidateTwo, 'React Cucumber :cucumber: to vote.', true)
                    


                    message.channel.send(embedded).then(msg => {

                        msg.react(`🍆`).then(() => msg.react('🥒'));


                        const filter = (reaction, user) => {

                            if( arrVoters.includes(user.id) )
                            {
                                console.log("[ELECTION] This user has already voted.");
                            }
                            else if(user.id === message.author.id)
                            {
                                arrVoters.push(user.id);
                                return [`🍆`, '🥒'].includes(reaction.emoji.name);
                            }

                        };

                        const collector = msg.createReactionCollector(filter, {time: VOTE_TIME * 1000});

                        collector.on('collect', (reaction, reactionCollector) => {
                            if (reaction.emoji.name === `🍆`) 
                            {
                                countEggplant+=1
                            } 
                            else if (reaction.emoji.name === `🥒`) 
                            {
                                countCucumber+=1
                            }

                        });

                        collector.on('end', (reaction, reactionCollector) => {
                            var embedded = new Discord.MessageEmbed();

                            var totalVotes = countEggplant + countCucumber;

                            if(totalVotes < 1){
                                //NOT ENOUGH VOTES
                                console.log("[ELECTION] NOT ENOUGH VOTES");
                                _Bot.election.inProgress = false;
                                _Bot.save();

                                embedded.setColor("#ff4f4f")
                                        .setDescription("**VOTE FAILED** There must be a minimum of 2 votes to elect a new mayor.")

                                return message.channel.send(embedded);
                            }
                            else if (countEggplant > countCucumber)
                            {
                                //CANDIDATE 1 WINS
                                console.log("[ELECTION] CANDIDATE 1 WINS");

                                var pos = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(randomCandidateOne);
                                currentMayor = _Bot.election.mayor;
                                var posMayor = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(currentMayor);

                                _Bot.election.mayor = randomCandidateOne;
                                _Bot.election.last_updated = n;
                                _Bot.election.inProgress = false;

                                
                                _Bot.save().then(()=>{
                                    _ColUsers[pos].isMayor = true;
                                    _ColUsers[pos].save().then(()=>{
                                        _ColUsers[posMayor].isMayor = false;
                                        _ColUsers[posMayor].save();
                                    });
                                });
                                
                                var winner = client.users.cache.find(user => user.id === _ColUsers[pos].dsid)

                                embedded.setColor("#78de87")
                                        .setTitle(`★${randomCandidateOne} WINS★`)
                                        .setDescription("Congratulations! You are now the new mayor.")
                                        .addField(randomCandidateOne, countEggplant + " vote(s)", true)
                                        .addField(randomCandidateTwo, countCucumber + " vote(s)", true)
                                        .setThumbnail(winner.avatarURL())
                                    
                                return message.channel.send(embedded);
                            }
                            else if (countEggplant < countCucumber)
                            {
                                //CANDIDATE 2 WINS
                                console.log("[ELECTION] CANDIDATE 2 WINS");

                                var pos = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(randomCandidateTwo);
                                currentMayor = _Bot.election.mayor;
                                var posMayor = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(currentMayor);

                                _Bot.election.mayor = randomCandidateTwo;
                                _Bot.election.last_updated = n;
                                _Bot.election.inProgress = false;


                                _Bot.save().then(()=>{
                                    _ColUsers[pos].isMayor = true;
                                    _ColUsers[pos].save().then(()=>{
                                        _ColUsers[posMayor].isMayor = false;
                                        _ColUsers[posMayor].save();
                                    });
                                });

                                var winner = client.users.cache.find(user => user.id === _ColUsers[pos].dsid)
                                embedded.setColor("#78de87")
                                        .setTitle(`★${randomCandidateTwo} WINS★`)
                                        .setDescription("Congratulations! You are now the new mayor.")
                                        .addField(randomCandidateOne, countEggplant + " vote(s)", true)
                                        .addField(randomCandidateTwo, countCucumber + " vote(s)", true)
                                        .setThumbnail(winner.avatarURL())
                                
                                return message.channel.send(embedded);
                            }
                            else if(countEggplant == countCucumber && totalVotes >= 2)
                            {
                                //VOTE DRAW
                                console.log("[ELECTION] VOTE DRAW");
                                _Bot.election.last_updated = n;
                                _Bot.election.inProgress = false;
                                _Bot.save();

                                embedded.setColor("#ffd900")
                                        .setDescription("**VOTE DRAW** The mayor stays as is.")
                                        .addField(randomCandidateOne, countEggplant + " vote(s)", true)
                                        .addField(randomCandidateTwo, countCucumber + " vote(s)", true)
                                
                                return message.channel.send(embedded);
                            }
                            else
                            {
                                console.log("[ELECTION] None of the criteria met.")
                                _Bot.election.inProgress = false;
                                _Bot.save();
                            }
                        });

                    });
                    

                });
            });
        }
        else
        {
            embedded.setColor('#ff4f4f')
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setDescription("You cannot start an election. The mayor still has until " + moment(_Bot.election.last_updated + timeLimit).format('MMMM Do YYYY, hh:mm:ss'));

            return message.channel.send(embedded);
        }
    }
}