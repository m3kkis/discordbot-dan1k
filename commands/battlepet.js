const Discord = require("discord.js");

module.exports = {
    name: 'battlepet',
    description: 'Create a battle pet and view your pet or modify it.',
    args: false,
    usage: '',
    aliases: ['pet'],
    execute(client, message, args, _User, _PetHandler){

        var embedded = new Discord.MessageEmbed();
        embedded.setColor('#03b6fc')
                .setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if(args[0] != undefined && args[0] == "create")
        {
            if(_User.pet.name != undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You already own a battle pet.`);
                return message.channel.send(embedded);
            }

            if(args.length > 2)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Pet name has to be one word.`);
                return message.channel.send(embedded);
            }

            if(args[1] == undefined) 
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Pet name cannot be empty.`);
                return message.channel.send(embedded);
            }

            if(/[^a-zA-Z0-9-_]/.test(args[1]))
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Name cannot contain special characters except for dash and underscore.`);
                return message.channel.send(embedded);
            }

            _PetHandler.createPet(args[1],_User);

            embedded.setColor('#78de87')
                    .setDescription(`You have created a new pet **${args[1]}** successfully!`);
    
            return message.channel.send(embedded);
            
        }
        else if(args[0] != undefined && (args[0] == "description" || args[0] == "desc") )
        {
            if(_User.pet.name == undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
                return message.channel.send(embedded);
            }

            args.shift();

            var desc = args.join(" ");

            if(desc.length > 128)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`Max 128 characters for description.`);
                return message.channel.send(embedded);
            }

            _PetHandler.changeDescription(desc, _User);

            embedded.setColor('#78de87')
                    .setDescription(`You have changed your pet description successfully!`);
    
            return message.channel.send(embedded);
            
        }
        else if(args[0] != undefined && args[0] == "delete")
        {
            if(_User.pet.name == undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
                return message.channel.send(embedded);
            }

            _PetHandler.deletePet(_User);

            embedded.setColor('#78de87')
                    .setDescription(`You have deleted your pet description successfully!`);
    
            return message.channel.send(embedded);
        }
        else if(args[0] != undefined && args[0] == "color")
        {
            if(_User.pet.name == undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
                return message.channel.send(embedded);
            }

            if(args[1] == undefined) 
            {
                _PetHandler.createPet("#03b6fc",_User);

                embedded.setColor('#ffd900')
                        .setDescription(`Pet color restored to default.`);
                return message.channel.send(embedded);
            }

            if(!/#[0-9a-f]{6}/.test(args[1].toLowerCase()))
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`This is not a correct HEX value with __6 digits__. Must start with a # and followed by 6 letters and/or numbers.\n\n Check here for color palette: https://www.google.com/search?q=color+picker`);
                return message.channel.send(embedded);
            }

            _PetHandler.changeColor(args[1], _User);

            embedded.setColor('#78de87')
                    .setDescription(`You have changed color of your pet successfully!`);
    
            return message.channel.send(embedded);
        }
        else if(args[0] != undefined && (args[0] == "image" || args[0] == "img"))
        {
            if(_User.pet.name == undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
                return message.channel.send(embedded);
            }

            if(args[1] == undefined) 
            {
                _PetHandler.changeImage("https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/no_pet.jpg",_User);

                embedded.setColor('#ffd900')
                        .setDescription(`Pet image restored to default.`);
                return message.channel.send(embedded);
            }

            _PetHandler.changeImage(args[1], _User);

            embedded.setColor('#78de87')
                    .setDescription(`You have changed image of your pet successfully!`);
    
            return message.channel.send(embedded);
        }
        else
        {
            if(_User.pet.name == undefined)
            {
                embedded.setColor('#ff4f4f')
                        .setDescription(`You don't own a battle pet. Type \`${process.env.BOT_PREFIX}pet create <pet_name>\``);
                return message.channel.send(embedded);
            }
            else
            {
                embedded.setColor(_User.pet.color)
                        .setImage(_User.pet.img)
                        .setTitle(`${_User.pet.name}`)
                        .setDescription(`*${_User.pet.description}*`)
                        .addField(`STATS`,`*hp:* ${_User.pet.hp}\n*atk:* ${_User.pet.atk}\n*def:* ${_User.pet.def}`,true)
                        .addField(`EXPERIENCE`,`*level:* ${_User.pet.level}\n*points:* ${_User.pet.points}/0`,true)
                return message.channel.send(embedded);
            }
        }

    }
}