const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'protest',
    description: 'Start a protest against the mayor.',
    args: false,
    usage: '',
    execute(client, message, args, _User, _Bot){

        var embedded = new Discord.MessageEmbed();

        if( _User.isMayor == true ) {
        
            embedded.setColor('#ff4f4f')
                    .setDescription('A mayor cannot start a protest');

            return message.channel.send(embedded);
        }

        if( _User.travel.location != "city" ) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('You must be in the **CITY** to start a protest.');

            return message.channel.send(embedded);
        }

        var n = moment().valueOf();
        var timeLimit = ((60 * 1000) * 60) * 8; // 8 hours cd
        var timeDifference = n - _Bot.protest.last_updated;

        if( timeDifference > timeLimit )
        {
            _Bot.protest.inProgress = true;
            _Bot.save().then(()=>{
                User.find({}).then( _ColUsers => {

                    var arrVoters = [];
                    var countThumbsup = 0;
                    var currentMayor = undefined;

                    var VOTE_TIME = 120; // in seconds

                    _ColUsers.map(function (user) {
                        if(user.tag == _Bot.election.mayor)
                        {   
                            currentMayor = user.tag;
                        }
                    });

                    if(currentMayor == undefined)
                    {

                        _Bot.protest.inProgress = false;
                        _Bot.save()

                        embedded.setColor("#ff4f4f")
                                .setDescription("There must be a mayor elected before you can start a protest.")

                        return message.channel.send(embedded);
                    }
                    
                    embedded.setColor('#84ff00')
                            .setTitle('✘✘✘ PROTEST ✘✘✘')
                            .setDescription('Click on the thumbs up to vote for a protest. Mayor is not doing his/her job well, starting a protest will take 5% of the mayors cash or $100 minimum.')
                            .addField(`VOTE`, 'Click :thumbsup: to vote.', true)
                            .addField(`IMPORTANT`, '*__• Only your first vote counts!__*\n*__• 2 minutes to vote__*', true)

                    message.channel.send(embedded).then(msg => {

                        msg.react(`👍`);


                        const filter = (reaction, user) => {

                            if( arrVoters.includes(user.id) )
                            {
                                console.log("[PROTEST] This user has already voted.");
                            }
                            else if(user.username == "testBot" || user.username == "dan1k" )
                            {
                                countThumbsup = 0;
                            }
                            else
                            {
                                arrVoters.push(user.id);
                                return [`👍`].includes(reaction.emoji.name);
                            }

                        };

                        const collector = msg.createReactionCollector(filter, {time: VOTE_TIME * 1000});

                        collector.on('collect', (reaction, reactionCollector) => {
                            if (reaction.emoji.name === `👍`) 
                            {
                                countThumbsup+=1
                            } 
                        });

                        collector.on('end', (reaction, reactionCollector) => {
                            var embedded = new Discord.MessageEmbed();

                            var totalVotes = countThumbsup;

                            if(totalVotes < 3){
                                //NOT ENOUGH VOTES
                                console.log("[PROTEST] NOT ENOUGH VOTES");
                                _Bot.protest.inProgress = false;
                                _Bot.save();

                                embedded.setColor("#ff4f4f")
                                        .setDescription("**PROTEST FAILED** There must be a minimum of 3 votes to start a protest.")

                                return message.channel.send(embedded);
                            }
                            else if (totalVotes >= 3)
                            {
                                //CANDIDATE 1 WINS
                                console.log("[PROTEST] PROTEST SUCCESS");

                                currentMayor = _Bot.election.mayor;
                                var posMayor = _ColUsers.map(function(usr) {return usr.tag; }).indexOf(currentMayor);
                                
                                _Bot.protest.last_updated = n;
                                _Bot.protest.inProgress = false;

                                _Bot.save().then(()=>{
                                    mayorNetworth = _ColUsers[posMayor].economy.cash + _ColUsers[posMayor].economy.bank;

                                    var fee = 0;

                                    if(mayorNetworth > 100)
                                    {
                                        fee = Math.floor(mayorNetworth * 0.05);
                                        _ColUsers[posMayor].economy.cash -= fee;
                                    }
                                    else
                                    {
                                        fee = 100;
                                        _ColUsers[posMayor].economy.cash -= fee;
                                    }

                                    _ColUsers[posMayor].save();

                                    embedded.setColor("#78de87")
                                        .setTitle(`✘ PROTEST SUCCESS ✘`)
                                        .setDescription(`The protest was successful the mayor has to pay \`$${fee}\` for the damages.`)
                                        .addField(`TOTAL VOTES`, totalVotes + " vote(s)", true)
                                    
                                    return message.channel.send(embedded);
                                    
                                });
                            }
                            else
                            {
                                console.log("[PROTEST] Protest Failed.")
                                _Bot.protest.inProgress = false;
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
                    .setDescription("You cannot start a protest until " + moment(_Bot.protest.last_updated + timeLimit).format('MMMM Do YYYY, HH:mm:ss'));

            return message.channel.send(embedded);
        }

    }
}