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
    } else {
        username = $('#username').val().trim();

        $('#username').val("");
        numPlayers++;
        console.log(numPlayers);
        database.ref().push({
            username: username,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
            wins: wins,
            losses: losses

        });

    };
    return false;
});

// firebase.auth().signInAnonymously().catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ...
// });

// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         // User is signed in.
//         var isAnonymous = user.isAnonymous;
//         var uid = user.uid;
//         // ...
//     } else {
//         // User is signed out.
//         // ...
//     }
//     // ...
// });



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
