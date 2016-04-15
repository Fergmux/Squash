var square = function(num){
	if(typeof num != 'number') return "not number"
	return num*num
}


function login() {
		//gets email and password on login tap
		/*var user = $("#emailId").val();
		var pass = $("#passId").val()
		
		pass = "uniapp"
		user = "app.developer@bristol.ac.uk"

		//converts pass to md5
		var passHash = CryptoJS.MD5(pass).toString();


		
		* info.php
		* email stored under Session: [un]
		* password stored under Session: [uns]
		* url: http://www.badsquash.co.uk/info.php?action=login&email=<email address>&password=<MD5 of the password>&stay_logged_in=1&format=json 
		

		// "http://www.badsquash.co.uk/info.php?action=login&email="+email+"&password="+passHash+"&stay_logged_in=1&format=json"
		$.post("http://www.badsquash.co.uk/info.php?action=login&email="+user+"&password="+passHash+"&stay_logged_in=1&format=json",
				function(data){
					console.log(data)
					data = $.parseJSON(data);
					console.log(data);
					if (data.status == "good"){
						$rootScope.userData = data;
						$state.go('badSquash.myProfile')
					} else {
						$("#msg").html("Sorry, incorrect email or password")
					}
				}
			);


		// make post request to server with details
		// $.post('http://www.badsquash.co.uk/info.php', {action: 'login', email: user, password: passHash},
		// 		function(data){
		// 			console.log(data);
		// 		}
		// 	)*/
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

//$scope.loginTap = function() {
	function loginTap() {
	login();
	//console.log("tap");
	}

	function getPlayerInfo(playerid) {
		//Cache.request("http://www.badsquash.co.uk/player_detail.php?player=" + playerid + "&format=json", displayProfile, function() {
				//$("#msg").html("Error in AJAX request.");
			
	}


	function displayProfile(data) {
		data = $.parseJSON(data);
		var playerData = $.parseJSON(localStorage["userData"])

		//to display the date of maximum levels
		var highDate = new Date(data.data.statistics.max_level_dateint * 1000) //*1000 to convert to ms
		var month = highDate.getMonth() + 1 //month returned is 0-11 so +1
		var year = highDate.getFullYear().toString().split("") // get just last 2 characters of year (to save space, eg. 06 insted of 2006)
		year = year[2] + year[3]
		highDate = highDate.getDate() + "/" + month + "/" + year
		
		var lowDate = new Date(data.data.statistics.min_level_dateint * 1000)
		month = lowDate.getMonth() + 1
		year = lowDate.getFullYear().toString().split("")
		year = year[2] + year[3]
		lowDate = lowDate.getDate() + "/" + month + "/" + year
		$("#levels12").parent().show();
		//player name
		$("#playerName").val(data.data.summary.player)
		//player email
		$("#playerEmail").val(playerData.data.email)
		//player's current level
		$("#levelsnow").html(data.data.statistics.end_level)
		//player's inital level
		$("#levelsinitial").html(data.data.statistics.initial_level)
		//player's average level
		$("#levelsaverage").html(data.data.statistics.average_level_last4)
		$("#levelsaverageat").html(data.data.statistics.average_level_played_at_last4);
		//player's lowest level
		$("#levelsmin").html(data.data.statistics.min_level)
		//player's highest level
		$("#levelsmax").html(data.data.statistics.max_level)
		//player's lowest level date
		$("#levelsmindate").html(lowDate)
		//player's highest level date
		$("#levelsmaxdate").html(highDate)
		//player's position
		$("#playerPosition").val(playerData.data.lastposition)
		//level at start of season
		$("#levelsseason").html(data.data.statistics.season_level);
		//player's level 12 months ago
		if (data.data.statistics.level_12m_ago == -1) {
			$("#levels12").parent().hide();
		} else {
			$("#levels12").html(data.data.statistics.level_12m_ago);
		}


		$("#pointsplayed").html(data.data.statistics.points_won + data.data.statistics.points_lost);
		$("#pointswon").html(data.data.statistics.points_won);
		$("#pointslost").html(data.data.statistics.points_lost);
		if (data.data.statistics.points_win_ratio > 0.5) {
			$("#pointsratio").css("color", "green")
		} else {
			$("#pointsratio").css("color", "red")
		}
		$("#pointsratio").html(data.data.statistics.points_win_ratio);

		$("#gamesplayed").html(data.data.statistics.games_won + data.data.statistics.games_lost);
		$("#gameswon").html(data.data.statistics.games_won);
		$("#gameslost").html(data.data.statistics.games_lost);
		if (data.data.statistics.games_win_ratio > 0.5) {
			$("#pointsratio").css("color", "green")
		} else {
			$("#pointsratio").css("color", "red")
		}
		$("#gamesratio").html(data.data.statistics.games_win_ratio);

		$("#matchesplayed").html(data.data.statistics.matches_won + data.data.statistics.matches_lost);
		$("#matcheswon").html(data.data.statistics.matches_won);
		$("#matcheslost").html(data.data.statistics.matches_lost);
		if (data.data.statistics.matches_win_ratio > 0.5) {
			$("#pointsratio").css("color", "green")
		} else {
			$("#pointsratio").css("color", "red")
		}
		$("#matchesratio").html(data.data.statistics.matches_win_ratio);

		var overallchange = (((data.data.statistics.end_level / data.data.statistics.initial_level).toFixed(2) * 100) - 100)
		var last12 = ((data.data.statistics.level_change_last_12m.toFixed(2) * 100) - 100)
		var lastmatch = ((data.data.statistics.level_change_last_match.toFixed(2) * 100) - 100)
		var thisseason = ((data.data.statistics.level_change_this_season.toFixed(2) * 100) - 100)

		if (overallchange > 0) {
			$("#levelchangeoverall").css("color", "green");
			$("#levelchangeoverall").html("+" + overallchange + "%");
		} else {
			$("#levelchangeoverall").css("color", "red");
			$("#levelchangeoverall").html(overallchange + "%");
		}
		if (last12 > 0) {
			$("#levelchange12").css("color", "green");
			$("#levelchange12").html("+" + last12 + "%");
		} else {
			$("#levelchange12").css("color", "red");
			$("#levelchange12").html(last12 + "%");
		}
		if (lastmatch > 0) {
			$("#levelchangelast").css("color", "green");
			$("#levelchangelast").html("+" + lastmatch + "%");
		} else {
			$("#levelchangelast").css("color", "red");
			$("#levelchangelast").html(lastmatch + "%");
		}
		if (thisseason > 0) {
			$("#levelchangeseason").css("color", "green");
			$("#levelchangeseason").html("+" + thisseason + "%");
		} else {
			$("#levelchangeseason").css("color", "red");
			$("#levelchangeseason").html(thisseason + "%");
		}

		$scope.matches = []
		//populating the list of past matches
		for (var i = 0; i < data.data.matches.length; i++) {
			// find scores of the games, to work out who won
			var scores = data.data.matches[i].games_score.split("-")
			var color = "red"
			// if they won then make it green, else stays red
			if (scores[0] > scores[1]) {
				color = "green"
			}
			$scope.matches[i] = {
				name: data.data.matches[i].opponent,
				color: color,
				index: i
			}
		}
		$scope.$apply()

		$("#content3").show()
		$("#loading3").hide()

	}


	
	function load (index) {
		$rootScope.matchindex = index
		$state.go('squashLevels.matchData')
	}


	function getKey() {
		var time = new Date().getTime()/1000;
		return Math.round(Math.sqrt(time * 100) - 100);
	}

	function createAutoList(data) {
		var playersArray = []
		data = $.parseJSON(data);
		for (var i = 0; i < data.data.length; i++) {
			playersArray[i] = data.data[i].player;
		}
		// console.log(playersArray);

		$("#char_press").autocomplete({
			source: playersArray,
			minLength: 2,
			delay: 1000
		})

	}

	function createPlayerIdArray(data) {
		var playerIds = []
		data = $.parseJSON(data);
		for(var i = 0; i < data.data.length; i++) {
			playerIds[i] = data.data[i].playerid;
		}
		playerIdLookup = playerIds;
		$("#loading1").hide();
	}

	function loadPlayerList(search_string) {
		var key = "&key=" + getKey();
		var search = "&name=" + search_string;
		var proxy = "https://crossorigin.me/";
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


	function onTap () {
		$("#msg").empty();
		$("#loading4").show();
		changeHiddenInput();
		$("#filters").slideToggle('slow');
	}

	//when filters button is pressed toggle filters
	function toggleFilters() {
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
				    name: info.position + ". " + info.player + " - " + info.level,
				    id: info.playerid
				};
			}
			$scope.$apply();
			$("#loading4").hide();
			$("#tabs").show();
		} else {
			$("#msg").html("Error - No results for your query");
		}
	}

	function tapped(id) {
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


	function setDateInput() {
		//get current date
		var currentTime = new Date();
		//convert date to ISO
		currentTime = currentTime.toISOString()
		//convert date string to dattime input format
		currentTime = currentTime.substring(0, 16)
		$("#dateInput").val(currentTime)
	}

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
		// Cache.request("http://www.squashlevels.com/players.php?&all=&key="+key+"&perpage=-1&format=json", makePlayerArray, function() {
		// 	$("#msg").html("Error - AJAX failed")
		// })
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

	function check1Score() {
		if(scores["1a"] > scores["1b"]) {
			score1[0] = 1
			score2[0] = 0
		} else {
			score1[0] = 0
			score2[0] = 1
		}
		if(scores["1a"] == undefined) {
			score1[0] = 0
			score2[0] = 1
		}
		if(scores["1b"] == undefined) {
			score1[0] = 1
			score2[0] = 0
		}
		updateRounds();
	}

		function check2Score() {
		if(scores["2a"] > scores["2b"]) {
			score1[1] = 1
			score2[1] = 0
		} else {
			score1[1] = 0
			score2[1] = 1
		}
		if(scores["2a"] == undefined) {
			score1[1] = 0
			score2[1] = 1
		}
		if(scores["2b"] == undefined) {
			score1[1] = 1
			score2[1] = 0
		}
		updateRounds();
	}

	function check3Score() {
		if(scores["3a"] > scores["3b"]) {
			score1[2] = 1
			score2[2] = 0
		} else {
			score1[2] = 0
			score2[2] = 1
		}
		if(scores["3a"] == undefined) {
			score1[2] = 0
			score2[2] = 1
		}
		if(scores["3b"] == undefined) {
			score1[2] = 1
			score2[2] = 0
		}
		updateRounds();
	}
	function check4Score() {
		if(scores["4a"] > scores["4b"]) {
			score1[3] = 1
			score2[3] = 0
		} else {
			score1[3] = 0
			score2[3] = 1
		}
		if(scores["4a"] == undefined) {
			score1[3] = 0
			score2[3] = 1
		}
		if(scores["4b"] == undefined) {
			score1[3] = 1
			score2[3] = 0
		}
		updateRounds();
	}
	function check5Score() {
		if(scores["5a"] > scores["5b"]) {
			score1[4] = 1
			score2[4] = 0
		} else {
			score1[4] = 0
			score2[4] = 1
		}
		if(scores["5a"] == undefined) {
			score1[4] = 0
			score2[4] = 1
		}
		if(scores["5b"] == undefined) {
			score1[4] = 1
			score2[4] = 0
		}
		updateRounds();
	}

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

	function submitScores()	 {
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

	function popAlert(text) {
		$ionicPopup.alert({
            title: 'Alert',
            type: 'button-assertive',
            content: text
        })
	}

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

function clearCache() {
		Cache.clean(315360000000);
		$("#message").html("Cache emptied")
		setTimeout(function() {
			$("#message").empty()
		}, 3000);
	}

function logout() {
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("userData");
		$state.go('squashLevels.login')
	}

function percChange(lev_before, lev_after) {
		var change = ((lev_after - lev_before) / lev_before) * 100;
		if (change >= 0) {
			return "+" + Number(change).toFixed(2) + "%";
		} else {
			return Number(change).toFixed(2) + "%";
		}
	}

function format_date(date_int) {
		// creates date object in, *1000 as js uses ms
		var date = new Date(date_int);
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		// return in desired format
		return day + '/' + month + '/' + year;
	}

function readmatch(match) {
		if (match.leaguetypeid) {
			return [format_date(match.dateint), match.opponent, match.games_score, match.level_before, percChange(match.level_before, match.level_after)];
		} else {
			if (match.matchtypeid) {
				return [format_date(match.dateint), match.opponent, match.games_score, match.level_before, percChange(match.level_before, match.level_after)];
			} else {
				// something went wrong
				return ["error", "", "", "", ""];
			}
		}
	}

function chartData(match) {
		if (match.dateint) {
			return [match.dateint, match.level_after];
		} else {
			return ["error", "", "", "", ""];
		}
	}


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
		}
	}

	function display(data) {
		var data = $.parseJSON(data);
		// check data status is good
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
				var t = readmatch(matches[i]);
				var c = chartData(matches[i]);
				matchdata.push(t);
				chartdata.push(c);
			}

			// define jQuery table columns
			$("#dtable").dataTable({
				data: matchdata,
				"bDestroy": true,
				columns: [{
					title: "Date"
				}, {
					title: "Opponent"
				}, {
					title: "Score"
				}, {
					title: "Level before"
				}, {
					title: "Level Change"
				}]
			});

			$("#loading5").hide();
			$("#results").show();
			$("#tab-main").html(drawChart(chartdata));
		} else {
			$("#loading5").hide();
			$("#msg").html("Error - " + data.user_message);
		}
	}

	function displayMatch(data) {
		data = $.parseJSON(data);
		var index = $rootScope.matchindex
		var thisMatch = data.data.matches[index]
		var matchDate = new Date(thisMatch.dateint * 1000)
		var month = matchDate.getMonth() + 1
		matchDate = matchDate.getDate() + "/" + month + "/" + matchDate.getFullYear()

		$("#positionbefore").parent().show();
		$("#positionafter").parent().show();
		$("#opppositionbefore").parent().hide();
		$("#opppositionafter").parent().hide();
		$("#opppos").hide();

		if (thisMatch.matchtype == undefined) {
			$("#league").html(thisMatch.leaguetype)
		} else {
			$("#league").html(thisMatch.matchtype)
		}
		$("#date").html(matchDate)



		$("#yourname").html($.parseJSON(localStorage["userData"]).data.tempname)
		if(thisMatch.club == undefined) {
			$("#yourclub").html(thisMatch.team)
		} else {
			$("#yourclub").html(thisMatch.club)
		}
		if (thisMatch.position_before == -1 || thisMatch.position_after == -1) {
			$("#positionbefore").parent().hide();
			$("#positionafter").parent().hide();
			$("#pos").hide();
		} else {
			$("#positionbefore").html(thisMatch.position_before)
			$("#positionafter").html(thisMatch.position_after)
		}
		$("#levelbefore").html(thisMatch.level_before)
		$("#levelafter").html(thisMatch.level_after)



		$("#oppname").html(thisMatch.opponent)
		if (thisMatch.opponent_club == undefined) {
			$("#oppclub").html(thisMatch.opponent_team)
		} else {
			$("#oppclub").html(thisMatch.opponent_club)
		}
		if (thisMatch.opponent_position_after == -1 || thisMatch.opponent_position_after == -1) {
			$("#opppositionbefore").parent().hide();
			$("#opppositionafter").parent().hide();
			$("#opppos").hide();
		} else {
			$("#opppositionbefore").html(thisMatch.opponent_position_before)
			$("#opppositionafter").html(thisMatch.opponent_position_after)
		}
		$("#opplevelbefore").html(thisMatch.opponent_level_before)
		$("#opplevelafter").html(thisMatch.opponent_level_after)

		var points = thisMatch.points_scores.split(",");
		$("#scores").empty();
		for (var n = 0; n < points.length; n++) {
			var scores = points[n].split("-")
			if (scores[0] > scores[1]) {
				$("#scores").append("<div class='col c' style='font-weight: bold; color:green'>" + points[n] + "</div>")
			} else {
				$("#scores").append("<div class='col c' style='font-weight: bold; color:red'>" + points[n] + "</div>")
			}
		}

		var games = thisMatch.games_score.split("-")
		$("#gamepoints").html("<h1 style='color: green; margin-bottom:0px'>" + games[0] + " - " + games[1] + "</h1>")


		$("#content2").show()
		$("#loading2").hide()
	}
