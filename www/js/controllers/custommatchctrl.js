starter.controller('customMatchCtrl', function($scope, $ionicPopup) {

	
	setDateInput();
	
	// set date input to current date/time
	function setDateInput() {
		// get current date
		var currentTime = new Date();
		// convert date to ISO
		currentTime = currentTime.toISOString();
		// convert date string to dattime input format
		currentTime = currentTime.substring(0, 16);
		$("#dateInput").val(currentTime);
	}

	// initialise search string, playerid lookup and player arrays as empty
	var searchString = "";

	// record keypresses and store in searchString
	$("#name1, #name2").keydown(function(e) {
		keypress = String.fromCharCode(e.keyCode);
		// if backspace pressed remove last char
		if(e.keyCode == 8) {
			searchString = searchString.substring(0, searchString.length - 1);
		} 
		// if space pressed insert "+"
		else if(e.keyCode == 32) {
			searchString = searchString + "+";
		} 
		// else concat char pressed to searchString
		else {
			searchString = searchString + keypress;	
		}
		searchString = searchString.toLowerCase();
		loadPlayerList(searchString, this.id);
	});


	// function to get url key using Richard's formula
	function getKey() {
		var time = new Date().getTime()/1000;
		return Math.round(Math.sqrt(time * 100) - 100);
	}

	// creates list of players for autocomplete and id lookup
	function createAutoList(data, id) {
		var playersArray = [];
		var playerIds = [];
		data = $.parseJSON(data);
		// loop through data and fill array (max 10)
		for (var i = 0; i < data.data.length; i++) {
			playersArray[i] = data.data[i].player;
			playerIds[i] = data.data[i].playerid;
		}
		// load autocomplete on either name input
		id = '#' + id;
		$(id).autocomplete({
			source: playersArray,
			minLength: 2,
			delay: 1300,
			// to ensure name selection is from autocompleye dropdown (no new names)
			change: function (event, ui) {
                if(!ui.item){
                    $(id).val("");
                }
            }
		})
	}

	// loads list of players from squashlevels from input string
	function loadPlayerList(searchString, id) {
		var key = "&key=" + getKey();
		var search = "&name=" + searchString;
		var proxy = "https://cors-anywhere.herokuapp.com/";
		var requestUrl = proxy + "http://www.squashlevels.com/info.php?action=find" + search + "&format=json&appid=SL2.0" + key;  
		// make request to squashlevels find url
		console.log(requestUrl)
		var data = $.ajax({
			url: requestUrl
		}).done(function(){
			createAutoList(data.responseText, id);
		}).fail(function(){
			console.error("Ajax request failed!");
		});
	}

	// array of who is winning each round
	var rounds = [-1, -1, -1, -1, -1]
	// object of the scores of the rounds
	var scores = {"1a": 0, "1b": 0, "2a": 0, "2b": 0, "3a": 0, "3b": 0, "4a": 0, "4b": 0, "5a": 0, "5b": 0}

	// when a score change button is pressed
	$scope.scoreBtnCallback = function(btn, add) {
		// change the score in the scores object
		if (scores[btn] + add >= 0) {
			scores[btn] = scores[btn] + add
		}
		// update input value
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

	// update the round scores based on who is winnning each round in the rounds array
	function updateRounds() {
		var totalA = 0;
		var totalB = 0;
		// if one player is winning a round, update their total
		for (var i = 0; i < 5; i++) {
			if (rounds[i] == 0) {
				totalA++;
			} else if (rounds[i] == 1) {
				totalB++;
			}
		}
		// put totals into the page
		$("#rounds1").html(totalA);
		$("#rounds2").html(totalB);
	}

	//when submit button is pressed
	$scope.submitScores = function() {
		clearPage();
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
		// reset score object, rounds array and date/name inputs
		scores = {};
		rounds = [];
		$("#dateInput").val("");
		$(".nameInput").val("");
		// loop through inputs and rest all their values
		var inputs = ['1a','1b','2a','2b','3a','3b','4a','4b','5a','5b']
		for (var x = 0; x < inputs.length; x++) {
			var i = inputs[x];
			var j = '#'+inputs[x];
			scores[i] = 0;
			$(j).html(scores[i]);
		}
		updateRounds();
		setDateInput();
		popAlert("Scores Submitted!");
	}
})










