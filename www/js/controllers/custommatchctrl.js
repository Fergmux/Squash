starter.controller('customMatchCtrl', function($scope, $ionicPopup) {

	
	setDateInput();
	
	// set date input to current date/time
	function setDateInput() {
		// get current date
		var currentTime = new Date();
		// convert date to ISO
		currentTime = currentTime.toISOString();
		// convert date string to dattime input format
		currentTime = currentTime.substring(0, 16)
		$("#dateInput").val(currentTime);
	}

	// initialise search string, playerid lookup and player arrays as empty
	var searchString = "";
	var playerIdLookup = [];

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
		// else concat char pressed to search_string
		else {
			searchString = searchString + keypress;	
		}
		searchString = searchString.toLowerCase();
		loadPlayerList(searchString, this.id);
	});


	/* function to get url key */
	function getKey() {
		var time = new Date().getTime()/1000;
		return Math.round(Math.sqrt(time * 100) - 100);
	}

	/* creates list of players for autocomplete and id lookup */
	function createAutoList(data, id) {
		var playersArray = []
		data = $.parseJSON(data);
		for (var i = 0; i < data.data.length; i++) {
			playersArray[i] = data.data[i].player;
		}
		console.log(playersArray)
		$('#'+id).autocomplete({
			source: playersArray,
			minLength: 2,
			delay: 1300
		})

	}

	/* make array of ids for player id lookup */
	function createPlayerIdArray(data) {
		var playerIds = []
		data = $.parseJSON(data);
		for(var i = 0; i < data.data.length; i++) {
			playerIds[i] = data.data[i].playerid;
		}
		playerIdLookup = playerIds;
	}

	/* loads list of players from squashlevels from input string */
	function loadPlayerList(search_string, id) {
		var key = "&key=" + getKey();
		var search = "&name=" + search_string;
		var proxy = "https://cors-anywhere.herokuapp.com/";
		var request_url = proxy + "http://www.squashlevels.com/info.php?action=find" + search + "&format=json&appid=SL2.0" + key;  
		// make request to squashlevels find url
		console.log(request_url)
		var data = $.ajax({
			url: request_url
		}).done(function(){
			createAutoList(data.responseText, id);
			createPlayerIdArray(data.responseText);
		}).fail(function(){
			console.error("Ajax request failed!");
		});
	}

	// array of players to be displayed in autocomplete
	// var allplayers;

	// // load player array for autocomplete
	// function loadnames() {
	// 	var key = getKey();
	// 	var k = "http://www.squashlevels.com/players.php?&all=&key="+key+"&perpage=-1&format=json"
	// 	k = "https://crossorigin.me/" + k + "&appid=SL2.0"
	// 	var data = $.ajax({
 //            url: k
 //        }).done(function(){
 //            makePlayerArray(data.responseText)
 //        }).fail(function(){

 //        });
	// }

	// function makePlayerArray(data) {
	// 	var players = []
	// 	data = $.parseJSON(data);
	// 	for (var x = 0; x < data.data.length; x++) {
	// 		players[x] = data.data[x].player;
	// 	}
	// 	// localStorage["allplayers"] = JSON.stringify(players)
	// 	allplayers = players
	// }

	/* creates list of players for autocomplete and id lookup */
	// function createAutoList(data) {
	// 	var playersArray = []
	// 	data = $.parseJSON(data);
	// 	for (var i = 0; i < data.data.length; i++) {
	// 		playersArray[i] = data.data[i].player;
	// 	}

	// 	$("#char_press").autocomplete({
	// 		source: playersArray,
	// 		minLength: 2,
	// 		delay: 1300
	// 	})

	// }

	// /* make array of ids for player id lookup */
	// function createPlayerIdArray(data) {
	// 	var playerIds = []
	// 	data = $.parseJSON(data);
	// 	for(var i = 0; i < data.data.length; i++) {
	// 		playerIds[i] = data.data[i].playerid;
	// 	}
	// 	playerIdLookup = playerIds;
	// 	console.log(playerIdLookup);
	// 	$("#loading1").hide();
	// }

	//  loads list of players from squashlevels from input string 
	// function loadPlayerList(search_string) {
	// 	var key = "&key=" + getKey();
	// 	var search = "&name=" + search_string;
	// 	var proxy = "https://cors-anywhere.herokuapp.com/";
	// 	var request_url = proxy + "http://www.squashlevels.com/info.php?action=find" + search + "&format=json&appid=SL2.0" + key;  
	// 	// make request to squashlevels find url
	// 	var data = $.ajax({
	// 		url: request_url
	// 	}).done(function(){
	// 		createAutoList(data.responseText);
	// 		createPlayerIdArray(data.responseText);
	// 	}).fail(function(){
	// 		console.error("Ajax request failed!");
	// 	});
	// }

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