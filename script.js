var memory_array = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I',
    'J', 'J', 'K', 'K', 'L', 'L', 'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P', 'Q', 'Q', 'R', 'R', 'S', 'S', 'T', 'T', 'U', 'U', 'V', 'V'

];

const players = {
    player1: {
        name: "",
        score: 0,
        currentSuccessfulFlips: 0
    },
    player2: {
        name: "",
        score: 0,
        currentSuccessfulFlips: 0
    },
}

function getVal() {
    players.player1.name = document.querySelector("#p1").value;
    players.player2.name = document.querySelector("#p2").value;
}

var memory_values = [];
var memory_cards_ids = [];
var cards_flipped = 0;
var score = 0;
var minPointsToWin;
var arrlen;
const playingText = " is playing...";
var currentPlayer = players.player1.name;

//shuffle methode use prototype
Array.prototype.memory_card_shuffle = function (difficultLevel) {
    var i = difficultLevel,
        j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

//reset after every game the currentFlips to zero 
function resetScore() {
    Object.keys(players).forEach(player => {
        players[player].currentSuccessfulFlips = 0;
    })
}

//creating new Board
function newBoard() {
    cards_flipped = 0;
    document.getElementById("player").innerHTML = currentPlayer + playingText;
    const level = document.querySelector('#level')
    const levelGame = level.value
    const cardElemWidth = 122;
    var output = '';
    var difficultLevel = 0;
    //check the size of the board 
    if (levelGame == "Easy") difficultLevel = 4;
    else if (levelGame == "Meduim") difficultLevel = 5;
    arrlen = difficultLevel * difficultLevel;
    if (difficultLevel / 2 == 0) {
        minPointsToWin = arrlen / 4 + 1;
    } else {
        minPointsToWin = (arrlen - 1) / 4 + 1;
    }
    //shuffle the cards
    memory_array.memory_card_shuffle(arrlen);

    for (var i = 0; i < arrlen; i++) {
        output += '<div id="card_' + i + '" onclick="memoryFlipCard(this,\'' + memory_array[i] + '\')"></div>'; //adding the cards 
    }
    document.getElementById('memory_board').innerHTML = output; //adding the cards to the board
    //makinkg css adapt to card size fit well
    document.getElementById("memory_board").style.width = cardElemWidth * difficultLevel + "px";
    document.getElementById("memory_board").style.height = cardElemWidth * difficultLevel + "px";
    document.getElementById("memory_board").style.display = "block";
}

function switchPlayer() {
    if (currentPlayer == players.player1) {
        currentPlayer = players.player2;
    } else {
        currentPlayer = players.player1;
    }
    document.getElementById("player").innerHTML = currentPlayer.name + playingText;
}

//update in local storage the num of wins for each player
function checkIfPlayerExisct(playerName) {
    if (playerName in window.localStorage) {
        currentWins = JSON.parse(window.localStorage.getItem(playerName))
        return currentWins
    } else {
        return 0;
    }
}

//Demonstration of use of promise with setTimeOut function
function flip2BackPromise() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 300)
    });
}

//upate totalwins in localStorage
function updatePlayerWins() {
    var checkWins = 0
    if (players.player1.currentSuccessfulFlips > players.player2.currentSuccessfulFlips) {
        checkWins = checkIfPlayerExisct(players.player1.name)
        players.player1.score = 1 + checkWins;
        alert("the Winner is " + players.player1.name + " , The total Wins so far:" + players.player1.score)
        window.localStorage.setItem(players.player1.name, JSON.stringify(players.player1.score));
    } else if ((players.player1.currentSuccessfulFlips == players.player2.currentSuccessfulFlips)) {
        alert("it's a tie!!")
    } else {
        checkWins = checkIfPlayerExisct(players.player2.name)
        players.player2.score = 1 + checkWins;
        alert("the Winner is " + players.player2.name + " , The total Wins so far:" + players.player2.score)
        window.localStorage.setItem(players.player2.name, JSON.stringify(players.player2.score));
    }
}

function updatePlayerSuccessfulFlips() {
    currentPlayer.currentSuccessfulFlips += 1;
    const currScore = players.player1.name + ": " + players.player1.currentSuccessfulFlips + '\n' +
        players.player2.name + ": " + players.player2.currentSuccessfulFlips;
    document.getElementById('score').innerHTML = currScore;
}


function memoryFlipCard(card, val) {
    score += 1
    if (card.innerHTML == "" && memory_values.length < 2) {
        card.style.background = '#FFF';
        card.innerHTML = val;
        if (memory_values.length == 0) {
            memory_values.push(val);
            memory_cards_ids.push(card.id);
            // if there is one card that fliped 
        } else if (memory_values.length == 1) {
            memory_values.push(val);
            memory_cards_ids.push(card.id);
            //check if both cards match
            if (memory_values[0] == memory_values[1]) {
                cards_flipped += 2;
                // Clear both arrays
                memory_values = [];
                memory_cards_ids = [];
                // Check to see if the whole board is cleared
                const arrlen1 = arrlen % 2 == 0 ? arrlen : arrlen - 1;
                updatePlayerSuccessfulFlips();

                if (cards_flipped == arrlen1) {
                    updatePlayerWins();
                    resetScore();
                    alert("Board cleared... generating new board");
                    document.getElementById('score').innerHTML = "";
                    document.getElementById('memory_board').innerHTML = "";
                    newBoard();
                }
            } else {
                flip2BackPromise().then(() => {
                    var card_1 = document.getElementById(memory_cards_ids[0]);
                    var card_2 = document.getElementById(memory_cards_ids[1]);
                    card_1.style.background = 'url(tile_bg.jpg) no-repeat';
                    card_1.innerHTML = "";
                    card_2.style.background = 'url(tile_bg.jpg) no-repeat';
                    card_2.innerHTML = "";
                    // Clear both arrays
                    memory_values = [];
                    memory_cards_ids = [];
                    return false;
                })
            }
            //after every turn swipe activePlayer
            switchPlayer();
        }
    }
}