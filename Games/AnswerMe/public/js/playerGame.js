var socket = io();
var playerAnswered = false;
var playerResponded = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);
    document.getElementById('response').style.visibility = "hidden";
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
		//hide everything to reset it
});

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});

//Player response is their text answer to the question while player answer is the multiple choice of what player made the answer on the tv
function responseSubmitted(){
    if(playerResponded == false){
        playerResponded = true;
          var playerresponse = document.getElementById("response").value;
document.getElementById("nameText").innerHTML = playerresponse;
        socket.emit('playerResponse', playerresponse);//Sends player response to server
        
        //Hiding text box
        document.getElementById('response').style.visibility = "hidden";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Response Submitted! Waiting on other players...";
        
    }
}


socket.on('responseOver', function(){
    document.getElementById('message').innerHTML = "View the responses on the screen";
});

socket.on('nextQuestionPlayer', function(gamemode){
	console.log("gottem");
	if(gamemode == "response"){
		document.getElementById('response').style.visibility = "visible";
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
	}else{
    correct = false;
    playerAnswered = false;
    
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "white";
    }
});

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        
        socket.emit('playerAnswer', num);//Sends player answer to server
        
        //Hiding buttons from user
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Answer Submitted! Waiting on other players...";
        
    }
}

//Get results on last question
 socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

socket.on('questionOver', function(data){
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "Moving on to next response...";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
});


socket.on('questionSessionOver', function(data){
    
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct answers: " + data;
    socket.emit('getScore');
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
  
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});



socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});

