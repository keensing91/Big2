//For Rule Testing
import Deck from './deck.mjs'
//

export default class Rules {

    //1. Basic Card Forms
    isSingle(CardsSelected) {
        if (CardsSelected.length == 1) {
            return true
        } 
        return false 
    }

    isPair(CardsSelected) {
        var lastcard = CardsSelected.length - 1        
        
        //Counting from the larger card to facilitate analytics
        for(let i = lastcard ; i >= 1; i--)
        if (CardsSelected[lastcard].value == CardsSelected[lastcard - 1].value) {
                return true
        }
        return false 
    }

    isThreeofKind(CardsSelected) {
        var lastcard = CardsSelected.length - 1 

        for (let i = lastcard; i >= 2; i--) {
            if ((CardsSelected[i].value == CardsSelected[i - 1].value) &&
            (CardsSelected[i - 1].value == CardsSelected[i - 2].value)) {

                return true
            } 
        } 
        return false  
    }

    isStraight(CardsSelected) {
        //Start checking from behind to facilitate Analytics
        var lastcard = CardsSelected.length - 1

        //Define Straight's ranking by the cardranking of the largest card
        var fiveranking = CardsSelected[lastcard].cardranking

        //First, Check the special case of A Straight [3 4 5 A 2]
        if (CardsSelected[lastcard - 4].value == 0 && CardsSelected[lastcard - 3].value == 1){
            if (CardsSelected[lastcard - 2].value == 2 && CardsSelected[lastcard - 1].value == 11) {
                if (CardsSelected[lastcard].value == 12){
                    //Rank card according to A instead of 2, and + 8 to rank above
                    return [true, CardsSelected[lastcard - 1].cardranking + 8]
                }
            }
        }

        //Secondly, Check the special case of A Straight [2 3 4 5 6]
        if (CardsSelected[lastcard - 4].value == 0 && CardsSelected[lastcard - 3].value == 1){
            if (CardsSelected[lastcard - 2].value == 2 && CardsSelected[lastcard - 1].value == 3) {
                if (CardsSelected[lastcard].value == 12){
                    //Rank card according to A instead of 2, and + 8 to rank above
                    return [true, fiveranking]
                }
            }
        }        

        //Then Remove remaining Straight Ending with a 2
        if (CardsSelected[lastcard].value == 12) {
            return false
        }

        //Then Check if all 5 cards are consecutive
        for (let i = lastcard; i >= lastcard - 3; i--) {
            if (CardsSelected[i - 1].value !== CardsSelected[i].value - 1) {
                return false
            }
        } 

        //It's a Straight after passing all above tests
        return [true, fiveranking]  
    }

    isFlush(CardsSelected) {
        var lastcard = CardsSelected.length - 1

        //Define Flush's ranking by the cardranking of the largest card
        //+100 to larger than all Straight
        var fiveranking = CardsSelected[CardsSelected.length - 1].cardranking + 100

        //Check if all suits are equal
        var suitmatch = 0
        for (let i = lastcard - 1; i >= 0; i--) {
            if (CardsSelected[i].suit == CardsSelected[lastcard].suit) {

                suitmatch++

                if (suitmatch >= 4) {
                    return [true, fiveranking]                    
                }
            }
        }
        return false 
    }

    isFullHouse(CardsSelected) {
        var lastcard = CardsSelected.length - 1;

        for (let i = lastcard; i >= 2; i--) {
            if (this.isThreeofKind(CardsSelected) == true) {
                    
                //The third ([2]) card of five card must be fullhouse class
                var fullhouseclass = CardsSelected[2].value

                //Remove the Fullhouse value to avoid duplication when checking Pairs
                var remainingnonthree = [...CardsSelected];
                for (let k = lastcard; k >= 0; k--) {
                    if (CardsSelected[k].value == fullhouseclass){
                        remainingnonthree.splice(k , 1);
                    }
                }

                //Make sure the pair is not from the ThreeofKind
                for (let j = remainingnonthree.length - 1; j >= 1; j--) {
                    if (this.isPair(remainingnonthree) &&
                    (remainingnonthree[j].value !== fullhouseclass)) {

                        return [true, CardsSelected[2].cardranking + 200]

                    }
                }               
            }
        }
        return false
    }

    isFourofKind(CardsSelected){
        var lastcard = CardsSelected.length - 1;

        //First 4 or last four cards equal
        for (let i = lastcard; i >= 4; i--) {
            if ((this.isThreeofKind(CardsSelected) == true) &&
            ((CardsSelected[i].value == CardsSelected[i - 3].value) ||
            (CardsSelected[i - 4].value == CardsSelected[i - 1].value))) {
                
                //Have more than 5 cards to form FourofKind
                if (CardsSelected.length >= 5){

                    //+300 to larger than all Straight, Flush, Fullhouse
                    //Note the middle card is selected to solve First Four or Last Four
                    var fiveranking = CardsSelected[i - 2].cardranking + 300;
                    return [true, fiveranking]
                }
            }
        }
        return false
    }

    isRoyalFlush(CardsSelected){
        if (this.isStraight(CardsSelected)[0] == true && this.isFlush(CardsSelected)[0] == true) {
                
            //Define Royal Flush's ranking by the cardranking of the largest card
            //+400 to larger than all Straight, Flush, Fullhouse
            var fiveranking = CardsSelected[3].cardranking + 400;
            
            return [true, fiveranking]
        }
        return false
    }

    isFiveCard(CardsSelected) {

        if (CardsSelected.length == 5){
            
            //All Five Card Functions Output: [0] = true/false, [1] = fiveranking

            //Royal Flush to be considered first to avoid system confusion
            if (this.isRoyalFlush(CardsSelected)[0] == true) {
                //console.log("isRoyalFlush");
                return [true, this.isRoyalFlush(CardsSelected)[1]]

            }

            if (this.isFourofKind(CardsSelected)[0] == true) {
                //console.log("isFourofKind");
                return [true, this.isFourofKind(CardsSelected)[1]]
            }

            if (this.isFullHouse(CardsSelected)[0] == true) {
                //console.log("isFullHouse");
                return [true, this.isFullHouse(CardsSelected)[1]]
            } 

            if (this.isFlush(CardsSelected)[0] == true) {
                //console.log("isFlush");
                return [true, this.isFlush(CardsSelected)[1]]
            } 

            if (this.isStraight(CardsSelected)[0] == true) {
                //console.log("isStraight");
                return [true, this.isStraight(CardsSelected)[1]]
            } 
        }
        return false
    }


    //2.Compare Hits
    CompareSingle(CardsSelected, CardsonTable) {

        return Boolean(CardsSelected[0].cardranking > CardsonTable[0].cardranking)
    }   

    ComparePair(CardsSelected, CardsonTable) {

        return Boolean(CardsSelected[1].cardranking > CardsonTable[1].cardranking)

    }

    CompareThree(CardsSelected, CardsonTable) {
        return Boolean(CardsSelected[2].cardranking > CardsonTable[2].cardranking)
    }

    CompareFive(CardsSelected, CardsonTable){
        if (this.isFiveCard(CardsSelected)[0] == true) {

            //Compare the card ranking of Five Cards stored in isFiveCard[1]
            if (this.isFiveCard(CardsSelected)[1] >
            this.isFiveCard(CardsonTable)[1]){

                return true

            }
        }
        return false
    }

    CardsontheTableRanking(CardsonTable) {
        if (CardsonTable.length == 1){
            return CardsonTable[0].cardranking;
        }
        if (CardsonTable.length == 2){
            return CardsonTable[1].cardranking;
        }
        if (CardsonTable.length == 3){
            return CardsonTable[2].cardranking;
        }
        if (CardsonTable.length == 5){
            return this.isFiveCard(CardsonTable)[1];
        }

    } 


    //3. Valid Plays

    ValidCommand(CardsSelected) {
        if ((CardsSelected.length == 1 && this.isSingle(CardsSelected) == true) ||
        (CardsSelected.length == 2 && this.isPair(CardsSelected) == true) ||
        (CardsSelected.length == 3 && this.isThreeofKind(CardsSelected) == true) ||
        (CardsSelected.length == 5 && this.isFiveCard(CardsSelected)[0] == true)) {

            return true
        }
        return false
    }

    ValidHit(CardsSelected, CardsonTable) {
        if (CardsSelected.length == CardsonTable.length) {

            if ((CardsSelected.length == 1) && 
            (this.isSingle(CardsSelected) == true) && 
            (this.CompareSingle(CardsSelected, CardsonTable) == true)) {
                return true
            }
            if ((CardsSelected.length == 2) && 
                (this.isPair(CardsSelected) == true) && 
                (this.ComparePair(CardsSelected, CardsonTable) == true)) {
                return true
            }
            if ((CardsSelected.length == 3) && 
            (this.isThreeofKind(CardsSelected) == true) && 
            (this.CompareThree(CardsSelected, CardsonTable) == true)) {
                return true
            }
            if ((CardsSelected.length == 5) && 
            (this.isFiveCard(CardsSelected)[0] == true) &&
            (this.CompareFive(CardsSelected, CardsonTable) == true)) {
                return true
            }
        }
        return false
    }

    ValidFirstCommand(CardsSelected) {
        if (this.ValidCommand(CardsSelected) == true) {

            //First Command must contain '3♦'
            if (CardsSelected[0].cardranking == 1) {
                return true
            }
        }
        return false
    }

}

/*      
//For rule testing
var deck = new Deck()
var rule = new Rules()

var hit = [
    { name: '3♦', suit: '♦', value: 0, cardranking: 1 },
    { name: '3♣', suit: '♣', value: 0, cardranking: 2 },
    { name: '3♥', suit: '♥', value: 0, cardranking: 3 },
    { name: '3♠', suit: '♠', value: 0, cardranking: 4 },
    { name: '7♠', suit: '♠', value: 4, cardranking: 20 }

]

var cardsonTable = [
     { name: '10♦', suit: '♦', value: 7, cardranking: 29 },
    { name: 'J♣', suit: '♣', value: 8, cardranking: 34 },
    { name: 'Q♦', suit: '♦', value: 9, cardranking: 37 },
    { name: 'K♣', suit: '♣', value: 10, cardranking: 42 },
    { name: 'A♥', suit: '♥', value: 11, cardranking: 47 } 
]


console.log("Valid First Command Hit: ", rule.ValidFirstCommand(hit, cardsonTable),
"isFourofKind ", rule.isFourofKind(hit),
"isFiveCard", rule.isFiveCard(hit),
"Card Ranking: ", rule.CardsontheTableRanking(hit));
//console.log("Can Hit: " + rule.ValidHit(hit, cardsonTable))
//console.log("Cards on Table: " + JSON.stringify(cardsonTable))
//console.log("Hit: " + JSON.stringify(hit))
 */
