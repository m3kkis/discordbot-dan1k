const Discord = require("discord.js");
const User = require('../models/User'); 

module.exports = {
    name: 'factions',
    description: 'Display all factions.',
    args: false,
    usage: '',
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setColor('#03b6fc')
            .setDescription(`You can join of the following Factions to represent and get bonuses by doing the command \`${process.env.BOT_PREFIX}join <name>\``)
            .addFields(
                { name: '¤ FREELANCERS ¤', value: '•Bonus $ for work\n•Reduced bail $\n•Bonus $ crops\n•', inline: true  },
                { name: '× OUTLAWS ×', value: '•Better % in slut\n•Better % in crime\n•Better % in robbing items\n•', inline: true },
            )
            .setFooter("WORK IN PROGRESS, NOT APPLIED YET. OPEN FOR SUGGESTION FOR BONUSES")

        
        return message.channel.send(embedded);
    }
}