const dotenv = require('dotenv').config();
const Discord = require("discord.js");
const fs = require('fs');

const mongoose = require('mongoose');
const User = require('./models/User'); 

const Bot = require('./models/Bot');
var _Bot;

const prefix = process.env.BOT_PREFIX;
const client = new Discord.Client();
client.commands = new Discord.Collection();

const LootboxHandler = require('./handlers/LootboxHandler.js');
var _LootboxHandler = new LootboxHandler();
_LootboxHandler.loadJsonFiles();

const StoreHandler = require('./handlers/StoreHandler.js');
var _StoreHandler = new StoreHandler();
_StoreHandler.loadJsonFiles();

const JobHandler = require('./handlers/JobHandler.js');
var _JobHandler = new JobHandler();
_JobHandler.loadJsonFiles();

const DeckHandler = require('./handlers/DeckHandler.js');
var _DeckHandler = new DeckHandler();

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
    .then(() => console.log('[APP] Now connected to MongoDB!'))
    .catch(err => console.error('[APP] Something went wrong with MongoDB', err));

//mongoose.set('useFindAndModify', false);

//Connect bot
client.once('ready', () => {
    //Set bot status
    client.user.setActivity('your private data', { type: "WATCHING", url:"https://github.com/m3kkis/discordbot-dan1k" });
    console.log('[APP] DAN-1000 is online!');

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    
    //Add emoji cards to server
    
    const cardFiles = fs.readdirSync('./cards/').filter(file => file.endsWith('.jpg'));
    for(const file of cardFiles){

        var emojiName = file.replace(/.jpg/g, '');

        if(client.emojis.name)

        guild.emojis.create('./cards/' + file, emojiName)
            .then(emoji => console.log(`[APP] Created new emoji with name :${emoji.name}: !`))
            .catch(console.error);
    }


    //Create role for Bitch Box, after that don't forget to set role as separate.
    var role;
    try{
        role = guild.roles.cache.find(x => x.name === "BitchBox");
        if(role.name == "BitchBox") {
            console.log("[APP] Role Already Exists");
        }
    }
    catch(e){
        console.log("[APP] Role doesn't exists, creating role BitchBox");
        guild.roles.create({ data: { name: 'BitchBox', color: '#ff00d8', permissions: ['CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD'] } });
    }
    

    //Create or find bot
    Bot.findOne({
        name: "DAN-1000"
    })
    .then(bot => {
        if(bot)
        {
            console.log("[APP] Bot found.");
            _Bot = bot;
        }
        else
        {
            console.log("[APP] Creating new bot.");
            var newBot = new Bot();
            newBot.save().then( newBot => {
                console.log("[APP] New bot created.")
                _Bot = newBot;
            });
        }
    });

    //Create blackjack deck ewith custom number of decks
    _DeckHandler.createDeck(3);
    
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
     * PURPLE:    #ae00ff
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


    User.findOne({
        dsid: message.author.id
    })
    .then(_User => {
        if(_User)
        {
            console.log("[APP] User found.");

            try {
                if( commandName == "store" || commandName == "buy" )
                {
                    command.execute(client, message, args, _User, _StoreHandler);
                }
                else if( commandName == "use")
                {
                    command.execute(client, message, args, _User, _DeckHandler);
                }
                else if( commandName == "blackjack" || commandName == "bj")
                {
                    if(_User.ingame == false)
                    {
                        command.execute(client, message, args, _User, _Bot, _DeckHandler);
                    }
                }
                else if( commandName == "lootbox" || commandName == "loot" || commandName == "slot-machine" || commandName == "sm")
                {
                    command.execute(client, message, args, _User, _LootboxHandler);
                }
                else if( commandName == "work" || commandName == "slut" || commandName == "crime" || commandName == "rob")
                {
                    command.execute(client, message, args, _User, _JobHandler, _LootboxHandler);
                }
                else
                {
                    command.execute(client, message, args, _User);
                }
            } 
            catch (error) {
                console.error(error);
                message.reply('There was an error trying to execute that command!');
            }
        }
        else
        {
            console.log("[APP] Creating new user.");

            var newUser = new User({
                dsid: message.author.id,
                tag: message.author.tag,
                username: message.author.username
            });

            newUser.save().then(console.log("[APP] New user created."));
            message.reply('I just created an account for you, try your command again.');
        }
    });

});

//token&prefix in .env
client.login(process.env.BOT_TOKEN);