starter.controller('findCtrl', function($scope, $rootScope, $state) {
	/*
	* Every time a key is typed, send output to url to return an
	* autocomplete list of size 10
	*/

	// initialise search string, playerid lookup and player arrays as empty
	var searchString = "";
	var playerIdLookup = [];

	// record keypresses and store in searchString
	$("#charpress").keydown(function(e) {
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
		loadPlayerList(searchString);
	});

	// function to get url key
	function getKey() {
		var time = new Date().getTime()/1000;
		return Math.round(Math.sqrt(time * 100) - 100);
	}

	var playerIds = [];
	var playerNames = [];

	// creates list of players for autocomplete and id lookup
	function createAutoList(data) {
		data = $.parseJSON(data);
		// fill playersArray with retrieved data (maximum 10)
		for (var i = 0; i < data.data.length; i++) {
			playerIds[i] = data.data[i].playerid;
			playerNames[i] = data.data[i].player;
		}
		// load autocomplete
		$("#charpress").autocomplete({
			source: playerNames,
			minLength: 2,
			delay: 1300
		})
	}

	// loads list of players from squashlevels from input string
	function loadPlayerList(searchString) {
		var key = "&key=" + getKey();
		var search = "&name=" + searchString;
		var proxy = "http://localhost:8080/";
		var requestUrl = proxy + "http://www.squashlevels.com/info.php?action=find" + search + "&format=json&appid=SL2.0" + key;  
		// make request to squashlevels find url
		var data = $.ajax({
			url: requestUrl
		}).done(function(){
			createAutoList(data.responseText);
			// createPlayerIdArray(data.responseText);
		}).fail(function(){
			console.error("Ajax request failed!");
		});
	}

	// when search button is pressed
	$scope.tapped = function(id) {
		var searchVal = $("#charpress").val().trim();
		var index = playerNames.indexOf(searchVal);
		// set rootscope variable so it can be read by playerprofiles page
		$rootScope.tapped = playerIds[index];
		// go to playerPforile page
		$state.go('squashLevels.playerProfiles')
	}

})
