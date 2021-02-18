/*TO DO:

    - ACE CHECKING ALGORITHM - DONE
        -block a hit option when player's points are 21 after ace checking - DONE
    - RAISE FUNCTION - DONE
    - STAKE SYSTEM - DONE
    - RESET GAME FUNCTION - DONE
    - BANKRUPT - DONE
    - DRAW BUG (CASH AND STAKE CONCATENATE AS STRING) - DONE
    - WHEN PLAYER REACH 21 POINTS, STAKE WON'T ADD TO CASH - DONE
    - DISABLE HIT BUTTON WHEN PLAYER REACH 21 POINTS, AND RAISE BUTTON AFTER CARD DEALING - DONE
    - TWO ACES BUG - DONE
    - PLAYER CAN TAKE 11 POINTS FROM ACE DURING CHECKING AND HAS OVER 21 POINTS - DONE
    - DEALER HAS REACHED 17 AND STILL CAN HIT ANOTHER CARD - DONE
    - BLACKJACK - DONE ON DEALER SIDE 
    - BETTER GUI - DONE
    - OPTIMIZE CODE -

*/

// GLOBAL VARIABLES

let deck = [];
let pCards = [];
let dCards = [];
let dealedCards = 0;
let playersPoints = 0;
let dealersPoints = 0;
let cash = 100;
let stake = 0;

// FUNCTIONS    
function enableDarkMode() {
    let body = document.querySelector("body");
    let gridItem = document.querySelectorAll(".GridItem");
    for(let i = 0; i < gridItem.length; i++)
        gridItem[i].style.backgroundColor = "#292F33dd"; 
    body.style.backgroundColor = "gray";
    body.style.color = "#fff4c4";
}
function disableDarkMode() {
    let body = document.querySelector("body");
    let gridItem = document.querySelectorAll(".GridItem");
    for(let i = 0; i < gridItem.length; i++)
        gridItem[i].style.backgroundColor = "#d3d3d3"; 
    body.style.backgroundColor = "white";
    body.style.color = "black";
}
function isBlackjack(arrayName) {
    if(arrayName[1] != undefined) {
        if((arrayName[0][0] == "A" && arrayName[1][0] == "J") || (arrayName[0][0] == "J" && arrayName[1][0] == "A")) {
            hideCard(0, dCards);
            hideCard(1, dCards);
            showCard(0, dCards);
            showCard(1, dCards);
            hideButtons();
            endMenu(); 
            return true;
        }
        else
            return false;
    }
    else
        return false;
}
function reset() {
    deck = [];
    pCards = [];
    dCards = [];
    dealedCards = 0;
    playersPoints = 0;
    dealersPoints = 0;
    stake = 0;
    showMoney();
    document.querySelector("#tableDealersCards").innerHTML = "";
    document.querySelector("#tablePlayersCards").innerHTML = "";
    document.querySelector("#playersPoints").innerHTML = 0;
    document.querySelector("#dealersPoints").innerHTML = 0;
    document.querySelector("#stakeLabel").textContent = 1;
    document.querySelector("#stakeSlider").value = 1;
    document.querySelector("#winner").innerHTML = "BlackjackJS";
    showCard(0, dCards, false, true);
    showCard(1, dCards, false, true);
    showCard(0, pCards, false, true);
    showCard(0, pCards, false, true);
    const buttons = document.querySelector("#playAgainBox");
    buttons.style.display = "none";
    raiseFunction();
}
function endMenu() {
    hideButtons();
    if(cash <= 0) {
        alert("You lost!");
        document.querySelector("#playAgain").disabled = true;
    }
    let menu = document.querySelector("#playAgainBox");
    menu.style.display = "flex";
    document.querySelector("#exit").addEventListener("click", function(){window.location = "http://www.google.com";});
    document.querySelector("#playAgain").addEventListener("click", reset);
}
function showMoney() {
    document.querySelector("#playersCash").textContent = cash;
    document.querySelector("#stake").innerHTML = stake;
}
function createDeck() {
    const colors = ['S', 'C', 'D', 'H'];
    const figures =['J', 'Q', 'K', 'A'];
    for(let i = 2; i <= 10; i++) {
        for(let j = 0; j <= 3; j++)
            deck.push(i + colors[j]);
    }
    for(let i = 0; i <= 3; i++) {
        for(let j = 0; j <= 3; j++)
            deck.push(figures[i] + colors[j]);
    }
}
function dealCard(arrayName) {
    let randomCard = Math.floor(Math.random() * (51-dealedCards));
    arrayName.push(deck[randomCard]);
    deck.splice(randomCard, 1);
    dealedCards++;
}
function showCard(indexOfCard, arrayName, isDealersFirstCard = false, placeholder = false) {
    let idOfTable;
    let source = "playing_cards/" + arrayName[indexOfCard] + ".png";
    let card = document.createElement("img");
    if(isDealersFirstCard == true)
        source = "playing_cards/back1.png";
    if(placeholder == true)
        source = "playing_cards/placeholder.png";
    card.setAttribute("src", source);
    card.setAttribute("id" ,indexOfCard);
    if(arrayName == dCards)
        idOfTable = "#tableDealersCards";    
    else
        idOfTable = "#tablePlayersCards";
    document.querySelector(idOfTable).appendChild(card);
}
function hideCard(indexOfCard, arrayName) {
    let idOfTable;
    if(arrayName == dCards)
        idOfTable = "#tableDealersCards";
    if(arrayName == pCards)
        idOfTable = "#tablePlayersCards";
    let container = document.querySelector(idOfTable);
    const idOfCard = document.getElementById(indexOfCard);
    container.removeChild(idOfCard);
}
function countCardPoints(arrayName) {
    let card = arrayName[arrayName.length-1];
    for(let i = 2; i <= 10; i++) {
        if(card[0] == i)
            return i; 
    }    
    if(card[0] == "A")
        return 0;
    else
        return 10;
}
function hitFunction() {
    if(playersPoints > 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player lose!";
        showMoney();
        endMenu();
    }
    else {
        dealCard(pCards);
        showCard(pCards.length-1, pCards);
        isAce(pCards);
        if(isAce(pCards) == false)
            playersPoints += countCardPoints(pCards);
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        if(playersPoints > 21) {
            document.querySelector("#winner").innerHTML = "Player lose!";
            document.querySelector("#dealersPoints").innerHTML = dealersPoints;
            hideCard(0, dCards);
            hideCard(1, dCards);
            showCard(0, dCards);
            showCard(1, dCards);
            showMoney();
            endMenu();
        }
        if(playersPoints == 21) {
            document.querySelector("#winner").innerHTML = "Player wins!";
            document.querySelector("#dealersPoints").innerHTML = dealersPoints;
            hideCard(0, dCards);
            hideCard(1, dCards);
            showCard(0, dCards);
            showCard(1, dCards);
            cash += stake*2;
            showMoney();
            endMenu();
        }
    }
}
function standFunction() {
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    document.querySelector("#dealersPoints").innerHTML = dealersPoints;
    hideCard(0, dCards);
    hideCard(1, dCards);
    showCard(0, dCards);
    showCard(1, dCards);
    while(dealersPoints < 17) {
        dealCard(dCards);
        showCard(dCards.length-1, dCards);
        isAce(dCards);
        dealersPoints += countCardPoints(dCards);
        document.querySelector("#dealersPoints").innerHTML = dealersPoints;
    }
    if(dealersPoints > 21 || dealersPoints < playersPoints) {
        document.querySelector("#winner").innerHTML = "Player wins!";
        cash += stake*2;
    } 
    if(dealersPoints <= 21 && dealersPoints >= playersPoints) {
        if(isBlackjack(dCards)) {
            dealersPoints = 21;
            document.querySelector("#winner").innerHTML = "Dealer has blackjack!";  
        }
        else
            document.querySelector("#winner").innerHTML = "Dealer wins!";   
    }
    if(dealersPoints == playersPoints) {
        document.querySelector("#winner").innerHTML = "Draw!";
        cash += stake*1;
    }
    showMoney();
    endMenu();
}
function raiseFunction() {
    hideButtons();
    const sliderElements = document.querySelector("#slider");
    sliderElements.style.display = "flex";
    let slider = document.querySelector("#stakeSlider");
    slider.setAttribute("max", cash);
    document.querySelector("#accept").addEventListener("click", setStakeAmount);
    document.querySelector("#accept").addEventListener("click", main);
}
function setStakeAmount() {
    stake = document.querySelector("#stakeSlider").value;
    cash -= stake;
    showMoney();
    const sliderElements = document.querySelector("#slider");
    sliderElements.style.display = "none";
    showButtons();
    hideCard(0, dCards);
    hideCard(1, dCards);
    hideCard(0, pCards);
    hideCard(0, pCards);
}
function showLiveStake() {
    document.querySelector("#stakeSlider").max = cash;
    let value = document.querySelector("#stakeSlider").value;
    document.querySelector("#stakeLabel").textContent = value;
}
function disableButtons() {
    const buttons = document.querySelectorAll("button");
    for(let i = 0; i < buttons.length; i++)
        buttons[i].disabled = true;
}
function enableAceButtons() {
    const aceButtons = document.querySelector("#aceButtons");
    aceButtons.style.display = "flex";
}
function hideAceButtons() {
    const aceButtons = document.querySelector("#aceButtons");
    aceButtons.style.display = "none";
}
function hideButtons() {
    const buttons = document.querySelector("#mainButtons");
    buttons.style.display = "none";
}
function showButtons() {
    const buttons = document.querySelector("#mainButtons");
    buttons.style.display = "flex";
}
function oneAce() {
    playersPoints += 1;
    hideAceButtons();
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    showButtons();
    if(playersPoints == 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player wins!";
        cash += stake*2;
        showMoney();
        endMenu();
    }
    if(playersPoints > 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player lose!";
        stake = 0;
        showMoney();
        endMenu();
    }
}
function elevenAce() {
    playersPoints += 11;
    hideAceButtons();
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    showButtons();
    if(playersPoints == 21){
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player wins!";
        cash += stake*2;
        showMoney();
        endMenu();
    }
    if(playersPoints > 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player lose!";
        stake = 0;
        showMoney();
        endMenu();
    }
}
function twoAce() {
    playersPoints += 2;
    hideAceButtons();
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    showButtons();
    if(playersPoints == 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player wins!";
        cash += stake*2;
        showMoney();
        endMenu();
    }
    if(playersPoints > 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player lose!";
        showMoney();
        endMenu();
    }
}
function twelveAce() {
    playersPoints += 12;
    hideAceButtons();
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    showButtons();
    if(playersPoints == 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player wins!";
        cash += stake*2;
        showMoney();
        endMenu();
    }
    if(playersPoints > 21) {
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        document.querySelector("#winner").innerHTML = "Player lose!";
        showMoney();
        endMenu();
    }
}
function isAce(arrayName, indexOfCard = arrayName.length-1) {
    const card = arrayName[indexOfCard];
        if(card[0] == "A" && isBlackjack(arrayName) == false) {
            if(arrayName == dCards) {
                if(dealersPoints <= 10)
                    dealersPoints += 11;
                else
                    dealersPoints += 1;
            }
            else {
                hideButtons();
                enableAceButtons();
                document.querySelector("#one").textContent = "1";
                document.querySelector("#eleven").textContent = "11";
                document.querySelector("#one").addEventListener("click", oneAce);
                document.querySelector("#eleven").addEventListener("click", elevenAce);
                if (playersPoints >= 10)
                    document.querySelector("#eleven").disabled = true;
                return true;
            }
        }
        else
            return false;
}
function main() {
    showMoney();
    document.querySelector("#raiseButton").disabled = true;
    document.querySelector("#hitButton").addEventListener("click", hitFunction);
    document.querySelector("#standButton").addEventListener("click", standFunction);
    document.querySelector("#raiseButton").addEventListener("click", raiseFunction);
    console.log("Creating a deck...");
    createDeck();
    console.log(deck);
    console.log("Dealing a first card to dealer...");
    dealCard(dCards);
    isAce(dCards);
    showCard(0, dCards, true);
    dealersPoints += countCardPoints(dCards);
    console.log(dCards);
    console.log("Dealing a first card to player...");
    dealCard(pCards);
    showCard(0, pCards);
    playersPoints += countCardPoints(pCards);
    console.log(pCards);
    console.log("Dealing a second card to dealer...");
    dealCard(dCards);
    isAce(dCards);
    showCard(1, dCards);
    dealersPoints += countCardPoints(dCards);
    console.log(dCards);
    console.log("Dealing a second card to player...");
    dealCard(pCards);
    playersPoints += countCardPoints(pCards);
    isBlackjack(pCards);
    if(!isBlackjack(pCards)) {
        console.log(isBlackjack(pCards));
        isAce(pCards, 0);
    }
    if(isBlackjack(pCards)) {
        playersPoints = 21;
        if(isBlackjack(dCards)) {
            console.log(isBlackjack(dCards))
            dealersPoints = 21;
            document.querySelector("#winner").innerHTML = "Draw!";
            cash += stake*1;
            stake = 0;
        }
        else {
            cash += stake*2;
        }
        document.querySelector("#playersPoints").innerHTML = playersPoints;
        console.log(isBlackjack(pCards));
    }
    if(pCards[0][0] == "A" && pCards[1][0] == "A") {
        hideButtons();
        enableAceButtons();
        document.querySelector("#one").textContent = "2";
        document.querySelector("#eleven").textContent = "12";
        document.querySelector("#one").addEventListener("click", twoAce);
        document.querySelector("#eleven").addEventListener("click", twelveAce);
    }
    else {
        isAce(pCards, 1);
    }
    showMoney();
    showCard(1, pCards);
    document.querySelector("#playersPoints").innerHTML = playersPoints;
    console.log(pCards);
    console.log(deck);
    console.log(pCards);
}
document.querySelector("#darkModeButton").addEventListener("click", enableDarkMode);
document.querySelector("#darkModeButton").addEventListener("dblclick", disableDarkMode);

showMoney();
showCard(0, dCards, false, true);
showCard(1, dCards, false, true);
showCard(0, pCards, false, true);
showCard(0, pCards, false, true);
raiseFunction();