const dotenv = require('dotenv').config();
const Discord = require("discord.js");
const fs = require('fs');
const mongoose = require('mongoose');

const prefix = process.env.BOT_PREFIX;
const client = new Discord.Client();
client.commands = new Discord.Collection();

const DeckHandler = require('./handlers/DeckHandler.js');
var deckHandler = new DeckHandler();



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
    //Set bot status
    client.user.setActivity('your private data', { type: "WATCHING" });
    console.log('DAN-1000 is online!');

    const guild = client.guilds.cache.get(process.env.GUILD_ID);


    
    //Add emoji cards to server
    
    const cardFiles = fs.readdirSync('./cards/').filter(file => file.endsWith('.jpg'));
    for(const file of cardFiles){
        guild.emojis.create('./cards/' + file, file.replace(/.jpg/g, ''))
            .then(emoji => console.log(`Created new emoji with name :${emoji.name}: !`))
            .catch(console.error);
    }
    
    

    //Create blackjack deck
    deckHandler.createDeck(3);
    
});

//Wait for message
client.on('message', message => {

    /**
     * COLORS USED:
     * 
     * GREEN:   #78de87
     * ORANGE:  #ffd900
     * RED:     #ff4f4f
     * BLUE:    #03b6fc
     */


    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const embedded = new Discord.MessageEmbed();
    embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
       
    if (command.args && !args.length) {

        var reply = 'You didn\'t provide any arguments!';

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        
        embedded.setColor('#ff4f4f')
            .setDescription(reply);

		return message.channel.send(embedded);
    }

    try {
        if( commandName == "blackjack" || commandName == "bj")
        {
            command.execute(client, message, args, deckHandler);
        }
        else
        {
            command.execute(client, message, args);
        }
        
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

});

//token&prefix in .env
client.login(process.env.BOT_TOKEN);