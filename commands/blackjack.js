const Discord = require("discord.js");

module.exports = {
    name: 'blackjack',
    description: 'Play blackjack with the bot.',
    args: true,
    usage: '<amount>',
    aliases: ['bj'],
    execute(client, message, args, _User, _Bot, _DeckHandler, _XpHandler){

        var amount = parseInt(args[0]);

        var embedded = new Discord.MessageEmbed();
        embedded.setAuthor(message.member.user.tag, message.member.user.avatarURL());

        if( isNaN(amount) ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('That doesn\'t seem to be a valid NUMBER.');

            return message.channel.send(embedded);
        }

        if( amount > _User.economy.cash ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('You do not have enough money.');

            return message.channel.send(embedded);
        }

        if( amount < 100 ) {
            
            embedded.setColor('#ff4f4f')
                .setDescription('Minimum \`$100\` is required to play blackjack.');

            return message.channel.send(embedded);
        }

        const emjCLUBS = message.guild.emojis.cache.find(emoji => emoji.name === 'CARD_CLUBS');
        const emjSPADES = message.guild.emojis.cache.find(emoji => emoji.name === 'CARD_SPADES');
        const emjHEARTS = message.guild.emojis.cache.find(emoji => emoji.name === 'CARD_HEARTS');
        const emjDIAMONDS = message.guild.emojis.cache.find(emoji => emoji.name === 'CARD_DIAMONDS');
        const emjHIDDEN = message.guild.emojis.cache.find(emoji => emoji.name === 'CARD_HIDDEN');

        var embedID;
        _User.ingame = true;

        var player = {
            id : "player",
            hand : new Array(),
            aceCount : 0,
            display : "",
            score : 0,
            instantWin : false
        };

        var dealer = {
            id : "dealer",
            hand : new Array(),
            aceCount : 0,
            display : "",
            displayHiddenCard : "",
            score : 0
        };

        _User.save().then(()=>{
            dealCards( [player, dealer] );
            setHiddenCardDisplay();
            countingScore( [player, dealer] );
            startGame( [player, dealer] );
        });



        function dealCards(participants){
            console.log("[BLACKJACK] Dealing cards");
            for(var i = 0; i < 2; i++)
            {
                for (var j = 0; j < participants.length; j++)
                {
                    var card = _DeckHandler.getCard();
                    participants[j].hand.push(card);
                    setCardDisplay( participants[j].id, participants[j].hand[participants[j].hand.length - 1].Suit);
                }
            }
        }

        function setCardDisplay( participant, suit ){

            if(participant == "player"){

                switch( suit )
                {
                    case "spades":
                        player.display += player.hand[player.hand.length - 1].Value + ` ${emjSPADES} `;
                        break;
                    case "diamonds":
                        player.display += player.hand[player.hand.length - 1].Value + ` ${emjDIAMONDS} `;
                        break;
                    case "clubs":
                        player.display += player.hand[player.hand.length - 1].Value + ` ${emjCLUBS} `;
                        break;
                    case "hearts":
                        player.display += player.hand[player.hand.length - 1].Value + ` ${emjHEARTS} `;
                        break;
                }

            }
            else if(participant == "dealer"){

                switch( suit )
                {
                    case "spades":
                        dealer.display += dealer.hand[dealer.hand.length - 1].Value + ` ${emjSPADES} `;
                        break;
                    case "diamonds":
                        dealer.display += dealer.hand[dealer.hand.length - 1].Value + ` ${emjDIAMONDS} `;
                        break;
                    case "clubs":
                        dealer.display += dealer.hand[dealer.hand.length - 1].Value + ` ${emjCLUBS} `;
                        break;
                    case "hearts":
                        dealer.display += dealer.hand[dealer.hand.length - 1].Value + ` ${emjHEARTS} `;
                        break;
                }

            }
        }

        function setHiddenCardDisplay(){

            switch( dealer.hand[0].Suit )
            {
                case "spades":
                    dealer.displayHiddenCard += dealer.hand[0].Value + ` ${emjSPADES} `;
                    break;
                case "diamonds":
                    dealer.displayHiddenCard += dealer.hand[0].Value + ` ${emjDIAMONDS} `;
                    break;
                case "clubs":
                    dealer.displayHiddenCard += dealer.hand[0].Value + ` ${emjCLUBS} `;
                    break;
                case "hearts":
                    dealer.displayHiddenCard += dealer.hand[0].Value + ` ${emjHEARTS} `;
                    break;
            }

            dealer.displayHiddenCard += `? ${emjHIDDEN} `;

        }


        function countingScore(participants){
            console.log("[BLACKJACK] Counting players score");

            for (var i = 0; i < participants.length; i++)
            {

                participants[i].score = 0;
                participants[i].aceCount = 0;

                for (var j = 0; j < participants[i].hand.length; j++)
                {
                    if(participants[i].hand[j].Value == "A")
                        participants[i].aceCount++

                    participants[i].score += participants[i].hand[j].Weight;
                }

                while (participants[i].aceCount > 0 && participants[i].score > 21) {
                    participants[i].score -= 10;
                    participants[i].aceCount -= 1;
                }
            }

        }

        function startGame(){
            console.log("[BLACKJACK] Starting game");
            embedded.setColor('#03b6fc')
                .setDescription('Type \`hit\` to draw another card or \`stand\` to pass.')
                .addFields(
                    { name:"Your hand", value: player.display + "\n\nValue: " + player.score, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name:"Dealer hand", value: dealer.displayHiddenCard + "\n\nValue: " + (dealer.score - dealer.hand[ dealer.hand.length - 1 ].Weight ), inline: true },
                )
                .setFooter( 'Remaining cards: ' + _DeckHandler.countRemainingCards() )

            message.channel.send(embedded).then( sent => {
                embedID = sent.id;
                console.log("[BLACKJACK] Embed ID " + embedID);

                if(player.score == 21)
                {
                    player.instantWin = true;
                    ShowResult(player);
                }
                else if(dealer.score == 21)
                {
                    ShowResult(dealer);
                }
                else
                {
                    waitForReply();
                }
    
            });


        }

        function hit(participant){
            console.log("[BLACKJACK] Player Hit");

            var card = _DeckHandler.getCard();
            participant.hand.push(card);

            setCardDisplay( participant.id, participant.hand[participant.hand.length - 1].Suit);
            countingScore( [participant] );
        }

        function stand(){
            console.log("[BLACKJACK] Player Stand");

            while( dealer.score < 17)
            {
                hit(dealer);
            }

            ShowResult(dealer);
        }

        function ShowResult(participant){
            console.log("[BLACKJACK] Showing Result");

            embedded.fields = [];
            embedded.setFooter( 'Remaining cards: ' + _DeckHandler.countRemainingCards() );

            var boolWin = false;

            if(participant.id == "player"){

                if( player.score > 21 ){

                    setStatistics(amount, 'loss');

                    embedded.setColor('#ff4f4f')
                        .setDescription('Result: Loss')
                        .addFields(
                            { name:"Your hand", value: player.display + "\n\nValue: " + player.score, inline: true },
                            { name: '\u200B', value: '\u200B', inline: true },
                            { name:"Dealer hand", value: dealer.display + "\n\nValue: " + dealer.score, inline: true },
                        );

                    resetGame();

                }
                else if( player.score == 21 ){

                    setStatistics(amount, 'win');

                    boolWin = true;

                    embedded.setColor('#78de87')
                        .setDescription('Result: Win')
                        .addFields(
                            { name:"Your hand", value: player.display + "\n\nValue: " + player.score, inline: true },
                            { name: '\u200B', value: '\u200B', inline: true },
                            { name:"Dealer hand", value: dealer.display + "\n\nValue: " + dealer.score, inline: true },
                        );

                    resetGame();
                    
                }
                else if( player.score < 21 )
                {
                    embedded.addFields(
                        { name:"Your hand", value: player.display + "\n\nValue: " + player.score, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name:"Dealer hand", value: dealer.displayHiddenCard + "\n\nValue: " + (dealer.score - dealer.hand[ dealer.hand.length - 1 ].Weight ), inline: true },
                    );

                    waitForReply();

                }

            }
            else if( participant.id == "dealer" )
            {

                embedded.addFields(
                    { name:"Your hand", value: player.display + "\n\nValue: " + player.score, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name:"Dealer hand", value: dealer.display + "\n\nValue: " + dealer.score, inline: true },
                );

                if( dealer.score > 21 ){

                    setStatistics(amount, 'win');

                    boolWin = true;

                    embedded.setColor('#78de87')
                        .setDescription('Result: Win')
                }
                else if( dealer.score > player.score ){

                    setStatistics(amount, 'loss');

                    embedded.setColor('#ff4f4f')
                        .setDescription('Result: Loss')
                }
                else if( dealer.score < player.score ){

                    setStatistics(amount, 'win');

                    boolWin = true;

                    embedded.setColor('#78de87')
                        .setDescription('Result: Win')
                }
                else if( dealer.score == player.score ){

                    setStatistics(amount, 'push');

                    embedded.setColor('#ffd900')
                        .setDescription('Result: Push')
                }

                resetGame();
            }

            if(boolWin == true){
                /* XP */
                var jsonExp = _XpHandler.giveExperiencePoints(_User,'bj');

                if(jsonExp.levelUp == true)
                {
                    embedded.addFields(
                        { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true },
                        { name: 'Congratulation!', value: `You leveled up.`,  inline: true }
                    )
                }
                else
                {
                    embedded.addFields(
                        { name: 'Gained XP', value: `+${jsonExp.points} XP`,  inline: true }
                    )
                }
            }

            
            message.channel.messages.fetch(embedID).then(msg => {
                if (msg) msg.edit(embedded);
            });

        }

        function resetGame(){

            console.log("[BLACKJACK] Resetting game");

            player.hand = new Array();
            player.aceCount = 0;
            player.display = "";
            player.score = 0;
            player.instantWin = false;
        
            dealer.hand = new Array();
            dealer.aceCount = 0;
            dealer.display = "";
            dealer.score = 0;
            
        }

        function setStatistics(amount, result){

            console.log("[BLACKJACK] Saving result.");

            _User.ingame = false;
            
            if(result == "win")
            {
                if(player.instantWin == true)
                {
                    amount = Math.floor(amount * 1.5);
                    _User.economy.cash += amount;
                }
                else
                {
                    _User.economy.cash += amount;
                }

            }
            else if(result == "loss")
            {
                if(_User.bj_insurance == true)
                {
                    
                    _User.bj_insurance = false;
                    _User.economy.cash -= Math.floor(amount/2);
                    _Bot.bank += Math.floor(amount/2);

                    var embeddedInsurance = new Discord.MessageEmbed();
                    embeddedInsurance.setColor('#03b6fc')
                        .setDescription(`Luck you, you were insured. You lose \`$${Math.floor(amount/2)}\` instead of \`$${amount}\``)
                    message.channel.send(embeddedInsurance)
                }
                else
                {
                    _User.economy.cash -= amount;
                    _Bot.bank += amount;
                }
            }
            else if(result == "push")
            {
                
            }
            
            _User.save().then(()=>{
                _Bot.save();
            });
        }

        function waitForReply(){
            message.channel.awaitMessages(m => m.author.id == message.author.id,{ max: 1, time: 60000 }).then(collected => {
                if (collected.first().content.toLowerCase() == 'hit') {
                    hit(player);
                    ShowResult(player);
                }
                else if (collected.first().content.toLowerCase() == 'stand') {
                    stand();
                }
                else
                {
                    waitForReply();
                }
            }).catch(() => {
                console.log("[BLACKJACK] Player no answer after 60 seconds, auto-stand");
                stand();
            });
        }


    }
}