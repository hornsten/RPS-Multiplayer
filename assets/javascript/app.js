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
var playerCount = database.ref('playerCount');

var player = {

    name: "",
    choice: "",
    wins: 0,
    losses: 0
};

var currentPlayer = null;
var otherPlayer = null;
var numPlayers = null;
var otherName = "";
var choicesSelected = 0;

$(document).ready(function() {


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

        var playerName = $('#username').val().trim();
        player.name = playerName;

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

            var amConnected = database.ref(".info/connected");
            var userRef = database.ref('presence/' + currentPlayer);
            amConnected.on('value', function(snapshot) {
                if (snapshot.val()) {
                    userRef.onDisconnect().remove();
                    userRef.set(true);
                }
            });

        });
    }

    function startGame() {
        $('.choice-1').hide();
        $('.choice-2').hide();
        var otherGuy = database.ref('players/' + otherPlayer + '/');

        otherGuy.on('value', function(snapshot) {
            var data = snapshot.val();
            var otherGuyName = data.name;
            var otherGuyWins = data.wins;
            var otherGuyLosses = data.losses;
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

        database.ref('choice_selections').set(choicesSelected);
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
        dbChoice.set(choice);

    }



    function makeChoices() {

        var choice = $(this).attr('data-choice');
        console.log(choice);
        var dbChoice = database.ref('players/' + currentPlayer + '/choice');
        dbChoice.set(choice);

        database.ref('players/' + otherPlayer + '/choice').on('value', function(snapshot) {
            // compareChoices();
        });

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
