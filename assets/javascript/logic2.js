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
        gameStarted: true
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


    // player1Db.remove();
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
        gameClosed: true
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

    turn1();

    // Handle the errors

}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    // player2Db.remove();
    console.log("Player 2 has left the game");

});

$('#chat').on('click', holla);

function holla() {

    var message = $('#message').val().trim();
    database.child('chat').push({

        message: message

    });

};

database.child('chat').on('child_added', function(snap) {

    $('#chat-log').append('<p>' + snap.val().message + '</p>');
    $('#message').val("");

})

//RPS game

var player1Choice;
var player2Choice;

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

        player1Db.child('choice').push({

            player1Choice: player1Choice
        });
        turn2();
    });


}


function turn2() {

    $('#player-2').append('<button class="choice btn btn-primary" data-choice="rock">Rock</button>')
        .append('<button class="choice btn btn-primary" data-choice="paper">Paper</button>')
        .append('<button class="choice btn btn-primary" data-choice="scissors">Scissors</button')
        .addClass('turn');

    $('.choice').on('click', function() {

        player2Choice = $(this).attr('data-choice');
        $('.choice').hide();
        $('#player-2').removeClass('turn');

        player2Db.child('choice').push({

            player2Choice: player2Choice

        });

    });
}



function gamePlay(player1Choice, player2Choice) {

    if (player1Choice === player2Choice) {
        return "The result is a tie!";
    };

    switch (player1Choice) {
        case "Rock":
            return (player1Choice === "Paper" ? "Rock" : "Scissors") + " wins!";
            break;
        case "Paper":
            return (player1Choice === "Rock" ? "Paper" : "Scissors") + " wins!";
            break;
        case "Scissors":
            return (player1Choice === "Paper" ? "Scissors" : "Rock") + " wins!";
            break;
    };

};

gamePlay(player1Choice, player2Choice);
