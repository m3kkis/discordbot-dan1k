const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Get the list of commands',
    args: false,
    execute(client, message, args, _User){

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setTitle("List of commands")

        var reply = "For more info visit https://github.com/m3kkis/discordbot-dan1k \n\n";


        var counter = 0;
        var totalCount = 0;

        client.commands.map((cmd) => {
            counter++;
            totalCount++;
            if(counter < 15)
            {
                reply += "\`" + process.env.BOT_PREFIX + cmd.name + "\` : " + cmd.description + "\n";

                if(totalCount == client.commands.size)
                {
                    embedded.setDescription(reply);
                    embedded.setFooter("// END OF COMMAND LIST");
                    return message.channel.send(embedded);
                }
            }
            else
            {
                embedded.setDescription(reply);
                message.channel.send(embedded);

                embedded.setAuthor("","")
                        .setTitle("");

                reply = "";
                counter = 0;
            }
            

        });

    }
}