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
var wins1 = 0;
var losses1 = 0;
var player1db = database.child('players').child('1');
$('#start').on('click', function() {


    player1 = $('#username').val().trim();

    player1db.set({

        player1: player1,
        wins1: wins1,
        losses1: losses1
    });


    $('#start').hide();
    $('#username').hide();


});

//Firebase watcher + initial loader HINT: .on("value")
player1db.on("value", function(snapshot) {

    //Log everything that's coming out of snapshot
    // console.log(snapshot.val());
    console.log(snapshot.val());
    // console.log(snapshot.val().player2);
    // console.log(snapshot.val().results);
    // console.log(snapshot.val().chat);

    // Change the HTML to reflect
    $('#player-1').html('<h2>' + snapshot.val().player1 + '</h2>')
        .append('<h4>Wins: ' + snapshot.val().wins1 + ' </h4>')
        .append('<h4>Losses:' + snapshot.val().losses1 + ' </h4>');
    $("#player-2").html(snapshot.val().player2);
    $("#game-results").html(snapshot.val().results);
    $("#chat-log").html(snapshot.val().chat);

    // Handle the errors
}, function(errorObject) {

    console.log("Errors handled: " + errorObject.code);

});
