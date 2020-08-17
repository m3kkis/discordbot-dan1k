//requires node 12 and up
//discordjs 12

const dotenv = require('dotenv').config();
const Discord = require("discord.js");
const fs = require('fs');

const mongoose = require('mongoose');
const User = require('./models/User'); 

const Dealer = require('./models/Dealer');
var _Dealer;

const prefix = process.env.BOT_PREFIX;
const client = new Discord.Client();
client.commands = new Discord.Collection();

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

mongoose.set('useFindAndModify', false);

//Connect bot
client.once('ready', () => {
    //Set bot status
    client.user.setActivity('your private data', { type: "WATCHING" });
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


    //Create or find dealer
    Dealer.findOne({
        name: "dan-1000"
    })
    .then(dealer => {
        if(dealer)
        {
            console.log("[APP] Dealer found.");
            _Dealer = dealer;
        }
        else
        {
            console.log("[APP] Creating new dealer.");

            var newDealer = new Dealer({
                name: "dan-1000",
                win: 0,
                loss: 0,
                push: 0,
                cash_won: 0,
                cash_lost: 0,
            });
    
            newDealer.save().then( newDealer => {
                console.log("[APP] New dealer created.")
                _Dealer = newDealer;
            });
        }
    });

    //Create blackjack deck
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
                if( commandName == "blackjack" || commandName == "bj")
                {
                    command.execute(client, message, args, _User, _Dealer, _DeckHandler);
                }
                else if( commandName == "statistics" || commandName == "stats")
                {
                    command.execute(client, message, args, _User, _Dealer);
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
                username: message.author.username,
                economy : {
                    cash: 100,
                    bank: 100,
                },
                blackjack : {
                    win: 0,
                    loss: 0,
                    push: 0,
                    cash_won: 0,
                    cash_lost: 0,
                    cash_spent: 0
                }
            });
    
            newUser.save().then(console.log("[APP] New user created."));
            message.reply('I just created an account for you, try your command again.');
        }
    });

});

//token&prefix in .env
client.login(process.env.BOT_TOKEN);