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
var chatRef = database.ref().child('chat');
var gameRef = database.ref().child('game');
var messageField = $('#message');
var chatLog = $('#chat-log');
var nameField = $('#username');
var player2Field = $('#joiner');
var gameState = "";

//Chat feature
$('#chat').on('click', function() {

    var message = {

        name: nameField.val(),
        player2name: player2Field.val(),
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

gameRef.set({
    gameState: gameState
})

gameRef.on('value', function(snapshot) {
    gameState = snapshot.val().gameState;
    console.log(gameState);
})

//End of chat feature 

var playersDb = database.ref().child('players');
var player1Db = database.ref().child('players').child('player1');
var player2Db = database.ref().child('players').child('player2');
var wins2 = 0;
var losses2 = 0;
var wins1 = 0;
var losses1 = 0;
var gameState = "";
var player1Choice = "";
var player2Choice = "";

$('#join-game').hide();
$('#joiner').hide();

$('#start').on('click', signIn);

var gameResults = '';

playersDb.set({
    gameResults: gameResults

})

playersDb.on('value', function(snapshot) {

    $('#game-results').html('<h2>' + snapshot.val().gameResults);
    $('#chat-log').append(snapshot.val().gameState);
})

function signIn() {

    firebase.auth().signInAnonymously();

    var uid = firebase.auth().currentUser.uid;

    player1 = $('#username').val().trim();

    player1Db.set({

        player1: player1,
        wins1: wins1,
        losses1: losses1,
        uid: uid

    });

    $('#status').html('<h4>Hi, ' + player1 + '! You are Player 1</h4>');

};


//Firebase watcher + initial loader HINT: .on("value")
player1Db.on("value", function(snapshot) {

    // Change the HTML to reflect
    $('#player-1').html('<h2>' + snapshot.val().player1 + '</h2>')
        .append('<h5>Wins: ' + snapshot.val().wins1 + '</h5>')
        .append('<h5>Losses: ' + snapshot.val().losses1 + '</h5>');
    $('#start').hide();
    $('#username').hide();

    $('#join-game').show();
    $('#joiner').show();
    console.log(snapshot.val());
    player1Choice = snapshot.val().choice;
    console.log(player1Choice);
    // Handle the errors
}, function(errorObject) {

    // console.log("Errors handled: " + errorObject.code);


});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {


    player1Db.remove();
    ("Player 1 has left the game");
    // $('#start').show();
    // $('#username').show();

});


$('#join-game').on('click', joinGame);

function joinGame() {
    firebase.auth().signInAnonymously();

    var uid2 = firebase.auth().currentUser.uid;

    player2 = $('#joiner').val().trim();

    player2Db.set({

        player2: player2,
        wins2: wins2,
        losses2: losses2,
        uid2: uid2,


    });


    $('#join-game').hide();
    $('#joiner').hide();
    $('#status').html('<h4>Hi, ' + player2 + '! You are Player 2</h4>');


};


//Firebase watcher + initial loader HINT: .on("value")
player2Db.on("value", function(snapshot2) {

    //Log everything that's coming out of snapshot

    // Change the HTML to reflect
    $('#player-2').html('<h2>' + snapshot2.val().player2 + '</h2>')
        .append('<h5>Wins: ' + snapshot2.val().wins2 + '</h5>')
        .append('<h5>Losses: ' + snapshot2.val().losses2 + '</h5>');

    $('#join-game').hide();
    $('#joiner').hide();

    $('#status').html('<h4>It is ' + player1 + '\'s turn</h4>');
    player2Choice = snapshot2.val().choice;
    console.log(player2Choice);

    // Handle the errors

}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});

player2Db.on("value", function(snapshot) {
    turn1();

})

gameRef.on("value", function(snapshot) {

    turn2();
});



//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    player2Db.remove();
    console.log("Player 2 has left the game");

});



//RPS game

function turn1() {

    $('#status').html('<h4>It is ' + player1 + '\'s turn</h4>');
    $('#player-1').append('<button class="choice btn btn-primary" data-choice="rock">rock</button>')
        .append('<button class="choice btn btn-primary" data-choice="paper">paper</button>')
        .append('<button class="choice btn btn-primary" data-choice="scissors">scissors</button')
        .addClass('turn');

    $('.choice').on('click', function() {

        player1Choice = $(this).attr('data-choice');
        $('.choice').hide();
        $('#player-1').removeClass('turn');
        choice = player1Choice;
        player1Db.update({ choice: player1Choice });
        gameState = "turn 2";
        gameRef.update({ gameState: gameState });
    });

};

function turn2() {

    $('#status').html('<h4>It is ' + player2 + '\'s turn</h4>');
    $('#player-2').append('<button class="choice btn btn-primary" data-choice="rock">rock</button>')
        .append('<button class="choice btn btn-primary" data-choice="paper">paper</button>')
        .append('<button class="choice btn btn-primary" data-choice="scissors">scissors</button')
        .addClass('turn');

    $('.choice').on('click', function() {

        player2Choice = $(this).attr('data-choice');
        $('.choice').hide();
        $('#player-2').removeClass('turn');
        // choice=player2Choice;
        player2Db.update({ choice: player2Choice });
        gamePlay();
    });

}


function gamePlay() {

    if (player1Choice === player2Choice) {
        gameResults = 'The result is a tie!';
        playersDb.update({ gameResults: gameResults });


    } else if (player1Choice === "paper") {
        if (player2Choice === "scissors") {
            $('#game-results').html('<h4 id="results">Scissors wins!</h4>');
            playersDb.update({ gameResults: gameResults });
            wins2 = wins2 + 1;
            losses1 = losses1 + 1;
            player2Db.update({ wins2: wins2 });
            player1Db.update({ losses1: losses1 });


        } else if (player2Choice === "rock") {
            gameResults = 'Paper wins!';
            playersDb.update({ gameResults: gameResults });
            wins1 = wins1 + 1;
            losses2 = losses2 + 1;
            player1Db.update({ wins1: wins1 });
            player2Db.update({ losses2: losses2 });
        }
    } else if (player1Choice === "rock") {
        if (player2Choice === "paper") {
            gameResults = 'Paper wins!';
            playersDb.update({ gameResults: gameResults });
            wins2 = wins2 + 1;
            losses1 = losses1 + 1;
            player2Db.update({ wins2: wins2 });
            player1Db.update({ losses1: losses1 });


        } else if (player2Choice === "scissors") {
            gameResults = 'Rock wins!</h4>';
            playersDb.update({ gameResults: gameResults });
            wins1 = wins1 + 1;
            losses2 = losses2 + 1;
            player1Db.update({ wins1: wins1 });
            player2Db.update({ losses2: losses2 });
        }
    } else if (player1Choice === "scissors") {
        if (player2Choice === "paper") {
            gameResults = "Scissors wins!";
            playersDb.update({ gameResults: gameResults });
            wins1 = wins1 + 1;
            losses2 = losses2 + 1;
            player1Db.update({ wins1: wins1 });
            player2Db.update({ losses2: losses2 });

        } else if (player2Choice === "rock") {
            gameResults = 'Rock wins!</h4>';
            playersDb.update({ gameResults: gameResults });
            wins2 = wins2 + 1;
            losses1 = losses1 + 1;
            player2Db.update({ wins2: wins2 });
            player1Db.update({ losses1: losses1 });

        }


    }

};
