starter.controller('findCtrl', function($scope, $rootScope, $state) {
	/*
	* Every time a key is typed, send output to url to return an
	* autocomplete list of size 10
	*/

	// initialise search string, playerid lookup and player arrays as empty
	var searchString = "";
	var playerIdLookup = [];

	// record keypresses and store in searchString
	$("#char_press").keydown(function(e) {
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
		loadPlayerList(searchString);
	});


	/* function to get url key */
	function getKey() {
		var time = new Date().getTime()/1000;
		return Math.round(Math.sqrt(time * 100) - 100);
	}

	/* creates list of players for autocomplete and id lookup */
	function createAutoList(data) {
		var playersArray = []
		data = $.parseJSON(data);
		for (var i = 0; i < data.data.length; i++) {
			playersArray[i] = data.data[i].player;
		}

		$("#char_press").autocomplete({
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
		console.log(playerIdLookup);
		$("#loading1").hide();
	}

	/* loads list of players from squashlevels from input string */
	function loadPlayerList(search_string) {
		var key = "&key=" + getKey();
		var search = "&name=" + search_string;
		var proxy = "http://localhost:8080/";
		var request_url = proxy + "http://www.squashlevels.com/info.php?action=find" + search + "&format=json&appid=SL2.0" + key;  
		// make request to squashlevels find url
		var data = $.ajax({
			url: request_url
		}).done(function(){
			createAutoList(data.responseText);
			createPlayerIdArray(data.responseText);
		}).fail(function(){
			console.error("Ajax request failed!");
		});
	}

	$scope.tapped = function(id) {
		$rootScope.tapped = id
		var searchVal = $("#char_press").val().trim();
		console.log(searchVal);
		$state.go('squashLevels.playerProfiles')
	}

})
