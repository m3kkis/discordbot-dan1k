const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'wtb',
    description: 'Remind people who is in the bitchbox.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();

        var arrReplies = [
            "Deep inside, you're also a little bitch for aksing that.",
            "Just because you asked that, you also belong in the BitchBox.",
            "Apperantly, you can't read on the side. I think you should be in the BitchBox instead.",
            "In reality, it is you who is the real bitch.",
            "Stop asking that you bitch."
        ];

        var chance = Math.random();
        var randomNbr = Math.floor(Math.random() * arrReplies.length);


        victim = message.author.id;
        var userRole = message.guild.member(victim).roles.cache.find(r => r.name === "BitchBox")

        if(userRole != undefined)
        {
            console.log("[USE] This user has the bitchbox role already.");
            embedded.setColor('#ff69af')
                    .setThumbnail(message.member.user.avatarURL())
                    .setDescription("You're the bitch!");

            return message.channel.send(embedded);
        }

        if(chance < 0.1)
        {

            var role = message.guild.roles.cache.find(r => r.name === "BitchBox");

            message.guild.members.cache.forEach(member => {
                if(!member.roles.cache.find(r => r.name == 'BitchBox')) return;
                member.roles.remove(role.id).then(function() {
                    console.log(`[USE] Removed role from user ${member.user.tag}!`);
                });
            });
            
            message.guild.member(victim).roles.add(role);
            

            embedded.setColor("#ff69af")
                    .setThumbnail(message.member.user.avatarURL())
                    .setDescription("Looks like **" + message.author.tag + "** is the bitch now.");

            message.author.send(">>> " + arrReplies[randomNbr]);
            return message.channel.send(embedded);
        }
        else
        {

            var uid = message.guild.roles.cache.find(r => r.name === "BitchBox").members.map(m=>m.user.id)
            var theBitch = client.users.cache.find(user => user.id === uid[0]);
            embedded.setColor("#ff69af")
                    .setThumbnail(theBitch.avatarURL())
                    .setDescription("**" + message.guild.roles.cache.find(r => r.name === "BitchBox").members.map(m=>m.user.tag) + "** is the bitch.")

            message.author.send(">>> " + arrReplies[randomNbr]);
            return message.channel.send(embedded);
        }

    }
}