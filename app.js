const dotenv = require('dotenv').config();
const Discord = require("discord.js");
const moment = require("moment");
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

const XpHandler = require('./handlers/XpHandler.js');
var _XpHandler = new XpHandler();

const PetHandler = require('./handlers/PetHandler.js');
var _PetHandler = new PetHandler();

/** travel time, probably needs its own class, fix later */
var objTravelMethodTime = {
    "portal" : 0,
    "helicopter" : 1,
    "boat" : 2,
    "car" : 3,
    "bicycle" : 4,
    "walk" : 5
}

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
    try{
        roleBB = guild.roles.cache.find(x => x.name === "BitchBox");
        if(roleBB.name == "BitchBox") {
            console.log("[APP] BitchBox Role Already Exists");
        }
    }
    catch(e){
        console.log("[APP] Role doesn't exists, creating role BitchBox");
        guild.roles.create({ data: { name: 'BitchBox', color: '#ff69af', permissions: ['CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD'] } });
    }

    //Create role for Mayor, after that don't forget to set role as separate.

    try{
        var roleMA = guild.roles.cache.find(x => x.name === "Mayor");
        if(roleMA.name == "Mayor") {
            console.log("[APP] Mayor Role Already Exists");
        }
    }
    catch(e){
        console.log("[APP] Role doesn't exists, creating role Mayor");
        guild.roles.create({ data: { name: 'Mayor', color: '#a16e00', permissions: ['CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD'] } });
    }

    //Create role for Police, after that don't forget to set role as separate.

    try{
        var rolePO = guild.roles.cache.find(x => x.name === "Police");
        if(rolePO.name == "Police") {
            console.log("[APP] Police Role Already Exists");
        }
    }
    catch(e){
        console.log("[APP] Role doesn't exists, creating role Police");
        guild.roles.create({ data: { name: 'Police', color: '#3849ff', permissions: ['CREATE_INSTANT_INVITE', 'CHANGE_NICKNAME', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD'] } });
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

//Check if the user connected has the BitchBox role if yes then reply to chat. Also need to set up the main chat id in the .env
var repliesBitchBox = [
    'Well well well, if it ain\`t the Bitch Box cunt → ',
    'Hey everyone! The bitch of the server is online → ',
    'The Bitch Box loser is online! → ',
    'Welcome the asshole. → ',
    'You again? Go back to your little bitch box. → ',
    'Imagine not being in the BitchBox... wow... → ',
    'This guy is the little bitch → ',
    'The Bitch Box is a special little place made just for you → ',
    'STFU and go back into the Bitch Box → ',
    'Hey, who you let you in the server? Go back into the Bitch Box → '
];

client.on('presenceUpdate', (oldPresence, newPresence) => {
    var member = newPresence.member;
    var userRole = member.roles.cache.find(r => r.name === "BitchBox")
    if(userRole != undefined)
    {
        console.log("[APP] Member joined has the BitchBox role.");

        if (oldPresence == undefined || oldPresence.status != newPresence.status && newPresence.status == "online") {
            var embedded = new Discord.MessageEmbed();
            var randomReplyBitchBox = repliesBitchBox[Math.floor(Math.random() * repliesBitchBox.length)];
            var channel = member.guild.channels.cache.get(process.env.CHANNEL_MAIN_ID);

            embedded.setColor('#ff69af')
                .setDescription(randomReplyBitchBox + "**" + member.user.tag + "**");
            channel.send(embedded);
        } 
    
    }  
    else
    {
        console.log("[APP] Member joined is doesn\'t have the BitchBox role.");
    }
});

//Wait for message
client.on('message', message => {

    /**
     * COLORS USED:
     * 
     * GREEN:       #78de87
     * ORANGE:      #ffd900
     * RED:         #ff4f4f
     * BLUE:        #03b6fc
     * PURPLE:      #ae00ff
     * PINK:        #ff69af
     * DARKBLUE:    #031cfc
     * POLICEBLUE:  #3849ff
     */

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if(message.channel instanceof Discord.DMChannel) return message.reply('Can\'t reply to bot through DM. I blocked it because... This tends to... crash the bot...'); // BLOCK DM REPLIES OR ELSE IT WILL CRASH BOT!


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

            if(_User.travel.isTraveling || _User.arrest.isArrested )
            {
                //var d = new Date();
                //var n = d.getTime();
                var n = moment().valueOf();

                if( 
                    commandName == "help" || 
                    commandName == "inventory" || commandName == "inv" ||
                    commandName == "leaderboard" || commandName == "lb" ||
                    commandName == "level" ||
                    commandName == "lootbox" || commandName == "loot" ||
                    commandName == "money" || commandName == "bal" ||
                    commandName == "rank" || commandName == "xp" ||
                    commandName == "location" || commandName == "loc" ||
                    commandName == "cooldown" || commandName == "cd" ||
                    commandName == "battlepet" || commandName == "pet" ||
                    commandName == "escape" || commandName == "esc" ||
                    commandName == "me" ||
                    commandName == "law" ||
                    commandName == "store" ||
                    commandName == "use" ||
                    commandName == "crypto" ||
                    commandName == "roll" ||
                    commandName == "bail" 
                )
                {
                    executeCommand();
                }
                else if( !_User.travel.isTraveling && _User.arrest.isArrested)
                {
                    var timeLimit = 6 * ((1000 * 60) * 60); //time in prison 6 hours.
                    var timeDifference = n - _User.arrest.last_updated;
                    var timeLeft = timeLimit - timeDifference;

                    if(timeLeft <= 0)
                    {
                        timeLeft = "00:00"
                    }
                    else
                    {
                        timeLeft = moment.utc(timeLimit - timeDifference).format('HH:mm:ss');
                    }

                    var embedded = new Discord.MessageEmbed();
                    embedded.setColor('#ff4f4f')
                        .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                        .setDescription(`You are currently arrested and in prison, cannot use __that command__ until you are free in **${timeLeft}** use the command \`${process.env.BOT_PREFIX}bail\` to check if you can leave the prison.`);
                    return message.channel.send(embedded);
                }
                else
                {
                    var timeLimit = objTravelMethodTime[_User.travel.last_method] * (1000 * 60);
                    var timeDifference = n - _User.travel.last_updated;

                    if( timeDifference > timeLimit )
                    {
                        _User.travel.last_updated = n;
                        _User.travel.isTraveling = false;

                        _User.save(function(){
                            executeCommand();
                        });
                    }
                    else
                    {
                        var embedded = new Discord.MessageEmbed();
                        embedded.setColor('#ff4f4f')
                            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                            .setDescription(`You are currently traveling to the **${_User.travel.location.toUpperCase()}** by ***${_User.travel.last_method.toUpperCase()}***, cannot use __that command__ until you arrive in **${convertToMinutes(timeLimit - timeDifference)}**`);
                        return message.channel.send(embedded);
                    }
                }

                function convertToMinutes(timestamp) {
                    var min = Math.floor(timestamp / 60000);
                    var sec = ((timestamp % 60000) / 1000).toFixed(0);
                    return min + ":" + (sec < 10 ? '0' : '') + sec;
                }
            }
            else
            {
                executeCommand();
            }


            /** Execute Command */
            function executeCommand(){
                try{
                    switch(commandName){
                        case "blackjack":
                        case "bj":
                            if(_User.ingame == false)
                            {
                                command.execute(client, message, args, _User, _Bot, _DeckHandler, _XpHandler);
                            }
                            break;
                        case "election":
                        case "ele":
                            if(_Bot.election.inProgress == false)
                            {
                                command.execute(client, message, args, _User, _Bot);
                            }
                            break;
                        case "lootbox":
                        case "loot":
                            command.execute(client, message, args, _User, _LootboxHandler, _XpHandler);
                            break;
                        case "level":
                        case "lvl":
                        case "rank":
                        case "xp":
                            command.execute(client, message, args, _User, _XpHandler);
                            break;
                        case "slot-machine":
                        case "sm":
                            command.execute(client, message, args, _User, _LootboxHandler, _XpHandler);
                            break;
                        case "store":
                        case "buy":
                            command.execute(client, message, args, _User, _StoreHandler);
                            break;
                        case "law":
                        case "tax":
                            command.execute(client, message, args, _User, _Bot);
                            break;
                        case "work":
                        case "slut":
                        case "crime":
                        case "rob":
                        case "harvest":
                        case "mine":
                        case "cooldown":
                        case "cd":
                            command.execute(client, message, args, _User, _JobHandler, _LootboxHandler);
                            break;
                        case "use":
                            command.execute(client, message, args, _User, _DeckHandler);
                            break;
                        case "battlepet":
                        case "pet":
                            command.execute(client, message, args, _User, _PetHandler);
                            break;
                        default:
                            command.execute(client, message, args, _User);

                    }
                } 
                catch (error) {
                    console.error(error);
                    message.reply('There was an error trying to execute that command!');
                }
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