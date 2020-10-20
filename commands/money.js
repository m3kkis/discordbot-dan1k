const Discord = require("discord.js");

module.exports = {
    name: 'money',
    description: 'Display all of your available money',
    args: false,
    usage: '',
    aliases: ['bal'],
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setThumbnail('https://raw.githubusercontent.com/m3kkis/discordbot-dan1k/master/img/bank.png')
            .setColor('#03b6fc')
            .addFields(
                { name:"Cash", value: "\`$" + addCommas(_User.economy.cash) + "\`"},
                { name:"Bank", value: "\`$" + addCommas(_User.economy.bank) + "\`"},
                { name:"Net Worth", value: "\`$" + addCommas( (_User.economy.cash + _User.economy.bank)) + "\`"},
            );

        function addCommas(num){

            var numToCommafy = num.toString();
            var numCommafied = '';
        
            for (var i = numToCommafy.length; i > 0; i -= 3) {
                numCommafied = numToCommafy.slice(Math.max(i - 3, 0), i) + (numCommafied ? ',' + numCommafied : '');
            }
            
            return numCommafied;
        }

        return message.channel.send(embedded);
    
    }
}