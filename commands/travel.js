const Discord = require("discord.js");

module.exports = {
    name: 'travel',
    description: 'Travel to another location.',
    args: true,
    usage: '<location> <optional:transport_type>',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        var jsonLocEmoji = {
            "city":":cityscape:",
            "casino":":slot_machine:",
        };

        var fuelPrice = {
            "car" : 10,
            "boat" : 200,
            "helicopter" : 500
        };

        var strDestination = args[0].toLowerCase();
        var strTransportMethod;

        var d = new Date();
        var n = d.getTime();

        if(strDestination == "city" || strDestination == "casino" || strDestination == "prison" || strDestination == "farm")
        {
            console.log("[TRAVEL] Player trying to travel to " + strDestination);

            if(args[1] != undefined){

                strTransportMethod = args[1].toLowerCase();

                if(strTransportMethod == "portal"){

                    if(_User.travel.transportation.hasPortalGun){

                        console.log("[TRAVEL] Player traveling by" + strTransportMethod);
    
                        _User.travel.location = strDestination;
                        _User.travel.last_updated = n;
                        _User.travel.last_method = strTransportMethod;
                        _User.travel.isTraveling = true;
    
                        embedded.setColor('#78de87')
                                .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive instantly*`);
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for travel method.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need to buy the Portal Gun to travel by portal.`);
                    }

                }
                else if(strTransportMethod == "helicopter"){

                    if(_User.travel.transportation.hasHelicopter){
    
                        if( _User.economy.cash >= fuelPrice.helicopter)
                        {
                            console.log("[TRAVEL] Player traveling by" + strTransportMethod);
                            
                            _User.travel.location = strDestination;
                            _User.economy.cash -= fuelPrice.helicopter;
                            _User.travel.last_updated = n;
                            _User.travel.last_method = strTransportMethod;
                            _User.travel.isTraveling = true;
    
                            embedded.setColor('#78de87')
                                    .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 1 minute*`);
                        }
                        else
                        {
                            console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                            embedded.setColor('#ff4f4f')
                                    .setDescription(`You need \`${fuelPrice.helicopter}\` in cash for fuel to fly the helicopter.`);
                        }
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for travel method.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need to buy a helicopter first to be able to travel with it.`);
                    }
                }
                else if(strTransportMethod == "boat"){

                    if(_User.travel.transportation.hasBoat){
    
                        if( _User.economy.cash >= fuelPrice.boat)
                        {
                            console.log("[TRAVEL] Player traveling by " + strTransportMethod);
                            
                            _User.travel.location = strDestination;
                            _User.economy.cash -= fuelPrice.boat;
                            _User.travel.last_updated = n;
                            _User.travel.last_method = strTransportMethod;
                            _User.travel.isTraveling = true;
    
                            embedded.setColor('#78de87')
                                    .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 2 minutes*`);
                        }
                        else
                        {
                            console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                            embedded.setColor('#ff4f4f')
                                    .setDescription(`You need \`${fuelPrice.boat}\` in cash for fuel to pilot the boat.`);
                        }
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for travel method.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need to buy a boat first to be able to travel with it.`);
                    }

                }
                else if(strTransportMethod == "car"){

                    if(_User.travel.transportation.hasCar){
    
                        if( _User.economy.cash >= 10)
                        {
                            console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                            _User.travel.location = strDestination;
                            _User.economy.cash -= fuelPrice.car;
                            _User.travel.last_updated = n;
                            _User.travel.last_method = strTransportMethod;
                            _User.travel.isTraveling = true;
    
                            embedded.setColor('#78de87')
                                    .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 3 minutes*`);
                        }
                        else
                        {
                            console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                            embedded.setColor('#ff4f4f')
                                    .setDescription(`You need \`${fuelPrice.car}\` in cash for fuel to drive the car.`);
                        }
    
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for travel method.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need to buy a car first to be able to travel with it.`);
                    }

                }
                else if(strTransportMethod == "bicycle"){

                    if(_User.travel.transportation.hasBicycle){

                        console.log("[TRAVEL] Player traveling by " + strTransportMethod);
    
                        _User.travel.location = strDestination;
                        _User.travel.last_updated = n;
                        _User.travel.last_method = strTransportMethod;
                        _User.travel.isTraveling = true;
    
                        embedded.setColor('#78de87')
                                .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 4 minutes*`);
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for travel method.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need to buy a bicycle first to be able to travel with it.`);
                    }

                }
                else if(strTransportMethod == "walk"){

                    console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                    _User.travel.location = strDestination;
                    _User.travel.last_updated = n;
                    _User.travel.last_method = strTransportMethod;
                    _User.travel.isTraveling = true;

                    embedded.setColor('#78de87')
                            .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 5 minutes*`);

                }
                else
                {
                    console.log("[TRAVEL] Travel failed. Incorrect travel method.");

                    embedded.setColor('#ff4f4f')
                        .setDescription(`Make sure you typed the transport method correctly.`);
                }

            }
            else
            {
                if(_User.travel.transportation.hasPortalGun){
                    strTransportMethod = "portal";

                    console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                    _User.travel.location = strDestination;
                    _User.travel.last_updated = n;
                    _User.travel.last_method = strTransportMethod;
                    _User.travel.isTraveling = true;

                    embedded.setColor('#78de87')
                            .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive instantly*`);
                }
                else if(_User.travel.transportation.hasHelicopter){
                    strTransportMethod = "helicopter";

                    if( _User.economy.cash >= fuelPrice.helicopter)
                    {
                        console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                        _User.travel.location = strDestination;
                        _User.economy.cash -= fuelPrice.helicopter;
                        _User.travel.last_updated = n;
                        _User.travel.last_method = strTransportMethod;
                        _User.travel.isTraveling = true;

                        embedded.setColor('#78de87')
                                .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 1 minute*`);
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need \`${fuelPrice.helicopter}\` in cash for fuel to fly the helicopter.`);
                    }
                }
                else if(_User.travel.transportation.hasBoat){
                    strTransportMethod = "boat";

                    if( _User.economy.cash >= fuelPrice.boat)
                    {
                        console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                        _User.travel.location = strDestination;
                        _User.economy.cash -= fuelPrice.boat;
                        _User.travel.last_updated = n;
                        _User.travel.last_method = strTransportMethod;
                        _User.travel.isTraveling = true;

                        embedded.setColor('#78de87')
                                .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 2 minutes*`);
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need \`${fuelPrice.boat}\` in cash for fuel to pilot the boat.`);
                    }
                }
                else if(_User.travel.transportation.hasCar){
                    strTransportMethod = "car";

                    if( _User.economy.cash >= 10)
                    {
                        console.log("[TRAVEL] Player traveling by " + strTransportMethod);
                        
                        _User.travel.location = strDestination;
                        _User.economy.cash -= fuelPrice.car;
                        _User.travel.last_updated = n;
                        _User.travel.last_method = strTransportMethod;
                        _User.travel.isTraveling = true;

                        embedded.setColor('#78de87')
                                .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 3 minutes*`);
                    }
                    else
                    {
                        console.log("[TRAVEL] Travel failed. Need to pay for fuel.");

                        embedded.setColor('#ff4f4f')
                                .setDescription(`You need \`${fuelPrice.car}\` in cash for fuel to drive the car.`);
                    }

                }
                else if(_User.travel.transportation.hasBicycle){
                    strTransportMethod = "bicycle";

                    console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                    _User.travel.location = strDestination;
                    _User.travel.last_updated = n;
                    _User.travel.last_method = strTransportMethod;
                    _User.travel.isTraveling = true;

                    embedded.setColor('#78de87')
                            .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 4 minutes*`);
                }
                else
                {
                    strTransportMethod = "walk";

                    console.log("[TRAVEL] Player traveling by " + strTransportMethod);

                    _User.travel.location = strDestination;
                    _User.travel.last_updated = n;
                    _User.travel.last_method = strTransportMethod;
                    _User.travel.isTraveling = true;

                    embedded.setColor('#78de87')
                            .setDescription(`You are now traveling to the ${jsonLocEmoji[strDestination] + " **" + strDestination.toUpperCase() + "** by **" + strTransportMethod.toUpperCase() + "**"}.\n*You will arrive in 5 minutes*`);
                }
            }
        }
        else
        {
            console.log("[TRAVEL] Player trying to travel failed.");
            embedded.setColor('#ff4f4f')
                .setDescription(`Make sure you typed the location name properly.`);
        }
      

        _User.save();
        return message.channel.send(embedded);
    }
}