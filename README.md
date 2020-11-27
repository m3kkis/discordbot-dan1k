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
Same applies to the Mayor and Police role.

# Tutorial for Travel Update
With the new update coming to this bot, lots of things have changed. Heres a quick tutorial on how to play this discord game.

##### Locations
Now there are different locations to travel to. To view the list of locations do `!loc list` this will display you different locations where you can travel. You can travel using the travel command to any of these locations but more on that later. You can also just do `!loc` to view your current location and the players that are in the same area as you. Some locations have their own commands such as `!dep` can only be done in the city but you can do `!with` at the city or at the casino etc. If ever you can't do a command it will tell you where to be to use it.

CryptoFarm location will require you to have an access card to enter it and you cannot enter the Townhall if you are not the Mayor.

##### Traveling
To travel you use the command `!travel city` and you will use the fastest travel method you own. By default every one starts by walking and it is the slowest of them all but the rest can be purchased at the store and each method has a shorter traveling time to reach destination. Every other transport than walk and bicycle will require you to pay for fuel every time you use it so make sure you have cash on you.

You can specify which travel method you want to use if ever you don't want to spend an X amount for fuel by adding the transport method to the command `!travel city car`

##### Election
An election can happen once every 7 days. Once the command `!election` is excecuted , two people at random will chosen to become a mayor and the people of the server must vote with emoji. If ever there is only 1 candidate, he will automatically become the mayor. The person will stay as the mayor until the next election has been triggered.

##### Mayor
The mayor role can collect taxes from people up to maximum of 15% using the command `!tax <0-15>` and can only do it once a week. The mayor cannot be put into prison and cannot slut or crime. But he has his own location where he can deposit and withdraw his money. The mayor can also assign a police offcer usign the command `!promote <player>` and also fire the current police officer using `!fire <name>`. The mayor always travels for free and travels by helicopter. There can only be one Mayor

##### Police Officer
The police officer role keeps the people of the server safe. Some people may deserve to be sent to prison its up to the police officer to do his job. He can send a person to prison using `!arrest <player>`, he can search a player inventory using the command `!search <player>` to see if any illegal items are in posession of the targeted player. The police can also release a prisoner by using the command `!release <name>` The police officers travels for free and travels using the Portal Gun. There can only be one police officer.

##### Prisoners
Once you have been sent to prison you cannot do any commands until you bail out using the command `!bail` you will have 2 options, either wait an hour or you can pay a bail amount of 15% of your networth. If you are broke someone can always come visit you in jail and give you cash.

##### Farm
The farm location is where you can do `!harvest` once every 12 hours and you have a fifty-fifty chance to get either legal crops or illegal crops which you can use to sell at the store. It is open to anyone to use but beware. Once you harvest an item, the bot will send you a direct message to you saying which item you harvested. The police can always search you to see if you have any illegal items and arrest you.

##### Cryptofarm
This locaton is only accessed by purcahsing the Access Card from the store. Once you buy it, it will be in your inventory so don't lose it! Now you can travel there and use the command `!mine` you will at randomly 33% each to get either a LiteCoin, Ethereum or a Bitcoin. You can use it every hour. With the coins you get, you can sell it right away or you can do the command `!crypto` to get the current price of that coin. The data is fetched from coingecko with the real prices of coins. The sell price you will see in your inventory is the price at the time you mined it so make sure you use `!crypto` to check the actual price of it before selling it.

##### Rob
The rob command was updated and now when you rob a player theres a 10% chance that you will rob an item from the victims inventory (if the victim has any)

##### Give
You can now give items to  other players by doing `!give <player> item <#item_from_your_inventory>`

#### I believe that covers all the new stuff i added.

## Commands (so far)
* `!arrest <name>` Arrest a player and send them to prison. Only police.
* `!bail <optional:amount>` Bail out prison for free in time or pay the bail amount to get released from prison right away.
* `!blackjack <amount>` play blackjack! $100 minimum.
* `!buy <list_item_number>` buy an item from the store.
* `!cooldown` View info about all of your cooldowns.
* `!clear <amount>` clear the amount specified of messages from chat.
* `!crime` work in crime, get highest pay but more chances to be caught.
* `!crypto` check current prices for LTC, ETH and BTC using real data.
* `!deposit <amount|all>` deposit an amount or all of your cash to your bank.
* `!election` Vote for a mayor of your server. Lasts 7 days before can revote.
* `!fire <name>` Fire a Police Officer. Only mayor can do this in the townhall.
* `!give <user> cash <amount>` give cash to another user.
* `!harvest` Harvest either legal or illegal plants. Sell them for extra cash! But don\'t get caught by police.
* `!help` display all of the available commands.
* `!inventory` display all items in your inventory.
* `!leaderboard` display the leaderboard of your server, higher the "networth" the higher in ranks.
* `!level` display your current level and progression.
* `!location <optional: list>` display your current location and player nearby, optional: display information of all locations.
* `!lootbox <open|itemlist>` open a lootbox if you have the key or view all items available in lootbox.
* `!me` Display other hidden information about yourself.
* `!mine` Mine a crypto coin and then sell it in store using real data. Or buy stuff from the CryptoStore.
* `!money` display your current cash in pocket, bank and your networth.
* `!promote <name>` Promote a player to Police Officer. Only mayor can use this in the townhall.
* `!rank` display all players levels ranked.
* `!release <name>` Release a player from prison. Only police..
* `!rob` rob a member of your server.
* `!search <name>` Search a players inventory. Must be in same location.
* `!sell <item_inventory_number_list>` sell an item from your inventory.
* `!slot-machine <amount>` play the slot machine! $50 minimum.
* `!slut` medium amount of pay, also chances of being caught.
* `!store` view whats in-store.
* `!tax <percentage>` collect tax from your fellow peers. Only the mayor can do so and only once a week.
* `!travel <location> <optional:transport_type>` travel to another location either by walking or other method of transport bought from store.
* `!use <item_inventory_number_list>` Use an item from your inventory.
* `!withdraw <amount|all>` withdraw cash from the bank.
* `!work` lowest payout but the safest one, will never be caught.
* `!wtb` Remind people who is in the bitchbox.

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