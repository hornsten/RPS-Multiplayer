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


var username = "";
var dateAdded = "";
var numPlayers = 0;
var players;
var wins = 0;
var losses = 0;

//Sign-in and Authorization

$('#start').on('click', function() {



    if (numPlayers > 1) {

        alert('Too many players.  Try again later');

        $('#username').val("");

    } else if (numPlayers === 0) {
        firebase.auth().signInAnonymously();

        username = $('#username').val().trim();

        $('#username').val("");

        database.child("players").child("1").set({

            username: username,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            wins: wins,
            losses: losses

        });
        $('#player-1').html('<h2>' + username + '</h2>')
            .append('<h4>Wins: ' + wins + ' </h4>')
            .append('<h4>Losses:' + losses + ' </h4>');
        numPlayers++;

    } else if (numPlayers === 1) {

        username = $('#username').val().trim();

        $('#username').val("");
        database.child("players").child("2").set({

            username: username,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            wins: wins,
            losses: losses


        });
        $('#player-2').html('<h2>' + username + '</h2>')
            .append('<h4>Wins: ' + wins + ' </h4>')
            .append('<h4>Losses:' + losses + ' </h4>');
        numPlayers++;
    }
    return false;

});

//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    console.log(firebaseUser);
});





// Buttons are functioning-----------------------------------

$('#chat').on('click', holla);

function holla() {
    alert('hey!');
}
//-----------------------------------------------------------

// Divs targeted---------------------------------------------
$('#player-1').html('<h2>Player 1</h2>');
$('#game-results').html('<h2>Results</h2>');
$('#player-2').html('<h2>Player 2</h2>');
$('#chat-log').append('<p>braaaaa u got served</p>');
//-----------------------------------------------------------
