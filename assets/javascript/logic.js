// Initialize Firebase
var config = {
    apiKey: "AIzaSyAiyfeyEhB4MLl2fbv8zTetpFFajConQ5M",
    authDomain: "rps-multiplayer-bfae3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-bfae3.firebaseio.com",
    storageBucket: "rps-multiplayer-bfae3.appspot.com",
    messagingSenderId: "401412695592"
};
firebase.initializeApp(config);

var database = firebase.database().ref();

var username1 = "";
var username2 = "";
var dateAdded = "";
var numPlayers = 0;
var players;
var wins = 0;
var losses = 0;
var results;
var chat;

//Sign-in and Authorization

$('#start').on('click', function() {

    if (numPlayers > 1) {

        alert('Too many players.  Try again later');

        $('#username').val("");

    } else if (numPlayers === 0) {
        firebase.auth().signInAnonymously();

        username1 = $('#username').val().trim();

        $('#username').val("");

        database.set({

            numPlayers: 1
        })

        database.child("players").child("1").set({

            username1: username1,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            wins: wins,
            losses: losses
        });

        $('#player-1').html('<h2>' + username1 + '</h2>')
            .append('<h4>Wins: ' + wins + ' </h4>')
            .append('<h4>Losses:' + losses + ' </h4>');


    } else if (numPlayers === 1) {

        username2 = $('#username').val().trim();

        $('#username').val("");
        database.set({
            numPlayers: 2
        })
        database.child("players").child("2").set({

            username2: username2,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            wins: wins,
            losses: losses

        });

        $('#player-2').html('<h2>' + username2 + '</h2>')
            .append('<h4>Wins: ' + wins + ' </h4>')
            .append('<h4>Losses:' + losses + ' </h4>');

    }
    return false;

});

//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    console.log(firebaseUser);
});

//Firebase watcher + initial loader HINT: .on("value")
database.on("value", function(snapshot) {

    //Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().username1);
    console.log(snapshot.val().username2);
    console.log(snapshot.val().results);
    console.log(snapshot.val().chat);

    // Change the HTML to reflect
    $("#player-1").html(snapshot.val().username);
    $("#player-2").html(snapshot.val().username);
    $("#game-results").html(snapshot.val().results);
    $("#chat-log").html(snapshot.val().chat);

    // Handle the errors
}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});

// Buttons are functioning-----------------------------------

$('#chat').on('click', holla);

function holla() {
    alert('hey!');
};
//-----------------------------------------------------------

// Divs targeted---------------------------------------------
$('#player-1').html('<h2>Player 1</h2>');
$('#game-results').html('<h2>Results</h2>');
$('#player-2').html('<h2>Player 2</h2>');
$('#chat-log').append('<p>braaaaa u got served</p>');
//-----------------------------------------------------------
