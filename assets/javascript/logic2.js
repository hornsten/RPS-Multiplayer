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

    database.child('players').child('1').set({

        player1: player1,
        wins1: wins1,
        losses1: losses1,
        uid: uid,
        gameStarted: true
    });

    $('#status').html('<h4>Hi, ' + player1 + '! You are Player 1</h4>');

};

//Firebase watcher + initial loader HINT: .on("value")
database.child('players').child('1').on("value", function(snapshot) {


    // Change the HTML to reflect
    $('#player-1').html('<h2>' + snapshot.val().player1 + '</h2>')
        .append('<h4>Wins: ' + snapshot.val().wins1 + '</h4>')
        .append('<h4>Losses: ' + snapshot.val().losses1 + '</h4>');
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


    database.child('players').child('1').remove();

    $('#start').show();
    $('#username').show();

});



$('#join-game').on('click', joinGame);

function joinGame() {
    firebase.auth().signInAnonymously();

    var uid2 = firebase.auth().currentUser.uid;

    player2 = $('#joiner').val().trim();

    database.child('players').child('2').set({

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
database.child('players').child('2').on("value", function(snapshot2) {

    //Log everything that's coming out of snapshot


    // Change the HTML to reflect
    $('#player-2').html('<h2>' + snapshot2.val().player2 + '</h2>')
        .append('<h4>Wins: ' + snapshot2.val().wins2 + '</h4>')
        .append('<h4>Losses: ' + snapshot2.val().losses2 + '</h4>');

    $('#join-game').hide();
    $('#joiner').hide();
    // Handle the errors

}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});


//Auth Listener

firebase.auth().onAuthStateChanged(firebaseUser => {

    database.child('players').child('2').remove();


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
