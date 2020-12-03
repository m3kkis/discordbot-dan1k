const Discord = require("discord.js");

module.exports = {
    name: 'battlepet',
    description: 'Create a battle pet.',
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

                if(_User.pet.img != "")
                {
                    embedded.setThumbnail(_User.pet.img)
                            .setImage(_User.pet.img);
                }

                embedded.setColor('#03b6fc')
                        .setTitle(`${_User.pet.name}`)
                        .setDescription(`*${_User.pet.description}*`)
                        .addField(`STATS`,`*hp:* ${_User.pet.hp}\n*atk:* ${_User.pet.atk}\n*def:* ${_User.pet.def}`,true)
                        .addField(`EXPERIENCE`,`*level:* ${_User.pet.level}\n*points:* ${_User.pet.points}/0`,true)
                return message.channel.send(embedded);
            }
        }

    }
}