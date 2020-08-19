# Discord bot [DAN-1000]
***NOTE***: *This bot is NSFW and was created to use within my discord server with friends for* ***FUN*** *some messages may not be the most nicest but its all for fun and game.* ***Please do not take it seriously***.

With that being said, I created this bot inspired by another one that was on my server but I wanted more personal customization and freedom to add more commands that I specifically want or need. I have it running on my Raspberry Pi 3, this bot will not work properly if you use it for multiple servers as some settings are specific to your server. 

## Requirements
* This requires Nodejs v12 and up to work
* MongoDB
* PM2 (optional, depends on your need)

## Installation
```
git clone https://github.com/m3kkis/discordbot-dan1k.git
cd discordbot-dan1k
npm install
```
## Set up
This project uses dotenv package so you wil need to create a `.env` file next to the `app.js`

```
BOT_PREFIX=       // Place a prefix to start your commands
BOT_TOKEN=        // Your bot ssecret token
GUILD_ID=         // Your guild/server ID. Can be found by activating developers tool in discord
DB_HOST=mongodb:  // URL to your database
```

***Example***
```
BOT_PREFIX=!
BOT_TOKEN= BfGeThTWwrJwr5rjRJ56tyj.wrjWrt.sSDfhtyjiMKer-QEWytqecnNety
GUILD_ID=245687245641572468
DB_HOST=mongodb://127.0.0.1/dan1kBot
```

That is it, you are good to start the bot now.

## Starting up
```
node app.js
```

or if you have PM2 installed

```
pm2 start app.js
```

## Commands (so far)
* `!blackjack <amount>` play blackjack with the bot.
* `!clear <amount>` clear the amount specified of messages from chat.
* `!crime` work in crime, get highest pay but more chances to be caught.
* `!deposit <amount|all>` deposit an amount or all of your cash to your bank.
* `!help` display all of the available commands.
* `!leaderboard` display the leaderboard of your server, higher the "networth" the higher in ranks.
* `!money` display your current cash in pocket, bank and your networth.
* `!rob` rob a member of your server.
* `!slut` medium amount of pay, also chances of being caught.
* `!statistics <optional:dealer|raw>`  display your stats, dealer stats and can also view your stats in raw json format
* `!withdraw <amount|all>` withdraw cash from the bank.
* `!work` lowest payout but the safest one, will never be caught

### Notes
For now there aren't any config file to set up the games
* All timing for jobs can be modified ion the `JobHandler.js`
* For blackjack you can add more decks default is 3 but can be changed where the `new DeckHandler()` is being called. 
* Blackjack minimum is 100 but can be change to anyhting in `blackjack.js`
* Robbing someone will use `Your networth / ( Victim cash + Your networth )` as the probability chance of successful rob.

To add more replies to jobs such as work, slut and crime you will need to modifiy the `Job_Success.json` and/or `Job_Failed.json`. The `##` is the placement of the cash amount you will receive or lose. The `Job_Failed.json` does not contain any fail replies for work because you can't fail in doing `!work` 

```
{
    "work":[
        {"reply":"You had a hard day at work, you earn ##"},
    ],
    "slut":[
        {"reply":"You [BLURRED WORD] yourself to an old person, you earn ##"},
    ],
    "crime":[
        {"reply":"You stole a bicycle from a child and sold it for ##"},
    ]
}
```