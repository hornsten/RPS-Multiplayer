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
var numChoices = 0;

$(document).ready(function() {

    //Check player count value in db. Trigger startGame function once value equal to 2
    playerCount.on("value", function(snapshot) {
        numPlayers = snapshot.val();
        if (numPlayers === 2) {
            // startGame();
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
                $('#player-1').html('<h2>' + playerName + '</h2>')
                    .append('<h5>Wins: ' + player.wins + '</h5>')
                    .append('<h5>Losses: ' + player.losses + '</h5>');
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
                $('#player-2').html('<h2>' + playerName)
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

    //Chat feature
    $('#chat').on('click', function() {

        var message = {

            name: nameField.val(),
            // player2name: player2Field.val(),
            message: messageField.val()
        };

        chatRef.push(message);
        messageField.val('');

    });

    chatRef.limitToLast(5).on('child_added', function(snapshot) {

        var data = snapshot.val();
        var name = data.name || data.player2name || 'nameless rando';
        var message = data.message;

        var messageElement = $('<li>');
        var nameElement = $('<span></span>');
        nameElement.html(name + ": ");
        messageElement.html(message).prepend(nameElement);

        chatLog.append(messageElement);
    });
    //End Chat Feature

});
