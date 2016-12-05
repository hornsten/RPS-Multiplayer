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
var player1Choice = "";
var player2Choice = "";

$('#join-game').hide();
$('#joiner').hide();

$('#start').on('click', signIn);

var gameResults = "";

playersDb.set({
    gameResults: gameResults
})

playersDb.on('value', function(snapshot) {

    $('#game-results').html('<h2>' + snapshot.val().gameResults);
})

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
    player2Choice = snapshot2.val().choice;
    console.log(player2Choice);

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
    });

}

function turn2() {

    $('#status').html('<h4>It is player 2\'s turn</h4>');
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
    alert('game on');
    // player1Choice = player1Db.child('choice').player1Choice;
    // player2Choice = player2Db.child('choice').player2Choice;
    console.log('gameplay choices: ' + player1Choice, player2Choice);

    if (player1Choice === player2Choice) {
        gameResults = 'The result is a tie!';
        playersDb.update({ gameResults: gameResults });
        turn1();

    } else if (player1Choice === "paper") {
        if (player2Choice === "scissors") {
            $('#game-results').html('<h4 id="results">Scissors wins!</h4>');
            playersDb.update({ gameResults: gameResults });
            player2Db.wins2 += player2Db.wins2;
            player2Db.update({ wins2: wins2 });
            turn1();

        } else if (player2Choice === "rock") {
            gameResults = 'Paper wins!';
            playersDb.update({ gameResults: gameResults });
            turn1();
        }
    } else if (player1Choice === "rock") {
        if (player2Choice === "paper") {
            gameResults = 'Paper wins!';
            playersDb.update({ gameResults: gameResults });
            turn1();

        } else if (player2Choice === "scissors") {
            gameResults = 'Rock wins!</h4>';
            playersDb.update({ gameResults: gameResults });
            turn1();
        }
    } else if (player1Choice === "scissors") {
        if (player2Choice === "paper") {
            gameResults = "Scissors wins!";
            playersDb.update({ gameResults: gameResults });
            turn1();
        } else if (player2Choice === "rock") {
            gameResults = 'Rock wins!</h4>';
            playersDb.update({ gameResults: gameResults });
            turn1();
        }

    }
};
