const dotenv = require('dotenv').config();
const Discord = require("discord.js");
const fs = require('fs');

const mongoose = require('mongoose');


const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = process.env.BOT_PREFIX;

//Set files in /commands as your commands
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//Connect to DB
mongoose.connect(process.env.DB_HOST,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }) 
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong with MongoDB', err));

//Connect bot
client.once('ready', () => {
    console.log('Dan-1000 is online!');
});

//Wait for message
client.on('message', message => {

    /**
     * COLORS USED:
     * 
     * GREEN:    #78de87
     * ORANGE:
     * RED:      #ff4f4f
     */


    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const embedded = new Discord.MessageEmbed();
    embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
       
    if (command.args && !args.length) {

        let reply = 'You didn\'t provide any arguments!';

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        
        embedded.setColor('#ff4f4f')
            .setDescription(reply);

		return message.channel.send(embedded);
    }

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

});

//token&prefix in .env
client.login(process.env.BOT_TOKEN);