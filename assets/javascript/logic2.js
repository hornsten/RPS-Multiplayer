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
var playersDb = database.ref().child('players');
var player1Db = database.ref().child('players').child('1');
var player2Db = database.ref().child('players').child('2');
var wins2 = 0;
var losses2 = 0;
var wins1 = 0;
var losses1 = 0;
var gameStarted = false;
var gameClosed = false;

$('#join-game').hide();
$('#joiner').hide();

$('#start').on('click', signIn);

function signIn() {

    firebase.auth().signInAnonymously();

    var uid = firebase.auth().currentUser.uid;

    player1 = $('#username').val().trim();

    player1Db.set({

        player1: player1,
        wins1: wins1,
        losses1: losses1,
        uid: uid,
        gameStarted: true,
        choice: null
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
        gameClosed: true,
        choice: null
    });


    $('#join-game').hide();
    $('#joiner').hide();
    $('#status').html('<h4>Hi, ' + player2 + '! You are Player 2</h4>');
    turn2();

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

    turn1();

    // Handle the errors

}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    player2Db.remove();
    console.log("Player 2 has left the game");

});


$('#chat').on('click', holla);

function holla() {

    var message = $('#message').val().trim();
    database.ref().child('chat').push({

        message: message

    });

};

database.ref().child('chat').on('child_added', function(snap) {

    $('#chat-log').append('<p>' + snap.val().message + '</p>');
    $('#message').val("");

})

//RPS game

function turn1() {
    $('#status').html('<h4>It is ' + player1 + '\'s turn</h4>');
    $('#player-1').append('<button class="choice btn btn-primary" data-choice="rock">Rock</button>')
        .append('<button class="choice btn btn-primary" data-choice="paper">Paper</button>')
        .append('<button class="choice btn btn-primary" data-choice="scissors">Scissors</button')
        .addClass('turn');

    $('.choice').on('click', function() {

        player1Choice = $(this).attr('data-choice');
        $('.choice').hide();
        $('#player-1').removeClass('turn');

        player1Db.child('choice').set({

            player1Choice: player1Choice
        });

    });

}

function turn2() {

    $('#status').html('<h4>It is player 2\'s turn</h4>');
    $('#player-2').append('<button class="choice btn btn-primary" data-choice="rock">Rock</button>')
        .append('<button class="choice btn btn-primary" data-choice="paper">Paper</button>')
        .append('<button class="choice btn btn-primary" data-choice="scissors">Scissors</button')
        .addClass('turn');

    $('.choice').on('click', function() {

        player2Choice = $(this).attr('data-choice');
        $('.choice').hide();
        $('#player-2').removeClass('turn');

        player2Db.child('choice').set({

            player2Choice: player2Choice

        });
        gamePlay();
    });
}



function gamePlay() {

    player1Choice = player1Db.child('choice');
    player2Choice = player2Db.child('choice');
    console.log(player1Choice, player2Choice);
    if (player1Choice === player2Choice) {
        $('#game-results').html('<h4 id="results">The result is a tie!</h4>');
    } else if (player1Choice === "paper") {
        if (player2Choice === "scissors") {
            $('#game-results').html('<h4 id="results">Scissors wins!</h4>');
        } else if (player2Choice === "rock") {
            $('#game-results').html('<h4 id="results">Paper wins!</h4>');
        }
    } else if (player1Choice === "rock") {
        if (player2Choice === "paper") {
            $('#game-results').html('<h4 id="results">Paper wins!</h4>');
        } else if (player2Choice === "scissors") {
            $('#game-results').html('<h4 id="results">Rock wins!</h4>');
        }
    } else if (player1Choice === "scissors") {
        if (player2Choice === "paper") {
            $('#game-results').html('<h4 id="results">Scissors wins!</h4>');
        } else if (player2Choice === "rock") {
            $('#game-results').html('<h4 id="results">Rock wins!</h4>');
        }

    }
};
