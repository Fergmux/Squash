starter.controller('matchDataCtrl', function($scope, $rootScope) {

	$scope.$on('$ionicView.enter', function () {
		// get match id defined on previous page
		var playerid = $rootScope.matchId;
		Cache.request("http://www.squashlevels.com/player_detail.php?player=" + playerid + "&format=json", displayMatch, function() {
			$("#msg").html("Error in AJAX request.");
		})
	});

	// function to calculate percentage change between levels
	function percChange(levBefore, levAfter) {
		var change = ((levAfter - levBefore) / levBefore) * 100;
		if (change >= 0) {
			return "+" + Number(change).toFixed(2) + "%";
		} else {
			return Number(change).toFixed(2) + "%";
		}
	}

	function displayMatch(data) {
		data = $.parseJSON(data);
		var index = $rootScope.matchindex;
		var thisMatch = data.data.matches[index]; // get the data for this specific match
		var playerName = data.data.summary.player;
		console.log(playerName);

		// calculate the date of the match
		var matchDate = new Date(thisMatch.dateint * 1000);
		var month = matchDate.getMonth() + 1;
		matchDate = matchDate.getDate() + "/" + month + "/" + matchDate.getFullYear();

		var playerLevelChange = percChange(thisMatch.level_before, thisMatch.level_after);
		var oppLevelChange = percChange(thisMatch.opponent_level_before, thisMatch.opponent_level_after);

		// if there is no match type deifned, display league type, otherwise display match type
		if (thisMatch.matchtype == undefined) {
			$("#league").html(thisMatch.leaguetype);
		} else {
			$("#league").html(thisMatch.matchtype);
		}

		// display date and player names
		$("#date").html(matchDate);
		$("#yourname").html(playerName);
		$("#oppname").html(thisMatch.opponent);

		// if club is not defined siplay team, else display club
		if(thisMatch.club == undefined) {
			$("#yourclub").html(thisMatch.team);
		} else {
			$("#yourclub").html(thisMatch.club);
		}
		if (thisMatch.opponent_club == undefined) {
			$("#oppclub").html(thisMatch.opponent_team);
		} else {
			$("#oppclub").html(thisMatch.opponent_club);
		}

		// if either posityion before or after is invalid (-1), hide the position display box
		if (thisMatch.position_before == -1 || thisMatch.position_after == -1) {
			$("#positionbefore").parent().hide();
			$("#positionafter").parent().hide();
			$("#pos").hide();
		} else {
			$("#positionbefore").html(thisMatch.position_before);
			$("#positionafter").html(thisMatch.position_after);
		}
		if (thisMatch.opponent_position_after == -1 || thisMatch.opponent_position_after == -1) {
			$("#opppositionbefore").parent().hide();
			$("#opppositionafter").parent().hide();
			$("#opppos").hide();
		} else {
			$("#opppositionbefore").html(thisMatch.opponent_position_before);
			$("#opppositionafter").html(thisMatch.opponent_position_after);
		}

		// display level before, after and change
		$("#levelbefore").html(thisMatch.level_before);
		$("#levelafter").html(thisMatch.level_after);
		$("#levelchange").html(playerLevelChange);
		$("#opplevelbefore").html(thisMatch.opponent_level_before);
		$("#opplevelafter").html(thisMatch.opponent_level_after);
		$("#opplevelchange").html(oppLevelChange);

		// display the scores of each game
		$("#scores").empty();
		var points = thisMatch.points_scores.split(",");
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