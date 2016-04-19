starter.controller('myProfileCtrl', function($scope, $rootScope, $state, $ionicHistory) {
	

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