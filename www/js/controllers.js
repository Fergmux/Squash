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
	$("#tabs").hide();
	$scope.$on('$ionicView.loaded', function () {
		$("#tabs").hide();
		$("#loader").hide();
		loadplayers();
		loadlookup();
	})

	google.charts.load('current', {
		packages: ['corechart']
	});
	google.charts.setOnLoadCallback(drawChart);

	$scope.onTap = function() {
		$("#msg").empty();
		$("#tabs").hide();
		// $("#loader").show();
		var searchVal = $("#playerid").val()
		if(searchVal=="") {
			loadplayers();
		} else {
			load(searchVal);
		}
	}

	var idtable = new Object();

	function loadplayers() {
		Cache.request("http://www.badsquash.co.uk/players.php?leaguetype=1&format=json", displayplayers, function() {
				$("#msg").html("Error in AJAX request.");
			})
		}

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

	$scope.search = function(item) {
		var player = item.split("-")[1].trim()
		$("#playerid").val(player)
		load(player);
	}


	function readmatch(match) {
		if (match.leaguetypeid) {
			return ["League", match.opponent, match.games_score, match.level_before, match.level_after];
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
			$("#dtable").dataTable({
				data: matchdata,
				"bDestroy": true,
				columns: [{
					title: "Type"
				}, {
					title: "Opponent"
				}, {
					title: "Score"
				}, {
					title: "Level before"
				}, {
					title: "Level after"
				}]
			});
			$("#tab-main").html(drawChart(chartdata));
			$("#playerlist").hide();
			$("#loader").hide();
			$("#tabs").show();
		} else {
			$("#loader").hide();
			$("#msg").html("Error - " + data.user_message);
		}
	}

	function loadlookup(){
		Cache.request("http://www.badsquash.co.uk/players.php?&leaguetype=1&perpage=-1&format=json", makePlayerTable, function() {
			$("#msg").html("Error - id must be a number")
		})
	}

	function makePlayerTable(data) {
		data = $.parseJSON(data);
		for (x in data.data) {
			var playerid = data.data[x].playerid;
			var player = data.data[x].player.toLowerCase();
			idtable[player] = playerid;
		}
	}



	function load(name) {
		// $("#tabs").hide();
		// var name = $("#playerid").val();
		// let's make sure it's a number
		if (!/^[0-9]+$/.test(name)) {
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

	$scope.$on('$ionicView.loaded', function () {
		$("#tabs").hide();
		$("#loader").hide();
		$("#filters").hide();
		changeHiddenInput();
	})
	
	//Load button
	$scope.onTap = function() {
		$("#tabs").hide();
		$("#loader").show();
		$("#msg").empty();
		changeHiddenInput();
		$("#filters").slideToggle('slow');
	}

	$scope.toggleFilters = function() {
		$("#filters").slideToggle('slow');
	}

	//Displays the ranking as a table 
	function displayRank(rank) {
		$("#tabs").hide();
		$("#ranklist").empty();

		var rank = $.parseJSON(rank);
		console.log(rank)

		if (rank.status == "good") {

			var rankData = rank.data;

			$scope.groups = [];
			for (var i = 0; i < rankData.length; i++) {
				var info = rankData[i];
				$scope.groups[i] = {
				    name: info.position + " - " + info.player,
				    items: []
				};
				var date = new Date(info.lastmatch_date * 1000).toLocaleDateString();
				$scope.groups[i].items.push("Level: " + info.level);
				if (typeof info.club != 'undefined' && info.club != '') {
			    	$scope.groups[i].items.push("Club: " + info.club);
			    }
			    $scope.groups[i].items.push("Last Match: " + date);
			}
			$scope.$apply();
			$("#loader").hide();
			$("#tabs").show();
		} else {
			$("#loader").hide();
			$("#msg").html("Error - No results for your query");
		}
	}

	  /*
	   * if given group is the selected group, deselect it
	   * else, select the given group
	   */
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



	//Reads input from the drop-down list
	var select;
	$scope.onload = function() {
		select = document.getElementById('dropdown');
		console.log(select);
	}

	var county = "";
	var show = "";
	var agegroup = "";
	var gender = "";

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

	//This loads the data for desplaying rankings (renames it to loadRanking from loadteam-- there's another function called that)
	function loadRanking() {
		Cache.request("http://squashlevels.com/players.php?check=1&limit_confidence=1&club=" + clubs + "&county=" + county + "&country=" + country + "&show=" + show + "&events=" + events + "&matchtype=" + matchtype + "&playercat=" + agegroup + "&playertype=" + gender + "&search=Search+name&format=json", displayRank, function() {
				$("#msg").html("Error in AJAX request for rank");
			})
	}
})

.controller('teamsCtrl', function($scope) {

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

		//var attendance; 
		if (match.withdrawn == "false") {
			var attendance = 'Yes';
		} else {
			var attendance = 'No';
		}

		return [match.other_team.name, formatted_date, attendance];
	}



	function displayteam(teamdata) {
		console.log(teamdata)
		var data = $.parseJSON(teamdata);

		// var data = $.parseJSON(data.responseText);
		
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

			$("#team").show();
		}
	}


	function loadteam() {
		$("#team").hide();
		var teamid = $("#teamid").val();
		if (/^[0-9]+$/.test(teamid)) {
			Cache.request("http://www.badsquash.co.uk/team.php?team=" + teamid + "&format=json", displayteam, function() {
					$("#msg").html("Error in AJAX equest.");
				})
		} else {
			$("#msg").html("Error - id must be a number");
		}
	}


	$scope.onTap = function() {
		console.log("works")
		loadteam();
		console.log("poop")
	}

	function main() {
		$("#team").hide();
	}

	/* launch when page ready */
	$(main);

})

.controller('playersCtrl', function($scope) {

	load();

	function load() {
		Cache.request("http://www.badsquash.co.uk/players.php?leaguetype=1&format=json", display, function() {
				$("#msg").html("Error in AJAX request.");
			});
	}

	function display(data) {
		var data = $.parseJSON(data);
		$scope.items = []
		for (var i = 0; i < data.data.length; i++) {
			$scope.items.push(data.data[i].level + " - " + data.data[i].player)
		}
		$scope.$apply()
	}

})

.controller('settingsCtrl', function($scope) {

})

.controller('filtersCtrl', function($scope) {

})