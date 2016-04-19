starter.controller('matchDataCtrl', function($scope, $rootScope) {

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