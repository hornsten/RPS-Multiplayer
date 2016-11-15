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
var player1 = "";
var player2 = "";
var wins2 = 0;
var losses2 = 0;
var wins1 = 0;
var losses1 = 0;
var gameStarted = false;
var gameClosed = false;


$('#join-game').hide();
$('#joiner').hide();

$('#start').on('click', function() {

    firebase.auth().signInAnonymously();

    var uid = firebase.auth().currentUser.uid;

    player1 = $('#username').val().trim();

    database.child('players').child('1').set({

        player1: player1,
        wins1: wins1,
        losses1: losses1,
        uid: uid,
        gameStarted: true
    });


    $('#start').hide();
    $('#username').hide();

});

//Firebase watcher + initial loader HINT: .on("value")
database.child('players').child('1').on("value", function(snapshot) {

    //Log everything that's coming out of snapshot
    console.log(snapshot.val());

    // Change the HTML to reflect
    $('#player-1').html('<h2>' + snapshot.val().player1 + '</h2>')
        .append('<h4>Wins: ' + snapshot.val().wins1 + '</h4>')
        .append('<h4>Losses: ' + snapshot.val().losses1 + '</h4>');

    $('#join-game').show();
    $('#joiner').show();

    // Handle the errors
}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {


    database.child('players').child('1').remove();
    numPlayers = 0;

});

$('#join-game').on('click', function() {

    firebase.auth().signInAnonymously();

    var uid2 = firebase.auth().currentUser.uid;

    player2 = $('#joiner').val().trim();

    database.child('players').child('2').set({

        player2: player2,
        wins2: wins2,
        losses2: losses2,
        uid2: uid2,
        gameStarted: true
    });


    $('#join-game').hide();
    $('#joiner').hide();

});

//Firebase watcher + initial loader HINT: .on("value")
database.child('players').child('2').on("value", function(snapshot) {

    //Log everything that's coming out of snapshot
    console.log(snapshot.val());

    // Change the HTML to reflect
    $('#player-2').html('<h2>' + snapshot.val().player2 + '</h2>')
        .append('<h4>Wins: ' + snapshot.val().wins2 + '</h4>')
        .append('<h4>Losses: ' + snapshot.val().losses2 + '</h4>');

    // Handle the errors
}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {


    database.child('players').child('2').remove();
    numPlayers = 0;

});
