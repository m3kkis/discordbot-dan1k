const Discord = require("discord.js");

module.exports = {
    name: 'buy',
    description: 'Buy an item from the store.',
    args: true,
    usage: '<store_item_number>',
    execute(client, message, args, _User, _StoreHandler){

        var embedded = new Discord.MessageEmbed();
            embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());
        
        if( _User.travel.location != "city" ) {
        
            embedded.setColor('#ff4f4f')
                .setDescription('You must be in the **CITY** to buy at the store.');

            return message.channel.send(embedded);
        }

        var id = parseInt(args[0]);

        if( isNaN(id) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }
        else
        {
            id--;
        }

        if( !_StoreHandler.checkIfIDExists(id) )
        {
            embedded.setColor('#ff4f4f')
                .setDescription('That number doesn\'t exist in store list');

            return message.channel.send(embedded);
        }
        else
        {
            if(_StoreHandler.jsonStoreItems[id].name == "upgrade_inventory")
            {

                var lvlDiff = _User.inventorySize - 4;
                var finalPrice = _StoreHandler.jsonStoreItems[id].value * Math.pow(lvlDiff,2);

                if(finalPrice > _User.economy.cash)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t afford that item.');
    
                    return message.channel.send(embedded);
                }
                else
                {
                    var reply = _StoreHandler.buyItem(id, _User);
    
                    embedded.setColor('#78de87')
                        .setDescription(reply);
        
                    _User.save();
        
                    return message.channel.send(embedded);
                }

            }
            else
            {

                if(_StoreHandler.jsonStoreItems[id].value > _User.economy.cash)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t afford that item.');
    
                    return message.channel.send(embedded);
                }
                else if(_User.store_sale == true && _StoreHandler.jsonStoreItems[id].value/2 > _User.economy.cash)
                {
                    embedded.setColor('#ff4f4f')
                        .setDescription('You can\'t afford that item even with sale on.');
    
                    return message.channel.send(embedded);
                }
                else
                {

                    if(_StoreHandler.jsonStoreItems[id].name == "transport_bicycle")
                    {
                        if(_User.experience.level < 10)
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have to be **level 10** to purchase a bicycle.');
        
                            return message.channel.send(embedded);
                        }
                        else
                        {
                            var reply = _StoreHandler.buyItem(id, _User);
    
                            embedded.setColor('#78de87')
                                .setDescription(reply);
                
                            _User.save();
                
                            return message.channel.send(embedded);
                        }
                    }
                    else if(_StoreHandler.jsonStoreItems[id].name == "transport_car")
                    {
                        if(_User.experience.level < 20)
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have to be **level 20** to purchase a car.');
        
                            return message.channel.send(embedded);
                        }
                        else
                        {
                            var reply = _StoreHandler.buyItem(id, _User);
    
                            embedded.setColor('#78de87')
                                .setDescription(reply);
                
                            _User.save();
                
                            return message.channel.send(embedded);
                        }
                    }
                    else if(_StoreHandler.jsonStoreItems[id].name == "transport_boat")
                    {
                        if(_User.experience.level < 30)
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have to be **level 30** to purchase a boat.');
        
                            return message.channel.send(embedded);
                        }
                        else
                        {
                            var reply = _StoreHandler.buyItem(id, _User);
    
                            embedded.setColor('#78de87')
                                .setDescription(reply);
                
                            _User.save();
                
                            return message.channel.send(embedded);
                        }
                    }
                    else if(_StoreHandler.jsonStoreItems[id].name == "transport_helicopter")
                    {
                        if(_User.experience.level < 40)
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have to be **level 40** to purchase a helicopter.');
        
                            return message.channel.send(embedded);
                        }
                        else
                        {
                            var reply = _StoreHandler.buyItem(id, _User);
    
                            embedded.setColor('#78de87')
                                .setDescription(reply);
                
                            _User.save();
                
                            return message.channel.send(embedded);
                        }
                    }
                    else if(_StoreHandler.jsonStoreItems[id].name == "transport_portalgun")
                    {
                        if(_User.experience.level < 50)
                        {
                            embedded.setColor('#ff4f4f')
                                    .setDescription('You have to be **level 50** to purchase a portal gun.');
        
                            return message.channel.send(embedded);
                        }
                        else
                        {
                            var reply = _StoreHandler.buyItem(id, _User);
    
                            embedded.setColor('#78de87')
                                .setDescription(reply);
                
                            _User.save();
                
                            return message.channel.send(embedded);
                        }
                    }
                    else if(_User.inventory.length >= _User.inventorySize)
                    {
                        embedded.setColor('#ff4f4f')
                                .setDescription('Your inventory is full');
            
                        return message.channel.send(embedded);
                    }
                    else
                    {

                        var reply = _StoreHandler.buyItem(id, _User);
    
                        embedded.setColor('#78de87')
                            .setDescription(reply);
            
                        _User.save();
            
                        return message.channel.send(embedded);

                    }

                }

            }
            
        }
    }
}