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
DB_HOST=          // URL to your database
CHANNEL_MAIN_ID   // ID of the Main Chat Channel
```

***Example***
```
BOT_PREFIX=!
BOT_TOKEN= BfGeThTWwrJwr5rjRJ56tyj.wrjWrt.sSDfhtyjiMKer-QEWytqecnNety
GUILD_ID=245687245641572468
DB_HOST=mongodb://127.0.0.1/dan1kBot
CHANNEL_MAIN_ID=6337368621699517390
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

## After first start up
Check in your server roles for the role "BitchBox". Go into role settings and make sure you turn on the "Display role members separately from online members".
Depending on your roles, the BitchBox role needs to be pretty high in your current role lineup. It needs high levels of permisisons.

## Commands (so far)
* `!blackjack <amount>` play blackjack! $100 minimum.
* `!buy <list_item_number>` buy an item from the store.
* `!clear <amount>` clear the amount specified of messages from chat.
* `!crime` work in crime, get highest pay but more chances to be caught.
* `!deposit <amount|all>` deposit an amount or all of your cash to your bank.
* `!give <user> cash <amount>` give cash to another user.
* `!help` display all of the available commands.
* `!inventory` display all items in your inventory.
* `!leaderboard` display the leaderboard of your server, higher the "networth" the higher in ranks.
* `!level` display your current level and progression.
* `!location <optional: list>` display your current location and player nearby, optional: display information of all locations.
* `!lootbox <open|itemlist>` open a lootbox if you have the key or view all items available in lootbox.
* `!me` Display other hidden information about yourself.
* `!money` display your current cash in pocket, bank and your networth.
* `!rank` display all players levels ranked.
* `!rob` rob a member of your server.
* `!sell <item_inventory_number_list>` sell an item from your inventory.
* `!slot-machine <amount>` play the slot machine! $50 minimum.
* `!slut` medium amount of pay, also chances of being caught.
* `!store` view whats in-store.
* `!travel` travel to another location either by walking or other method of transport bought from store.
* `!use <item_inventory_number_list>` Use an item from your inventory.
* `!withdraw <amount|all>` withdraw cash from the bank.
* `!work` lowest payout but the safest one, will never be caught

### Notes
For now there aren't any config file to set up the games
* This bot DB is set by default to `dan1kBot` and you can find the collection `users` and `bots`.
* All timing for jobs can be modified ion the `JobHandler.js`.
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
        {"reply":"You stole a bicycle from a teenager and sold it for ##"},
    ]
}
```