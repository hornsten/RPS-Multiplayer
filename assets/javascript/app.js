// Initialize Firebase
var config = {
    apiKey: "AIzaSyAiyfeyEhB4MLl2fbv8zTetpFFajConQ5M",
    authDomain: "rps-multiplayer-bfae3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bfae3.firebaseio.com",
    storageBucket: "rps-multiplayer-bfae3.appspot.com",
    messagingSenderId: "401412695592"
};

firebase.initializeApp(config);

var database = firebase.database();
var players = database.ref('players');
var playerCount = database.ref('playerCount');
var gameResultsRef = database.ref('gameResults');

var player = {

    name: "",
    choice: "",
    wins: 0,
    losses: 0,
    uid: ""
};

var currentPlayer = null;
var otherPlayer = null;
var numPlayers = null;
var otherName = "";

var gameResults = "";


$(document).ready(function() {


    gameResultsRef.set({
        gameResults: gameResults
    })


    //Check player count value in db. Trigger startGame function once value equal to 2
    playerCount.on("value", function(snapshot) {
        numPlayers = snapshot.val();
        if (numPlayers === 2) {
            startGame();
        }
    });

    $('#start').on('click', addPlayers);

    //Chat feature
    var chatRef = database.ref().child('chat');
    var messageField = $('#message');
    var chatLog = $('#chat-log');
    var nameField = $('#username');
    var addPlayerButton = $('#start');

    function addPlayers() {
        firebase.auth().signInAnonymously();
        var playerName = $('#username').val().trim();
        player.name = playerName;
        player.uid = firebase.auth().currentUser.uid;

        database.ref().once('value').then(function(snapshot) {

            if (!snapshot.child('players/1').exists()) {
                database.ref('players/1/').update(player);
                var currentPlayerBox = $('#player-1');
                var otherPlayerBox = $('#player-2');
                currentPlayerBox.html('<h2>' + playerName)
                    .append('<h5>Wins: ' + player.wins)
                    .append('<h5>Losses: ' + player.losses);
                currentPlayer = 1;
                otherPlayer = 2;
                nameField.hide();
                addPlayerButton.hide();
                $('#status').html('<h4>Hi, ' + player.name + '! You are Player ' + currentPlayer + '</h4>');

                //Snapshot of database for player count
                playerCount.once('value').then(function(snapshot) {
                    numPlayers = snapshot.val();
                    if (numPlayers === null) {
                        numPlayers = 1;
                        playerCount.set(numPlayers);
                    } else {
                        numPlayers++;
                        playerCount.set(numPlayers);
                    }
                });
            } else if (!snapshot.child('players/2').exists()) {

                database.ref('players/2/').update(player);
                var currentPlayerBox = $('#player-2');
                var otherPlayerBox = $('#player-1');
                currentPlayerBox.html('<h2>' + playerName)
                    .append('<h5>Wins: ' + player.wins)
                    .append('<h5>Losses: ' + player.losses);
                currentPlayer = 2;
                otherPlayer = 1;

                nameField.hide();
                addPlayerButton.hide();
                $('#status').html('<h4>Hi, ' + player.name + '! You are Player ' + currentPlayer);

                //Snapshot of database for player count after Player 2 is added

                playerCount.once('value').then(function(snapshot) {
                    numPlayers = snapshot.val();
                    if (numPlayers === null) {
                        numPlayers = 1;
                        playerCount.set(numPlayers);
                    } else {
                        numPlayers++;
                        playerCount.set(numPlayers);
                    }
                });

            } else {

                alert('Sorry, this game is full.  Try again later.');
                return;
            }

        });
    }


    function startGame() {

        gameResultsRef.on('value', function(snapshot) {

            $('#game-results').html('<h2>' + snapshot.val().gameResults);
        })
        $('.choice-1').hide();
        $('.choice-2').hide();
        var otherGuy = database.ref('players/' + otherPlayer + '/');
        var currentGuy = database.ref('players/' + currentPlayer + '/');

        currentGuy.on('value', function(snapshot) {
            console.log('currentplayer is : ' + currentPlayer);
            var data = snapshot.val();
            var currentGuyName = data.name;
            var currentGuyWins = data.wins;
            var currentGuyLosses = data.losses;
            $('#game-results').html('<h4 id="results"></h4>');
            if (currentPlayer === 1) {
                $('#player-1').html('<h2>' + currentGuyName)
                    .append('<h5>Wins: ' + currentGuyWins)
                    .append('<h5>Losses: ' + currentGuyLosses);
            } else {
                $('#player-2').html('<h2>' + currentGuyName)
                    .append('<h5>Wins: ' + currentGuyWins)
                    .append('<h5>Losses: ' + currentGuyLosses);
            }
        })




        otherGuy.on('value', function(snapshot) {
            var data = snapshot.val();
            var otherGuyName = data.name;
            var otherGuyWins = data.wins;
            var otherGuyLosses = data.losses;
            $('#game-results').html('<h4 id="results"></h4>');
            if (currentPlayer === 1) {
                $('#player-2').html('<h2>' + otherGuyName)
                    .append('<h5>Wins: ' + otherGuyWins)
                    .append('<h5>Losses: ' + otherGuyLosses);
            } else {
                $('#player-1').html('<h2>' + otherGuyName)
                    .append('<h5>Wins: ' + otherGuyWins)
                    .append('<h5>Losses: ' + otherGuyLosses);
            }
        });

        if (currentGuy.onDisconnect().remove()) {

            playerCount.set(numPlayers - 1);
            choice = null;

        }

        database.ref('players').on('child_removed', taunt);

        database.ref('players').on('child_changed', sarcasm);

        function taunt() {
            chatLog.html('Chat Bot: You have been abandoned. How sad.');
        }

        function sarcasm() {
            chatLog.html('Chat Bot: Look, a friend wants to play with you.  And this time it\'s not even your mom.');
        }
        database.ref('turn').set(1);

        database.ref('turn').on('value', function(snapshot) {

            var turn = snapshot.val();

            if (turn === currentPlayer) {

                $('#box-' + currentPlayer).addClass('turn');
                $('#box-' + otherPlayer).removeClass('turn');
                $('.choice-' + currentPlayer).show();
                $('#status').html('It is ' + player.name + '\'s turn');

            } else {
                $('#box-' + currentPlayer).removeClass('turn');
                $('#box-' + otherPlayer).addClass('turn');
                $('.choice-' + currentPlayer).hide();

                var otherName = database.ref('players/' + otherPlayer + '/name');
                otherName.once('value', function(snapshot) {
                    otherName = snapshot.val();
                    //Indicate that it is the opponent's turn
                    $('#status').html('It is ' + otherName + '\'s turn');
                });

            }
        })
    };

    function resetChoice() {

        var choice = "";
        var dbChoice = database.ref('players/' + currentPlayer + '/choice');
        var otherDbChoice = database.ref('players/' + otherPlayer + '/choice');
        dbChoice.set(choice);
        otherDbChoice.set(choice);
        $('#game-results').html('<h4 id="results"></h4>');

    }



    function makeChoices() {

        var choice = $(this).attr('data-choice');

        var dbChoice = database.ref('players/' + currentPlayer + '/choice');
        dbChoice.set(choice);
        console.log(choice);

        database.ref('players/' + otherPlayer + '/choice').on('value', function(snapshot) {
            compareChoices();
        });

        //Hide the buttons

        $('.choice-1').hide();
        $('.choice-2').hide();

        var dbturn = database.ref('turn');
        dbturn.once('value', function(snapshot) {
            var currentTurn = snapshot.val();

            if (currentTurn === 1) {
                database.ref('turn').set(2);
            } else {
                database.ref('turn').set(1);
            }
        });
    }

    $('.choice-1').on('click', makeChoices);
    $('.choice-2').on('click', makeChoices);

    function compareChoices() {

        database.ref().once("value", function(snapshot) {

            var playerName = snapshot.child('players/' + currentPlayer + '/name').val();
            var playerChoice = snapshot.child('players/' + currentPlayer + '/choice').val();
            var playerWins = snapshot.child('players/' + currentPlayer + '/wins').val();
            var playerLosses = snapshot.child('players/' + currentPlayer + '/losses').val();
            var otherName = snapshot.child('players/' + otherPlayer + '/name').val();
            var otherPlayerChoice = snapshot.child('players/' + otherPlayer + '/choice').val();
            var otherPlayerWins = snapshot.child('players/' + otherPlayer + '/wins').val();
            var otherPlayerLosses = snapshot.child('players/' + otherPlayer + '/losses').val();

            var gameResults = snapshot.child


            if (playerChoice === "paper") {
                if (otherPlayerChoice === "scissors") {
                    otherPlayerWins++;
                    playerLosses++;
                    database.ref('players/' + currentPlayer + '/losses').set(playerLosses);
                    database.ref('players/' + otherPlayer + '/wins').set(otherPlayerWins);
                    gameResults = otherName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });
                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "rock") {
                    playerWins++;
                    otherPlayerLosses++;
                    database.ref('players/' + currentPlayer + '/wins').set(playerWins);
                    database.ref('players/' + otherPlayer + '/losses').set(otherPlayerLosses);
                    gameResults = playerName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });
                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "paper") {
                    gameResults = 'It\'s a tie!';
                    gameResultsRef.update({ gameResults: gameResults });
                    setTimeout(resetChoice, 2500);
                }


            } else if (playerChoice === "rock") {
                if (otherPlayerChoice === "paper") {
                    otherPlayerWins++;
                    playerLosses++;
                    database.ref('players/' + currentPlayer + '/losses').set(playerLosses);
                    database.ref('players/' + otherPlayer + '/wins').set(otherPlayerWins);
                    gameResults = otherName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });

                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "scissors") {
                    playerWins++;
                    otherPlayerLosses++;
                    database.ref('players/' + currentPlayer + '/wins').set(playerWins);
                    database.ref('players/' + otherPlayer + '/losses').set(otherPlayerLosses);
                    gameResults = playerName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });

                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "rock") {
                    gameResults = 'It\'s a tie!';
                    gameResultsRef.update({ gameResults: gameResults });

                    setTimeout(resetChoice, 2000);
                }
            } else if (playerChoice === "scissors") {
                if (otherPlayerChoice === "rock") {
                    otherPlayerWins++;
                    playerLosses++;
                    database.ref('players/' + currentPlayer + '/losses').set(playerLosses);
                    database.ref('players/' + otherPlayer + '/wins').set(otherPlayerWins);
                    gameResults = otherName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });

                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "paper") {
                    playerWins++;
                    otherPlayerLosses++;
                    database.ref('players/' + currentPlayer + '/wins').set(playerWins);
                    database.ref('players/' + otherPlayer + '/losses').set(otherPlayerLosses);
                    gameResults = playerName + ' wins!';
                    gameResultsRef.update({ gameResults: gameResults });

                    setTimeout(resetChoice, 2500);
                } else if (otherPlayerChoice === "scissors") {
                    gameResults = 'It\'s a tie!';
                    gameResultsRef.update({ gameResults: gameResults });
                    setTimeout(resetChoice, 2000);

                }
            }

        });
    }


    //Chat feature
    $('#chat').on('click', function() {

        var message = {

            name: nameField.val(),
            message: messageField.val()
        };

        chatRef.push(message);
        messageField.val('');

    });

    chatRef.limitToLast(5).on('child_added', function(snapshot) {

        var data = snapshot.val();
        var name = data.name || 'nameless rando';
        var message = data.message;

        var messageElement = $('<li>');
        var nameElement = $('<span></span>');
        nameElement.html(name + ": ");
        messageElement.html(message).prepend(nameElement);

        chatLog.append(messageElement);
    });
    //End Chat Feature

});
