const Discord = require("discord.js");
const moment = require("moment");
const User = require('../models/User'); 

module.exports = {
    name: 'arrest',
    description: 'Arrest a player and send them to prison. Only police.',
    args: true,
    usage: '<name>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())

        if( _User.isPolice == false) {
            embedded.setColor('#ff4f4f')
                    .setDescription('Only a Police Officer can arrest a player.');

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
                console.log("[ARREST] ID of the Username provided does not exist.");
                embedded.setColor('#ff4f4f')
                    .setDescription("This user doesn't exists.");
                return message.channel.send(embedded);
            }
            
        }


        User.find({
            'arrest.isArrested': true
        }).then( _allUsers => {
            
            var countArrested = 0;
            _allUsers.forEach((usr) => {
                if(usr.arrest.isArrested == true)
                {
                    countArrested++;
                }
            });


            if(countArrested >= 2)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription('The prison is currently full. Max **2** prisoners.');

                return message.channel.send(embedded);
            }
            else
            {
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
        
        
        
        
        
        
                        console.log("[ARREST] Found victim ID.");
        
                        var n = moment().valueOf();
        
                        var timeLimit = 2 * (60 * (1000 * 60)); //arrest person delay time. 2hrs
                        var timeDifference = n - _Victim.arrest.last_updated;
        

                        if( _Victim.isPolice == true ) {
                            embedded.setColor('#ff4f4f')
                                .setDescription('Can\'t arrest a Police Officer.');
                
                            return message.channel.send(embedded);
                        }
                        else if( _Victim.arrest.isArrested == true ) {
                            embedded.setColor('#ff4f4f')
                                .setDescription('The user is already arrested.');
                
                            return message.channel.send(embedded);
                        }
                        else if( _Victim.isMayor == true ) {
                            embedded.setColor('#ff4f4f')
                                .setDescription('You cannot arrest a mayor.');
                
                            return message.channel.send(embedded);
                        }
                        else if( _Victim.travel.isTraveling == true ) {
                            embedded.setColor('#ff4f4f')
                            .setDescription('You cannot arrest the user because he is currently in travel');
                            
                            return message.channel.send(embedded);
                        }
                        else if( _User.travel.location != _Victim.travel.location ) {
                            embedded.setColor('#ff4f4f')
                            .setDescription('You must be in the same location to arrest a player.');
                            
                            return message.channel.send(embedded);
                        }
                        else if( timeDifference < timeLimit ) {
                            embedded.setColor('#ff4f4f')
                                    .setDescription(`You cannot arrest this user for the next ${moment.utc(timeLimit - timeDifference).format('hh:mm:ss')}`);
                
                            return message.channel.send(embedded);
                        }
                        else
                        {

                            var usrNetworth = _Victim.economy.cash + _Victim.economy.bank;
                            var priceBail = 0;
                            if(usrNetworth > 100)
                            {
                                priceBail = Math.floor( usrNetworth * 0.15);
                            }
                            else
                            {
                                priceBail = 100;
                            }

                            _Victim.travel.location = "prison";
                            _Victim.arrest.isArrested = true;
                            _Victim.arrest.last_updated = n;
                            _Victim.arrest.priceBail = priceBail;


                            _Victim.save();
        
                            embedded.setColor('#3849ff')
                                .setDescription(`You have arrested **${_Victim.tag}**`);
                            return message.channel.send(embedded);
                        }
         
                    }
                    else
                    {
                        console.log("[ARREST] DSID does not exist.");
                        embedded.setColor('#ff4f4f')
                            .setDescription("This user doesn't exists.");
                        return message.channel.send(embedded);
                    }
                    
                });


            }

        });
    }
}