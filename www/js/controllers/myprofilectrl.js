starter.controller('myProfileCtrl', function($scope, $rootScope, $state, $ionicHistory) {
	
	$scope.$on('$ionicView.enter', function() {
		// get username and pass from localstorage
		var storedemail = $.parseJSON(localStorage.getItem("email"));
		var storedpass = $.parseJSON(localStorage.getItem("password"));
		// if no log in details found, go to log in page and disable back button, otherwise load user details
		if (storedemail == undefined && storedpass == undefined) {
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			// go to login page 
			$state.go('squashLevels.login');
		} else {
			getPlayerInfo($.parseJSON(localStorage["userData"]).data.playerid);
		}
	})

	// request playerinfo from cache
	function getPlayerInfo(playerid) {
		Cache.request("http://www.squashlevels.com/player_detail.php?player=" + playerid + "&format=json", displayPlayerData, function() {
			$("#msg").html("Error in AJAX request.");
		})
	}

    // draw chart through google charting lib
    google.charts.setOnLoadCallback(drawChart);

    // formats player chart data ready to be inputted 
    function formatChart(match) {
        if (match.dateint) {
            return [match.dateint, match.level_after];
        } else {
            return ["error", "", "", "", ""];
        }
    }

    // input chart data and draw levelhist chart
    function drawChart(chartData) {
        try {
            var data = new google.visualization.DataTable();
            // set data columns
            data.addColumn('date', 'date');
            data.addColumn('number', 'level');
            // input players chart data as rows
            for (var i = 0; i < chartData.length; i++) {
                date = new Date(chartData[i][0] * 1000);
                data.addRow([date, chartData[i][1]]);
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

            // function called on page resize redrawing the graph
            function resize() {
                var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
                chart.draw(data, options);
            }

            // resize graph on windows resize
            window.onload = resize();
            window.onresize = resize;
        }
        //throw error if chart fails
        catch (err) {
            // console.error("er: chart failure");
        }
    }

    // function to pull in player data and format it ready to display
    function displayPlayerData(data) {
        var data = $.parseJSON(data);

        // check data status is good
        if (data.status == "good" || data.status == "warn") {
            var id = data.data.summary.playerid;
            var name = data.data.summary.player;
            var level = data.data.statistics.end_level;
            var stats = data.data.statistics;

            // main player tab displays player name, level and rankings
            $("#tab-main").html(name);
            $("#level").html("Level: " + level);
            // display club ranking if player is in a club (-1 returned if not in a club)
            if(stats.club_pos >= 0) {
                $("#club_pos").html("Club Position: " + stats.club_pos);
            } else {
                $("#club_pos").html("Club Position: N/A");
            }
            // display county and country position
            $("#county_pos").html("County Position: " + stats.county_pos);
            $("#country_pos").html("Country Position: " + stats.country_pos);
            // display games, matches, points which are won and lost
            $("#m_won").html("Matches: <span class='green bold'>"+stats.matches_won+"<span>");
            $("#g_won").html("Games: <span class='green bold'>"+stats.games_won+"<span>");
            $("#p_won").html("Points: <span class='green bold'>"+stats.points_won+"<span>");
            $("#m_lost").html("Matches: <span class='red bold'>"+stats.matches_lost+"<span>");
            $("#g_lost").html("Games: <span class='red bold'>"+stats.games_lost+"<span>");
            $("#p_lost").html("Points: <span class='red bold'>"+stats.points_lost+"<span>");
            
            // push data for matches and charts to respective functions
            var matches = data.data.matches;
            var chartDataArray = [];
            for (var i = 0; i < matches.length; i++) {
                var c = formatChart(matches[i]);
                chartDataArray.push(c);
            }

            // list to store match results on player profiles   
            $scope.matches = [];
            // populating the list of past matches
            for (var i = 0; i < matches.length; i++) {
                // find scores of the games to find match winner
                var scores = matches[i].games_score.split("-");
                // player win displays green name, red otherwise
                var color = "red";
                if (scores[0] > scores[1]) {
                    color = "green";
                }
                // displays match opponent name and scare in list
                $scope.matches[i] = {
                    name: matches[i].opponent,
                    score: matches[i].games_score,  
                    color: color,
                    index: i
                }
            }

            // hide loading button and display content
            $scope.$apply();
            $("#content3").show();
            $("#loading3").hide();

            // on match button press load matchdata page
            $scope.load = function(index) {
                $rootScope.matchindex = index;
                $rootScope.matchId = $.parseJSON(localStorage["userData"]).data.playerid;
                $state.go('squashLevels.matchData');
            }   

            // hide loading button show results tab and draw chart
            $("#loading5").hide();
            $("#results").show();
            $("#tab-main").html(drawChart(chartDataArray));
        } else {
            //throw error if poor data status
            $("#loading5").hide();
            $("#msg").html("Error - " + data.user_message);
        }
    }
})