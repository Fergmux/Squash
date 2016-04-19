starter.controller('customMatchCtrl', function($scope, $ionicPopup) {

	//no. of rounds
	// var rounds = 3;
	//if the submission is for a doubles game
	// var doubles = false
	setDateInput();
	//set date input to current date/time
	function setDateInput() {
		//get current date
		var currentTime = new Date();
		//convert date to ISO
		currentTime = currentTime.toISOString()
		//convert date string to dattime input format
		currentTime = currentTime.substring(0, 16)
		$("#dateInput").val(currentTime)
	}

	//autocomplet function
	$(function() {
		$(".nameInput").autocomplete({
			// source: $parseJSON(localStorage["allplayers"]),
			source: allplayers,
			minLength: 3
		});
	});

	var allplayers

	function loadnames() {
		// load player array for autocomplete
		// work out key
		var time = new Date().getTime()/1000
		key = Math.round(Math.sqrt(time * 100) - 100)
		console.log(key)
		var k = "http://www.squashlevels.com/players.php?&all=&key="+key+"&perpage=-1&format=json"
		k = "https://crossorigin.me/" + k + "&appid=SL2.0"
		var data = $.ajax({
            url: k
        }).done(function(){
            makePlayerArray(data.responseText)
        }).fail(function(){

        });
	}

	function makePlayerArray(data) {
		var players = []
		data = $.parseJSON(data);
		for (var x = 0; x < data.data.length; x++) {
			players[x] = data.data[x].player;
		}
		// localStorage["allplayers"] = JSON.stringify(players)
		allplayers = players
	}

	var rounds = [-1, -1, -1, -1, -1]
	var scores = {
		"1a": 0,
		"1b": 0,
		"2a": 0,
		"2b": 0,
		"3a": 0,
		"3b": 0,
		"4a": 0,
		"4b": 0,
		"5a": 0,
		"5b": 0
	}

	// Score button callback
	$scope.scoreBtnCallback = function(btn, add) {
		if (scores[btn] + add >= 0) {
			scores[btn] = scores[btn] + add
		}

		$("#" + btn).val(scores[btn])
		checkScores();
	}

	// Check scores to see who is winning each round
	function checkScores() {
		for (var i = 1; i <= 5; i++) {
			if (scores[i.toString() + "a"] == scores[i.toString() + "b"]) {
				rounds[i-1] = -1;
			} else if (scores[i.toString() + "a"] > scores[i.toString() + "b"]) {
				rounds[i-1] = 0;
			} else {
				rounds[i-1] = 1;
			}
		}

		updateRounds();
	}

	function updateRounds() {
		var totalA = 0;
		var totalB = 0;

		for (var i = 0; i < 5; i++) {
			if (rounds[i] == 0) {
				totalA++;
			} else if (rounds[i] == 1) {
				totalB++;
			}
		}

		$("#rounds1").html(totalA);
		$("#rounds2").html(totalB);
	}

	//when submit button is pressed
	$scope.submitScores = function() {
		// checkInputs();
		checkNames();
	}
	function checkNames() {
		// var players = $.parseJSON(localStorage["allplayers"])
		var players = allplayers
		// check players are already registered
		if((($.inArray($("#name1").val(), players)) >= 0) && (($.inArray($("#name2").val(), players) >= 0))) {
			clearPage()
		} else {
			popAlert("Players must already be registered")
		}
	}

	//throws an alert taking in the text to be displayed as parameter
	function popAlert(text) {
		$ionicPopup.alert({
            title: 'Alert',
            type: 'button-assertive',
            content: text
        })
	}

	//clear the inputs on the page
	function clearPage() {
		$scope.scores = {}
		score1 = [0, 0, 0, 0, 0]
		score2 = [0, 0, 0, 0, 0]
		$("#dateInput").val("");
		$(".nameInput").val("");
		scores["1a"] = 0
		$("#1a").html(scores["1a"])
		scores["1b"] = 0
		$("#1b").html(scores["1b"])
		scores["2a"] = 0
		$("#2a").html(scores["2a"])
		scores["2b"] = 0
		$("#2b").html(scores["2b"])
		scores["3a"] = 0
		$("#3a").html(scores["3a"])
		scores["3b"] = 0
		$("#3b").html(scores["3b"])
		scores["4a"] = 0
		$("#4a").html(scores["4a"])
		scores["4b"] = 0
		$("#4b").html(scores["4b"])
		scores["5a"] = 0
		$("#5a").html(scores["5a"])
		scores["5b"] = 0
		$("#5b").html(scores["5b"])
		updateRounds();
		setDateInput();
		popAlert("Scores Submitted!");
	}
})