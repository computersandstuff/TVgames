var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;

var time = 20;

//When host connects to server
socket.on('connect', function() {
    
    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

socket.on('typeresponse', function(){ //gamemode 1 
 clearInterval(timer);
    document.getElementById('question').innerHTML = "What is your name?";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    //var correctAnswer = data.correct;
    //document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();
});
 
socket.on('startvote', function(data){
	 clearInterval(timer);
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3; 
    document.getElementById('answer4').innerHTML = data.a4;
	if(data.a1 != null){
	document.getElementById('answer1').style.visibility = "visible";
	}
		if(data.a2 != null){
	document.getElementById('answer2').style.visibility = "visible";
	}
		if(data.a3 != null){
	document.getElementById('answer3').style.visibility = "visible";
	}
		if(data.a4 != null){
	document.getElementById('answer4').style.visibility = "visible";
	}

    //var correctAnswer = data.correct;
    //document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
    updateTimer();
});

socket.on('updatePlayersAnswered', function(data){
   document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame; 
});


socket.on('responseOver', function(playerData, allResponses){
    clearInterval(timer);
 document.getElementById('question').innerHTML = allResponses.toString();
 viewResponsesCountdown();
});

socket.on('questionOver', function(playerData, correct){
    clearInterval(timer);
    
	var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var total = 0;
	
    //Hide elements on page
    //document.getElementById('playersAnswered').style.display = "none";
    //document.getElementById('timerText').style.display = "none";
	    document.getElementById('question').innerHTML = "Moving on to next question...";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
	postVoteCountdown();
  
});

function nextQuestion(){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.filter = "none";
    document.getElementById('answer2').style.filter = "none";
    document.getElementById('answer3').style.filter = "none";
    document.getElementById('answer4').style.filter = "none";
    
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = " 20";
    socket.emit('nextQuestion'); //Tell server to start new question
	console.log("nextQuestion() function");
}

function updateTimer(){
    time = 20;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time <= 0){
            socket.emit('timeUp');
        }
    }, 1000);
}

function viewResponsesCountdown(){
    time = 25;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time <= 0){
            socket.emit('nextQuestion');
			console.log("viewresponsescountdown");
        }
    }, 1000);
}

function postVoteCountdown(){
    time = 5;
    timer = setInterval(function(){
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if(time <= 0){
            socket.emit('nextQuestion');
			
        }
    }, 1000);
}
socket.on('GameOver', function(data){
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    
    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').innerHTML = "GAME OVER";
    document.getElementById('playersAnswered').innerHTML = "";
    
    
    
    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "block";
    document.getElementById('winner5').style.display = "block";
    document.getElementById('winnerTitle').style.display = "block";
    
    document.getElementById('winner1').innerHTML = "1. " + data.num1;
    document.getElementById('winner2').innerHTML = "2. " + data.num2;
    document.getElementById('winner3').innerHTML = "3. " + data.num3;
    document.getElementById('winner4').innerHTML = "4. " + data.num4; 
    document.getElementById('winner5').innerHTML = "5. " + data.num5;
});



socket.on('getTime', function(player){
    socket.emit('time', {
        player: player,
        time: time
    });
});
socket.on('revealPlayer', function(answers, players){
	clearInterval(timer);
	var i = 0;
	answersloop(answers, players);
	function answersloop(answers, players){
		console.log("answer loop");
		 i++;
		setTimeout(function() {
			    console.log("settimeout", i);
				
    if (i <= answers.length) {  
	console.log("under or equal to answers length", i);
		var answer = answers[i-1];
		var player = players[i-1];	
		document.getElementById('question').style.visibility = "visible";
		 document.getElementById('question').innerHTML = `${answer} was said by: ${player.name}`;
      answersloop(answers, players);            
	  
    } 
		 }, 7000)
		
	}



 socket.emit('finishedReveal');
});


socket.on('gameQuestionOver', function(playerData, allResponses){
    clearInterval(timer);
 document.getElementById('question').innerHTML = allResponses.toString();
 viewResponsesCountdown();
   /*
    //Shows user correct answer with effects on elements
    if(correct == 1){
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer1').innerHTML;
        document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
    }else if(correct == 2){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer2').innerHTML;
        document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
    }else if(correct == 3){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer3').innerHTML;
        document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
    }else if(correct == 4){
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer4').innerHTML;
        document.getElementById('answer4').innerHTML = "&#10004" + " " + current;
    }
    
    for(var i = 0; i < playerData.length; i++){
        if(playerData[i].gameData.answer == 1){
            answer1 += 1;
        }else if(playerData[i].gameData.answer == 2){
            answer2 += 1;
        }else if(playerData[i].gameData.answer == 3){
            answer3 += 1;
        }else if(playerData[i].gameData.answer == 4){
            answer4 += 1;
        }
        total += 1;
    }
    
    //Gets values for graph
    answer1 = answer1 / total * 100;
    answer2 = answer2 / total * 100;
    answer3 = answer3 / total * 100;
    answer4 = answer4 / total * 100;
    
    document.getElementById('square1').style.display = "inline-block";
    document.getElementById('square2').style.display = "inline-block";
    document.getElementById('square3').style.display = "inline-block";
    document.getElementById('square4').style.display = "inline-block";
    
    document.getElementById('square1').style.height = answer1 + "px";
    document.getElementById('square2').style.height = answer2 + "px";
    document.getElementById('square3').style.height = answer3 + "px";
    document.getElementById('square4').style.height = answer4 + "px";
    
    document.getElementById('nextQButton').style.display = "block";
    */
});




















