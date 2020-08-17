class DeckHandler {

    constructor(){
        this.suits = ["spades", "diamonds", "clubs", "hearts"];
        this.values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        this.deck = new Array();
        this.deckAmount= 1;
    }

    createDeck(nbrOfDecks){
        console.log("[DECK HANDLER] Creating new deck.");
        var me = this;

        me.deckAmount = nbrOfDecks;

        for(var i = 0; i < me.deckAmount; i++)
        {
            for(var j = 0; j < me.suits.length; j++)
            {
                for(var x = 0; x < me.values.length; x++)
                {
                    var weight = parseInt(me.values[x]);

                    if (me.values[x] == "J" || me.values[x] == "Q" || me.values[x] == "K")
                        weight = 10;

                    if (me.values[x] == "A")
                        weight = 11;

                    var card = { 
                        Value: me.values[x],
                        Suit: me.suits[j],
                        Weight: weight
                    };

                    me.deck.push(card);
                }
            }

            me.suits = ["spades", "diamonds", "clubs", "hearts"];
            me.values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        }

        me.shuffleDeck();

    }

    shuffleDeck()
    {
        console.log("[DECK HANDLER] Shuffling deck.");
        var me = this;

        for (var i = 0; i < 2000; i++)
        {
            var location1 = Math.floor((Math.random() * me.deck.length));
            var location2 = Math.floor((Math.random() * me.deck.length));
            var tmp = me.deck[location1];

            me.deck[location1] = me.deck[location2];
            me.deck[location2] = tmp;
        }
    }

    getCard(){
        var me = this;

        if( me.deck.length == 0 )
        {
            console.log("[DECK HANDLER] No more cards in deck.");
            me.deck = new Array();
            me.createDeck(me.deckAmount);
        }

        var card = me.deck.pop();
        return card;
    }

    countRemainingCards(){
        var me = this;
        return me.deck.length;
    }

}
module.exports = DeckHandler;