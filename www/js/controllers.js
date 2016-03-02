angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {
	Cache.initialize();
	//604800000 milliseconds in a week
	Cache.clean(604800000);
})

.controller('signupCtrl', function($scope) {

})

.controller('myProfileCtrl', function($scope) {

})

.controller('rankingsCtrl', function($scope) {
	//only fires when page ist first entered
	$scope.$on('$ionicView.loaded', function () {
		$("#results").hide();
		$("#loader").show();
		loadplayers();
		loadlookup();
	})

	var players = []
	loadnames();

	$(function() {
    	$( "#playerid" ).autocomplete({
      		source: players
    	});
  	});
	function loadnames(){
		Cache.request("http://www.badsquash.co.uk/players.php?&leaguetype=1&perpage=-1&format=json", makePlayerArray, function() {
			$("#msg").html("Error - AJAX failed")
		})
	}
	function makePlayerArray(data){
		data = $.parseJSON(data);
		for (var x = 0; x < data.data.length; x++) {
			players[x] = data.data[x].player;
		}
	}

	//load in google charts
	google.charts.load('current', {
		packages: ['corechart']
	});
	google.charts.setOnLoadCallback(drawChart);

	//when search button is pressed
	$scope.onTap = function() {
		//empty error message
		$("#msg").empty();

		//hide results
		$("#results").hide();
		$("#playerlist").hide();

		$("#loader").show();
		
		//get value from search box
		var searchVal = $("#playerid").val()

		//if there is no value in search box, bring back rank list, otherwise load individual player
		if(searchVal=="") {
			loadplayers();
		} else {
			load(searchVal);
		}
	}

	//initialse lookup table for player name - ID
	var idtable = new Object();

	//get the player data using the cache
	function loadplayers() {
		Cache.request("http://www.badsquash.co.uk/players.php?leaguetype=1&format=json", displayplayers, function() {
				$("#msg").html("Error in AJAX request.");
			})
		}

	// push the rankings data to the list
	function displayplayers(data) {
		var data = $.parseJSON(data);
		$scope.items = []
		for (var i = 0; i < data.data.length; i++) {
			$scope.items.push(data.data[i].level + " - " + data.data[i].player)
		}
		$scope.$apply()
		$("#loader").hide();
		$("#playerlist").show();
	}

	//when a rank list item is clicked, earch for that person
	$scope.search = function(item) {
		$("#playerlist").hide();
		$("#loader").show();
		//take the name from the list item
		var player = item.split("-")[1].trim()

		//put the name in the search box (it looks nice)
		$("#playerid").val(player)

		//load player page
		load(player);
	}

	function readmatch(match) {
		if (match.leaguetypeid) {
			return [match.opponent, match.games_score, match.level_before, match.level_after];
		} else {
			if (match.matchtypeid) {
				return ["Match", match.opponent, match.games_score, match.level_before, match.level_after];
			} else {
				// something went wrong
				return ["error", "", "", "", ""];
			}
		}
	}

	function drawChart(chartdata) {
		try {
			var data = new google.visualization.DataTable();
			data.addColumn('date', 'date');
			data.addColumn('number', 'level');

			for (var i = 0; i < chartdata.length; i++) {
				date = new Date(chartdata[i][0]*1000)
                data.addRow([date, chartdata[i][1]]);
			}
			var options = {
				title: 'Level History',
				colors: ['red'],
                legend: {position: 'none'},
                width: 400,
                pointSize: 3,
				hAxis: {
					format: 'd MMM yy',
					textStyle: {
						fontSize: 8
					}
				},
    			vAxis: {
					baseline: 0,
				}
			};
			var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
			chart.draw(data, options);
		} catch (err) {
			console.log("err: Empty chart_data");
		}
	}

	function chartData(match) {
		if (match.dateint) {
			return [match.dateint, match.level_after];
		} else {
			return ["error", "", "", "", ""];
		}
	}

	//display the player profile
	function display(data) {
		var data = $.parseJSON(data);
		if (data.status == "good") {
			var id = data.data.summary.playerid;
			var name = data.data.summary.player;

			$("#tab-main").html(name);

			var s = data.data.statistics;
			$("#p_matches").html("Matches: " + s.matches +
				" won " + s.matches_won +
				" lost " + s.matches_lost);
			// $("#matchesbar").progressbar({value: 100 * s.matches_win_ratio});
			$("#p_games").html("Games: " + (s.games_won + s.games_lost) +
				" won " + s.games_won +
				" lost " + s.games_lost);
			// $("#gamesbar").progressbar({value: 100 * s.games_win_ratio});
			$("#p_points").html("Points: " + (s.points_won + s.points_lost) +
				" won " + s.points_won +
				" lost " + s.points_lost);
			// $("#pointsbar").progressbar({value: 100 * s.points_win_ratio});

			var matches = data.data.matches;
			var matchdata = [];
			var chartdata = [];
			for (var i = 0; i < matches.length; i++) {
				var t = readmatch(matches[i]);
				var c = chartData(matches[i]);
				matchdata.push(t);
				chartdata.push(c);
			}

			//define the table columns
			$("#dtable").dataTable({
				data: matchdata,
				"bDestroy": true,
				columns: [{
					title: "Opponent"
				}, {
					title: "Score"
				}, {
					title: "Level before"
				}, {
					title: "Level after"
				}]
			});
			$("#loader").hide();
			$("#results").show();
			$("#tab-main").html(drawChart(chartdata));
		} else {
			$("#loader").hide();
			$("#msg").html("Error - " + data.user_message);
		}
	}

	//load the lookup table data for all players - ID
	function loadlookup(){
		Cache.request("http://www.badsquash.co.uk/players.php?&leaguetype=1&perpage=-1&format=json", makePlayerTable, function() {
			$("#msg").html("Error - id must be a number")
		})
	}

	//populate the payer -ID lookup table
	function makePlayerTable(data) {
		data = $.parseJSON(data);
		for (x in data.data) {
			var playerid = data.data[x].playerid;
			var player = data.data[x].player.toLowerCase();
			idtable[player] = playerid;
		}
	}

	//load the data for the player page with the cache
	function load(name) {
		//test if they are searching for ID or player name
		if (!/^[0-9]+$/.test(name)) {
			//make lower case to remove errors on incorrect capitalization
			var id = idtable[name.toLowerCase()]
		} else {
			var id = name;
		}
		Cache.request("http://www.badsquash.co.uk/player_detail.php?player=" + id + "&format=json", display, function() {
				$("#msg").html("Error in AJAX request.");
			})
	}
})



// SquashLevels tab: displays player rankings with filters
.controller('squashLevelsCtrl', function($scope) {

	//fires when page is loaded for the first time
	$scope.$on('$ionicView.loaded', function () {
		$("#filters").hide();
		$("#tabs").hide();
		$("#loading").show();
		changeHiddenInput();
	})
	
	//When search buttton is pressed, hide results, reload data, hide filters
	$scope.onTap = function() {
		$("#msg").empty();
		$("#loading").show();
		changeHiddenInput();
		$("#filters").slideToggle('slow');
	}

	//when filters button is pressed toggle filters
	$scope.toggleFilters = function() {
		$("#filters").slideToggle('slow');
	}

	//Displays the rankings as a list
	function displayRank(rank) {
		$("#ranklist").empty();

		var rank = $.parseJSON(rank);

		//if data has been returned succesfully
		if (rank.status == "good") {

			var rankData = rank.data;

			$scope.groups = [];
			//populate rank list with data (Position - Name)
			for (var i = 0; i < rankData.length; i++) {
				var info = rankData[i];
				$scope.groups[i] = {
				    name: info.position + " - " + info.player,
				    items: []
				};
				//make date human readable
				var date = new Date(info.lastmatch_date * 1000).toLocaleDateString();
				
				//push player level, to dropdown
				$scope.groups[i].items.push("Level: " + info.level);
				
				//if the player has a club, push that to dropdown
				if (typeof info.club != 'undefined' && info.club != '') {
			    	$scope.groups[i].items.push("Club: " + info.club);
			    }
			    
			    //push the player's last match datae to dropdown
			    $scope.groups[i].items.push("Last Match: " + date);
			}
			$scope.$apply();
			$("#loading").hide();
			$("#tabs").show();
		} else {
			$("#msg").html("Error - No results for your query");
		}
	}

	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	//this is all code for the accordian dropdown style, ripped straight from internet, don't break
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
	  		$scope.shownGroup = null;
		} else {
	  		$scope.shownGroup = group;
		}
	};
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

	//get the dropdown inpiuts
	function changeHiddenInput() {
		county = $("#county").val();
		show = $('#show').val();
		agegroup = $('#agegroup').val();
		gender = $('#gender').val();
		matchtype = $('#matchtype').val();
		events = $('#events').val();
		clubs = $('#clubs').val();
		country = $("#country").val();

		loadRanking();
	}

	//This loads the data for desplaying rankings, calls displayRank on success
	function loadRanking() {
		Cache.request("http://squashlevels.com/players.php?check=1&limit_confidence=1&club=" + clubs + "&county=" + county + "&country=" + country + "&show=" + show + "&events=" + events + "&matchtype=" + matchtype + "&playercat=" + agegroup + "&playertype=" + gender + "&search=Search+name&format=json", displayRank, function() {
				$("#msg").html("Error in AJAX request for rank");
			})
	}
})

.controller('teamsCtrl', function($scope) {

	// return date in readable format
	function format_date(date) {
		var monthNames = [
			"Jan", "Feb", "Mar", "Apr", "May",
			"Jun", "Jul", "Aug", "Sep", "Oct",
			"Nov", "Dec"
		];
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();

		var formatted_date = String(day) + " " + monthNames[month] + " " + String(year);
		return formatted_date;

	}

	function read_team_match(match) {
		var seconds = match.dateint;
		var date = new Date(seconds * 1000);
		var formatted_date = format_date(date);

		if (match.withdrawn == "false") {
			var attendance = 'Yes';
		} else {
			var attendance = 'No';
		}

		return [match.other_team.name, formatted_date, attendance];
	}

	//display the team data in the table
	function displayteam(teamdata) {
		var data = $.parseJSON(teamdata);
		
		if (data.status == "good") {
			var name = data.data.captain;
			var contact = data.data.contact;
			$("#team_name").html("Captain: " + name + "<br>Contact Number: " + contact);

			var team_matches = data.data.matches;
			var team_matchdata = [];
			for (var i = 0; i < team_matches.length; i++) {
				var t = read_team_match(team_matches[i]);
				team_matchdata.push(t);
			}
			//set columns for the datatable
			$("#dteamtable").DataTable({
				data: team_matchdata,
				columns: [{
					title: "Opponent"
				}, {
					title: "Date"
				}, {
					title: "Availible"
				}, ]
			});
		}
	}

	function loadteam() {
		//get team id from the search box
		var teamid = $("#teamid").val();
		//make sure it's a number (TODO: search on club name)
		if (/^[0-9]+$/.test(teamid)) {
			Cache.request("http://www.badsquash.co.uk/team.php?team=" + teamid + "&format=json", displayteam, function() {
					$("#msg").html("Error in AJAX equest.");
				})
		} else {
			$("#msg").html("Error - id must be a number");
		}
	}

	//when search button is pressed
	$scope.onTap = function() {
		loadteam();
	}

})

.controller('playersCtrl', function($scope, $ionicPopup) {
	// list of players for autofill
	var players = [];
	//no. of rounds
	var rounds = 3;
	//if the submission is for a doubles game
	var doubles = false
	//get player data for autocomplete
	loadplayers();
	setDateInput();
	//set date input to current date/time
	function setDateInput(){
		//get current date
		var currentTime = new Date();
		//convert date to ISO
		currentTime = currentTime.toISOString()
		//convert date string to dattime input format
		currentTime = currentTime.substring(0,16)
		$("#dateInput").val(currentTime)
	}

	//autocomplet function
	$(function() {
    	$( ".nameInput" ).autocomplete({
      		source: players
    	});
  	});

  	//get list of players data
	function loadplayers(){
		Cache.request("http://www.badsquash.co.uk/players.php?&leaguetype=1&perpage=-1&format=json", makePlayerArray, function() {
			$("#msg").html("Error - AJAX failed")
		})
	}
	//populate player array with data
	function makePlayerArray(data){
		data = $.parseJSON(data);
		for (var x = 0; x < data.data.length; x++) {
			players[x] = data.data[x].player;
		}
	}
	//when three rounds is selected, delete 4th and 5th round inputs and update round counter
	$scope.threeRounds = function(){
		rounds = 3;
		$(".moreRounds").hide();
		$scope.scores.score41 = undefined;
		$scope.scores.score42 = undefined;
		$scope.scores.score51 = undefined;
		$scope.scores.score52 = undefined;
		score1[3] = 0;
		score2[3] = 0;
		score1[4] = 0;
		score2[4] = 0;
		updateRounds();
	}
	// show extra round score inputs
	$scope.fiveRounds = function(){
		rounds = 5;
		$(".moreRounds").show();
	}
	//toggle items which are dependent on a double input
	$scope.toggleDoubles = function() {
		$(".doubles").toggle();
		doubles = !doubles;
	}

	//object of score inputs
	$scope.scores = {}

	//array of wether the player has one the round
	var score1 = [0, 0, 0, 0, 0]
	var score2 = [0, 0, 0, 0, 0]

	//functions that update the round arrays when each roud score is changed
	$scope.score1Change = function(){
		if($scope.scores.score11 > $scope.scores.score12) {
			score1[0] = 1
			score2[0] = 0
		} else {
			score1[0] = 0
			score2[0] = 1
		}
		if($scope.scores.score11 == undefined) {
			score1[0] = 0
			score2[0] = 1
		}
		if($scope.scores.score12 == undefined) {
			score1[0] = 1
			score2[0] = 0
		}
		updateRounds();
	}
	$scope.score2Change = function(){
		if($scope.scores.score21 > $scope.scores.score22) {
			score1[1] = 1
			score2[1] = 0
		} else {
			score1[1] = 0
			score2[1] = 1
		}
		if($scope.scores.score21 == undefined) {
			score1[1] = 0
			score2[1] = 1
		}
		if($scope.scores.score22 == undefined) {
			score1[1] = 1
			score2[1] = 0
		}
		updateRounds();
	}
	$scope.score3Change = function(){
		if($scope.scores.score31 > $scope.scores.score32) {
			score1[2] = 1
			score2[2] = 0
		} else {
			score1[2] = 0
			score2[2] = 1
		}
		if($scope.scores.score31 == undefined) {
			score1[2] = 0
			score2[2] = 1
		}
		if($scope.scores.score32 == undefined) {
			score1[2] = 1
			score2[2] = 0
		}
		updateRounds();
	}
	$scope.score4Change = function(){
		if($scope.scores.score41 > $scope.scores.score42) {
			score1[3] = 1
			score2[3] = 0
		} else {
			score1[3] = 0
			score2[3] = 1
		}
		if($scope.scores.score41 == undefined) {
			score1[3] = 0
			score2[3] = 1
		}
		if($scope.scores.score42 == undefined) {
			score1[3] = 1
			score2[3] = 0
		}
		updateRounds();
	}
	$scope.score5Change = function(){
		if($scope.scores.score51 > $scope.scores.score52) {
			score1[4] = 1
			score2[4] = 0
		} else {
			score1[4] = 0
			score2[4] = 1
		}
		if($scope.scores.score51 == undefined) {
			score1[4] = 0
			score2[4] = 1
		}
		if($scope.scores.score52 == undefined) {
			score1[4] = 1
			score2[4] = 0
		}
		updateRounds();
	}
	//update the round counters
	function updateRounds() {
		//work out the total of tyhe round arrays
		var total1 = score1.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return previousValue + currentValue;
		});
		var total2 = score2.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return previousValue + currentValue;
		});
		//set round conters to array total
		$("#rounds1").html(total1)
		$("#rounds2").html(total2)
	}
	//when submit button is pressed
	$scope.submitScores = function() {
		checkInputs();
	}
	function checkInputs(){
		var first = 0   // wether the score being calculated is the first value or the one it's being compared to
		var check       //value to calculate against val
		var val         //value to calculate against check
		var output = [] //the output array
		var alerted = 0 //wether or not the userr has been alerted (wether there is an error with the submission)
		// arrays to loop through to check values from scores object
		var threeArray = ['score11', 'score12', 'score21', 'score22', 'score31', 'score32']
		var fiveArray = ['score11', 'score12', 'score21', 'score22', 'score31', 'score32', 'score41', 'score42', 'score51', 'score52']

		//if there are not enough scores
		if (Object.keys($scope.scores).length < rounds*2) {
			alerted = 1
			popAlert("Please enter all scores")
		} else {
			var loopArray;
			if (rounds = 3) {
				loopArray = threeArray
			} else {
				loopArray = fiveArray
			}
			for (x in loopArray) {
				var score = $scope.scores[loopArray[x]]
				if (first == 0) {
					check = score;
					first = 1
				} else {
					var isValid = checkValid(score, check);
					if (isValid == 1) {
						output.push[score, check]
						first = 0
					} else {
						alerted = 1
						popAlert(isValid)
						break
					}
				}
			}
		}
		//if no date, throw error
		if ($("#dateInput").val() == undefined) {
			alerted = 1
			popAlert("Please set a date and time")
		}
		// if names not entered throw an error
		if ($("#name1").val() == "" || $("#name1").val() == "") {
			alerted = 1
			popAlert("Please enter both players' names")
		} else if (doubles) {
			if ($("#name3").val() == "" || $("#name4").val() == "") {
				alerted = 1
				popAlert("Please enter all players' names")
			}
		}
		//if no alerts thrown then submit data
		if (alerted == 0) {
			//submit data
			clearPage();
		}
	}
	//throws an alert taking in the text to be displayed as parameter
	function popAlert(text){
		$ionicPopup.alert({
            title: 'Sorry',
            type: 'button-assertive',
            content: text
        })
	}
	//check wether the scores inputted are valid
	function checkValid(val, check) {
		//if some scores have not been entered
		if (check == undefined || val == undefined) {
			return "Please enter all scores"
		}
		// if any scores are equal
		if (check == val) {
			return "Scores cannot be equal"
		}
		//if either player has not reached 11
		if (check < 11 && val < 11) {
			return "One player must score at least 11"
		}
		//if one player is on 11 and the other is less than 10, don't check for <2 difference (note the exclamation point)
		if (!((val == 11 && check < 10) || (val < 10 && check == 11))) {
			var diff = Math.abs(val-check)
			if (diff<2) {
				return "One player must win by two clear points"
			} else if (diff > 2) {
				return "Players cannot win by more than two points"
			}
		}
		return 1
	}
	//clear the inputs on the page
	function clearPage() {
		$scope.scores = {}
		score1 = [0, 0, 0, 0, 0]
		score2 = [0, 0, 0, 0, 0]
		$("#dateInput").val("");
		$(".nameInput").val("");
		updateRounds();
		setDateInput();
	}
})

.controller('settingsCtrl', function($scope) {

})

.controller('filtersCtrl', function($scope) {

})