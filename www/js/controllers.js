/* Load in google charts library for level history charts */
google.charts.load('current', {
	packages: ['corechart']
});


angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, $rootScope, $state, $ionicHistory, $window) {
	Cache.initialize();
	//604800000 milliseconds in a week
	Cache.clean(604800000);
	$scope.loginPage = "Login"
	$ionicHistory.nextViewOptions({
	    disableBack: true
	});

	var storedemail;
	var storedpass;

	$scope.$on('$ionicView.enter', function () {
		storedemail = $.parseJSON(localStorage.getItem("email"))
		storedpass = $.parseJSON(localStorage.getItem("password"))
		// console.log(storedemail,storedpass)
		if (storedemail != undefined || storedpass != undefined) {
			login(storedemail, storedpass)
		}
	})

	// pass = "uniapp"
	// 0094539787173fdbc36ecf1c1827193a
	// email = "app.developer@bristol.ac.uk"

	function login(email, pass) {
		//store password and email in local storage (like cookies)
		if (storedemail == undefined) {
			localStorage["email"] = JSON.stringify(email);
		}
		if (storedpass == undefined) {
			localStorage["password"] = JSON.stringify(pass);
		}

		Cache.request("http://www.squashlevels.com/info.php?action=login&email=" + email + "&password=" + pass + "&stay_logged_in=1&format=json", loadUserData, function() {
			$("#msg").html("Error - AJAX failed")
		})
	}

	function loadUserData(data) {
		data = $.parseJSON(data);
		if (data.status == "good") {
			localStorage["userData"] = JSON.stringify(data);
			$state.go('squashLevels.myProfile')
		} else {
			$("#msg").html("Sorry, incorrect email or password")
		}
	}

	$scope.loginTap = function() {
		var email = $("#emailId").val();
		var pass = $("#passId").val();
		//converts pass to md5
		var passHash = CryptoJS.MD5(pass).toString();
		//store email and password in local storage
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		login(email, passHash);
	}
})

.controller('signupCtrl', function($scope) {

})

.controller('myProfileCtrl', function($scope, $rootScope, $state, $ionicHistory) {
	

	$scope.$on('$ionicView.enter', function() {
		// get username and pass from localstorage
		var storedemail = $.parseJSON(localStorage.getItem("email"))
		var storedpass = $.parseJSON(localStorage.getItem("password"))
		console.log(storedemail,storedpass)
		// if no log in details found, go to log in page and disable back button, otherwise load user details
		if (storedemail == undefined && storedpass == undefined) {
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			// go to login page 
			$state.go('squashLevels.login');
		} else {
			getPlayerInfo($.parseJSON(localStorage["userData"]).data.playerid)
		}
	})

	// request playerinfo from cache
	function getPlayerInfo(playerid) {
		Cache.request("http://www.squashlevels.com/player_detail.php?player=" + playerid + "&format=json", displayProfile, function() {
			$("#msg").html("Error in AJAX request.");
		})
	}

	/* Draws chart */
    google.charts.setOnLoadCallback(drawChart);

    /* function to format a date with a UNIX time date input */
    function format_date(date_int) {
        // creates date object , *1000 as js uses ms
        var date = new Date(date_int * 1000);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        // return in desired format
        return day + '/' + month + '/' + year;
    }


    /* formats player chart data ready to be inputted */
    function chartData(match) {
        if (match.dateint) {
            return [match.dateint, match.level_after];
        } else {
            return ["error", "", "", "", ""];
        }
    }

    /* function to draw level history chart w/ Google charts library */
    function drawChart(chartdata) {
        try {
            var data = new google.visualization.DataTable();
            // set data columns
            data.addColumn('date', 'date');
            data.addColumn('number', 'level');
            // input players chart data as rows
            for (var i = 0; i < chartdata.length; i++) {
                date = new Date(chartdata[i][0] * 1000)
                data.addRow([date, chartdata[i][1]]);
            }
            // set chart options
            var options = {
                title: 'Level History',
                colors: ['blue'],
                legend: {
                    position: 'none'
                },
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
            /* function called on a window resize redrawing the chart */
            function resize() {
                var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
                chart.draw(data, options);
            }
            window.onload = resize();
            window.onresize = resize;

        }
        //throw error if chart fails
        catch (err) {
            // console.error("er: chart failure");
        }
    }

	function displayProfile(data) {
		var data = $.parseJSON(data);
		var playerData = $.parseJSON(localStorage["userData"])

        if (data.status == "good" || data.status == "warn") {

            var id = data.data.summary.playerid;
            var name = data.data.summary.player;
            var level = data.data.statistics.end_level;
            var stats = data.data.statistics;

            // main player tab displays player name, level and rankings
            $("#tab-main").html(name);
            $("#player_email").html("Email: " + playerData.data.email);

            // display player level
            $("#level").html("Level: " + level);
            // display club ranking if player is in a club (club_pos > 0)
            if(stats.club_pos >= 0) {
                $("#club_pos").html("Club Position: " + stats.club_pos);
            } else {
                $("#club_pos").html("Club Position: N/A")
            }
            // display county and country position
            $("#county_pos").html("County Position: " + stats.county_pos);
            $("#country_pos").html("Country Position: " + stats.country_pos);

            // displays games, matches, points which are won and lost
            $("#m_won").html("Matches: <span class='green bold'>"+stats.matches_won+"<span>")
            $("#g_won").html("Games: <span class='green bold'>"+stats.games_won+"<span>")
            $("#p_won").html("Points: <span class='green bold'>"+stats.points_won+"<span>")
            $("#m_lost").html("Matches: <span class='red bold'>"+stats.matches_lost+"<span>")
            $("#g_lost").html("Games: <span class='red bold'>"+stats.games_lost+"<span>")
            $("#p_lost").html("Points: <span class='red bold'>"+stats.points_lost+"<span>")

            // push data for matches and charts to respective functions
            var matches = data.data.matches;
            var matchdata = [];
            var chartdata = [];
            for (var i = 0; i < matches.length; i++) {
                var c = chartData(matches[i]);
                chartdata.push(c);
            }

            // list to store match results on player profiles   
            $scope.matches = [];
            //populating the list of past matches
            for (var i = 0; i < matches.length; i++) {
                // find scores of the games, to work out who won
                var scores = matches[i].games_score.split("-");
                // console.log(matches[i]);
                var color = "red";
                // if they won then make it green, else stays red
                if (scores[0] > scores[1]) {
                    color = "green";
                }
                // add match outcome in the list and perhaps level change   
                console.log(matches[i].games_score);    


                $scope.matches[i] = {
                    name: matches[i].opponent,
                    score: matches[i].games_score,  
                    color: color,
                    index: i
                }
            }
            $scope.$apply();

            $("#content3").show();
            $("#loading3").hide();

            

            $scope.load = function(index) {
                $rootScope.matchindex = index;
                        $rootScope.matchId = $.parseJSON(localStorage["userData"]).data.playerid;
                $state.go('squashLevels.matchData');
            }   

            $("#loading5").hide();
            $("#results").show();
            $("#tab-main").html(drawChart(chartdata));
        } else {
            $("#loading5").hide();
            $("#msg").html("Error - " + data.user_message);
        }

	}
})



.controller('findCtrl', function($scope, $rootScope, $state) {
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
		var proxy = "https://cors-anywhere.herokuapp.com/";
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


.controller('rankingsCtrl', function($scope, $rootScope, $state) {

	//fires when page is loaded for the first time
	$scope.$on('$ionicView.loaded', function () {
		changeHiddenInput();
	})

	//When search buttton is pressed, hide results, reload data, hide filters
	$scope.onTap = function() {
		$("#msg").empty();
		$("#loading4").show();
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

			$scope.players = [];
			//populate rank list with data (Position - Name - Level)
			for (var i = 0; i < rankData.length; i++) {
				var info = rankData[i];
				$scope.players[i] = {
				    name: info.position + ". " + info.player,
				    level: info.level,
				    id: info.playerid
				};
				
			}
			
			$("#ranklist").players;
			$("#loading4").hide();
			$("#tabs").show();
		} else {
			$("#msg").html("Error - No results for your query");
		}
	}

	$scope.tapped = function(id) {
		console.log(id);
		$rootScope.tapped = id
		$state.go('squashLevels.playerProfiles')
	}

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


})

.controller('customMatchCtrl', function($scope, $ionicPopup) {

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

.controller('settingsCtrl', function($scope, $state, $ionicHistory, $rootScope) {
	$ionicHistory.nextViewOptions({
		disableBack: true
	});
	// when cache clear button is pressed
	$scope.clearCache = function() {
		// from start of time clear cache
		Cache.clean(315360000000);
		$("#message").html("Cache emptied")
		setTimeout(function() {
			$("#message").empty()
		}, 3000);
	}
	// when logging out, delete saved details
	$scope.logout = function() {
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("userData");
		$state.go('squashLevels.login')
	}
})


/* Controller for all player profiles */
.controller('playerProfilesCtrl', function($scope, $rootScope, $state) {

	/* Load page when player link is tapped and make request to cache */
	$scope.$on('$ionicView.enter', function() {
		var playerid = $rootScope.tapped
		console.log(playerid)
		Cache.request("http://www.squashlevels.com/player_detail.php?player=" + playerid + "&show=last10&format=json", display, function() {
			$("#msg").html("Error in AJAX request.");
		})
	});


	/* Draws chart */
	google.charts.setOnLoadCallback(drawChart);

	/* function to format a date with a UNIX time date input */
	function format_date(date_int) {
		// creates date object in, *1000 as js uses ms
		var date = new Date(date_int * 1000);
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		// return in desired format
		return day + '/' + month + '/' + year;
	}


	/* formats player chart data ready to be inputted */
	function chartData(match) {
		if (match.dateint) {
			return [match.dateint, match.level_after];
		} else {
			return ["error", "", "", "", ""];
		}
	}

	/* function to draw level history chart w/ Google charts library */
	function drawChart(chartdata) {
		try {
			var data = new google.visualization.DataTable();
			// set data columns
			data.addColumn('date', 'date');
			data.addColumn('number', 'level');
			// input players chart data as rows
			for (var i = 0; i < chartdata.length; i++) {
				date = new Date(chartdata[i][0] * 1000)
				data.addRow([date, chartdata[i][1]]);
			}
			// set chart options
			var options = {
				title: 'Level History',
				colors: ['blue'],
				legend: {
					position: 'none'
				},
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
			/* function called on a window resize redrawing the chart */
			function resize() {
				var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
				chart.draw(data, options);
			}
			window.onload = resize();
			window.onresize = resize;

		}
		//throw error if chart fails
		catch (err) {
			// console.error("er: chart failure");
		}
	}

	/* function to display player data */
	function display(data) {
		var data = $.parseJSON(data);
		// check data status is good
		console.log(data)
		if (data.status == "good" || data.status == "warn") {

			var id = data.data.summary.playerid;
			var name = data.data.summary.player;
			var level = data.data.statistics.end_level;
			var stats = data.data.statistics;

			// main player tab displays player name, level and rankings
			$("#tab-main").html(name);

			// display player level
			$("#level").html("Level: " + level);
			// display club ranking if player is in a club (club_pos > 0)
			if(stats.club_pos >= 0) {
				$("#club_pos").html("Club Position: " + stats.club_pos);
			} else {
				$("#club_pos").html("Club Position: N/A")
			}
			// display county and country position
			$("#county_pos").html("County Position: " + stats.county_pos);
			$("#country_pos").html("Country Position: " + stats.country_pos);

			// displays games, matches, points which are won and lost
			$("#m_won").html("Matches: <span class='green bold'>"+stats.matches_won+"<span>")
			$("#g_won").html("Games: <span class='green bold'>"+stats.games_won+"<span>")
			$("#p_won").html("Points: <span class='green bold'>"+stats.points_won+"<span>")
			$("#m_lost").html("Matches: <span class='red bold'>"+stats.matches_lost+"<span>")
			$("#g_lost").html("Games: <span class='red bold'>"+stats.games_lost+"<span>")
			$("#p_lost").html("Points: <span class='red bold'>"+stats.points_lost+"<span>")

			// push data for matches and charts to respective functions
			var matches = data.data.matches;
			var matchdata = [];
			var chartdata = [];
			for (var i = 0; i < matches.length; i++) {
				var c = chartData(matches[i]);
				chartdata.push(c);
			}

			// list to store match results on player profiles	
			$scope.matches = []
			//populating the list of past matches
			for (var i = 0; i < matches.length; i++) {
				// find scores of the games, to work out who won
				var scores = matches[i].games_score.split("-")
				// console.log(matches[i]);
				var color = "red"
				// if they won then make it green, else stays red
				if (scores[0] > scores[1]) {
					color = "green"
				}
				// add match outcome in the list and perhaps level change	
				console.log(matches[i].games_score);	
				$scope.matches[i] = {
					name: matches[i].opponent,
					score: matches[i].games_score,	
					color: color,
					index: i
				}
			}
			$scope.$apply()
			$("#content3").show()
			$("#loading3").hide()

			$scope.load = function(index) {
				$rootScope.matchindex = index
				$rootScope.matchId = $rootScope.tapped
				$state.go('squashLevels.matchData')
			}	

			$("#loading5").hide();
			$("#results").show();
			$("#tab-main").html(drawChart(chartdata));
		} else {
			$("#loading5").hide();
			$("#msg").html("Error - " + data.user_message);
		}
	}
})

.controller('matchDataCtrl', function($scope, $rootScope) {

	$scope.$on('$ionicView.enter', function () {
		var playerid = $rootScope.matchId;
		Cache.request("http://www.squashlevels.com/player_detail.php?player=" + playerid + "&format=json", displayMatch, function() {
			$("#msg").html("Error in AJAX request.");
		})
	});

	/* function to calculate percentage change between levels */
	function percChange(lev_before, lev_after) {
		var change = ((lev_after - lev_before) / lev_before) * 100;
		if (change >= 0) {
			return "+" + Number(change).toFixed(2) + "%";
		} else {
			return Number(change).toFixed(2) + "%";
		}
	}

	function displayMatch(data) {
		data = $.parseJSON(data);
		var index = $rootScope.matchindex;
		var thisMatch = data.data.matches[index];
		console.log(data.data.summary.player);
		var playerName = data.data.summary.player;
		var matchDate = new Date(thisMatch.dateint * 1000);
		var month = matchDate.getMonth() + 1;
		matchDate = matchDate.getDate() + "/" + month + "/" + matchDate.getFullYear();


		var plyrLevelChange = percChange(thisMatch.level_before, thisMatch.level_after);
		var oppLevelChange = percChange(thisMatch.opponent_level_before, thisMatch.opponent_level_after);



		$("#positionbefore").parent().show();
		$("#positionafter").parent().show();
		$("#opppositionbefore").parent().hide();
		$("#opppositionafter").parent().hide();
		$("#opppos").hide();

		if (thisMatch.matchtype == undefined) {
			$("#league").html(thisMatch.leaguetype);
		} else {
			$("#league").html(thisMatch.matchtype);
		}
		$("#date").html(matchDate);



		$("#yourname").html(playerName);
		if(thisMatch.club == undefined) {
			$("#yourclub").html(thisMatch.team);
		} else {
			$("#yourclub").html(thisMatch.club);
		}
		if (thisMatch.position_before == -1 || thisMatch.position_after == -1) {
			$("#positionbefore").parent().hide();
			$("#positionafter").parent().hide();
			$("#pos").hide();
		} else {
			$("#positionbefore").html(thisMatch.position_before);
			$("#positionafter").html(thisMatch.position_after);
		}
		$("#levelbefore").html(thisMatch.level_before);
		$("#levelafter").html(thisMatch.level_after);
		$("#levelchange").html(plyrLevelChange);



		$("#oppname").html(thisMatch.opponent);
		if (thisMatch.opponent_club == undefined) {
			$("#oppclub").html(thisMatch.opponent_team);
		} else {
			$("#oppclub").html(thisMatch.opponent_club);
		}
		if (thisMatch.opponent_position_after == -1 || thisMatch.opponent_position_after == -1) {
			$("#opppositionbefore").parent().hide();
			$("#opppositionafter").parent().hide();
			$("#opppos").hide();
		} else {
			$("#opppositionbefore").html(thisMatch.opponent_position_before);
			$("#opppositionafter").html(thisMatch.opponent_position_after);
		}
		$("#opplevelbefore").html(thisMatch.opponent_level_before);
		$("#opplevelafter").html(thisMatch.opponent_level_after);
		$("#opplevelchange").html(oppLevelChange);

		var points = thisMatch.points_scores.split(",");
		$("#scores").empty();
		for (var n = 0; n < points.length; n++) {
			var scores = points[n].split("-");
			if (scores[0] > scores[1]) {
				$("#scores").append("<div class='col c' style='font-weight: bold; color:green'>" + points[n] + "</div>");
			} else {
				$("#scores").append("<div class='col c' style='font-weight: bold; color:red'>" + points[n] + "</div>");
			}
		}

		var games = thisMatch.games_score.split("-");
		$("#gamepoints").html("<h1 style='color: green; margin-bottom:0px'>" + games[0] + " - " + games[1] + "</h1>");


		$("#content2").show();
		$("#loading2").hide();
	}

})

.controller('sideMenuCtrl', function($scope, $rootScope) {
	var storedemail;
	var storedpass;
	$scope.$on('$ionicView.enter', function () {
		storedemail = $.parseJSON(localStorage.getItem("email"));
		storedpass = $.parseJSON(localStorage.getItem("password"));
		if (storedemail != undefined && storedpass != undefined) {
			$('#menulogin').hide();
		} else {
			$('#menulogin').show();
		}
	})
})