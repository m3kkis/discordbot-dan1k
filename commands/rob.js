const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'rob',
    description: 'Rob someone\'s cash',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User, _JobHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if( _User.isPolice == true) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('A police cannot rob.');

            return message.channel.send(embedded);
        }

        if( _User.isMayor == true) {
            var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor('#ff4f4f')
                .setDescription('A mayor cannot rob.');

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
                console.log("[ROB] ID of the Username provided does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        }

        var d = new Date();
        var n = d.getTime();

        var timeLimit = _JobHandler.robTimeout * (1000 * 60);
        var timeDifference = n - _User.jobs.rob.last_updated;

        if( timeDifference > timeLimit )
        {
            _User.jobs.rob.last_updated = n;

            User.findOne({
                dsid: victim
            }).then( _Victim => {

                if(_Victim)
                {




                    /** travel time, probably needs its own class, fix later */
                    var objTravelMethodTime = {
                        "portal" : 0,
                        "helicopter" : 1,
                        "boat" : 2,
                        "car" : 3,
                        "bicycle" : 4,
                        "walk" : 5
                    }

                    var timeLimit = objTravelMethodTime[_Victim.travel.last_method] * (1000 * 60);
                    var timeDifference = n - _Victim.travel.last_updated;

                    if( timeDifference > timeLimit )
                    {
                        _Victim.travel.last_updated = n;
                        _Victim.travel.isTraveling = false;
                    }

                    /********************************************************* */





                    

                    console.log("[ROB] Found victim ID.");

                    if( _Victim.travel.isTraveling == true ) {
                        embedded.setColor('#ff4f4f')
                            .setDescription('You cannot rob the user because he is currently in travel.');
            
                        return message.channel.send(embedded);
                    }
                    else if( _User.travel.location != _Victim.travel.location ) {
                        embedded.setColor('#ff4f4f')
                            .setDescription('You must be in the same location to rob another player.');
            
                        return message.channel.send(embedded);
                    }
                    else if(_Victim.dsid == _User.dsid){
                        embedded.setColor('#ff4f4f')
                            .setDescription('You can\'t rob yourself..');
            
                        return message.channel.send(embedded);
                    }
                    else if( _Victim.economy.cash < 1000 ) {
                        embedded.setColor('#ff4f4f')
                            .setDescription('You cannot rob the user because he/she has less than \`$1000\` __in cash__.');
            
                        return message.channel.send(embedded);
                    }
                    else
                    {
                        var reply = _JobHandler.doRob(message, _User, _Victim);

                        /* ROB ITEM not sur if people will like this but ill put it separate for now */

                        var chanceItemRob = Math.random();
                        var itemRobSuccess = false;

                        if(chanceItemRob < 0.1)
                        {
                            console.log("[ROB] Success robbing an item");
                            itemRobSuccess = true;

                            var itemRobReply = new Discord.MessageEmbed();

                            if(_User.inventory.length == _User.inventorySize)
                            {
                                itemRobReply.setColor('#ff4f4f')
                                            .setDescription('You robbed an item from that player but you had no where to put it... Your inventory was full. So the robbed player gets to keep his item.');
                            }
                            else
                            {
                                if(_Victim.inventory.length == 0)
                                {
                                    itemRobReply.setColor('#ff4f4f')
                                                .setDescription('You robbed the player but he had no items for you to take...');
                                }
                                else
                                {

                                    var randomNbr = Math.floor(Math.random() * _Victim.inventory.length);
                                    var itemRobbed = _Victim.inventory[randomNbr];
                                    _Victim.inventory.splice(randomNbr,1);
                                    _User.inventory.push(itemRobbed);

                                    itemRobReply.setColor('#78de87')
                                                .setDescription(`You also robbed **${itemRobbed.display}** from the player.`);
                                }
                            }
                        }

                        /*****************************************************************************/
    
                        _User.save().then(()=>{
                            _Victim.save();
                        });

                        if(itemRobSuccess == true)
                        {
                            message.channel.send(reply);
                            return message.channel.send(itemRobReply);
                        }
                        else
                        {
                            return message.channel.send(reply);
                        }
                        
                        
                    }

                }
                else
                {
                    console.log("[ROB] DSID does not exist.");
                    embedded.setColor('#ff4f4f')
                        .setDescription("This user doesn't exists.");
                    return message.channel.send(embedded);
                }
                
            });

        }
        else
        {

            embedded.setColor('#ff4f4f')
                .setDescription("You cannot rob for the next " + convertToMinutes(timeLimit - timeDifference));
            return message.channel.send(embedded);
        }

        function convertToMinutes(timestamp) {
            var min = Math.floor(timestamp / 60000);
            var sec = ((timestamp % 60000) / 1000).toFixed(0);
            return min + ":" + (sec < 10 ? '0' : '') + sec;
        }

    }
}