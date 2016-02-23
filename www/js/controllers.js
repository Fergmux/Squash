angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('myProfileCtrl', function($scope) {

})
   
.controller('newMatchCtrl', function($scope) {

$("#tabs").hide();

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);

$scope.onTap = function () {
	console.log("works")
	$("#msg").empty();
	// $("#foo").append("bar");
	func();
	main();
}

function func() {
	console.log("function");
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

        for(var i = 0; i<chartdata.length; i++) {
            data.addRow([formatDate(chartdata[i][0]), chartdata[i][1]] );
        }
        var options = {
            title: 'Level History',
            colors: ['red'],
            hAxis: {
                format: 'd MMM yy',
                slantedText: true,
                slantedTextAngle: 60,
            //  showTextEver:,
            //  ticks:, 
                textStyle: {fontSize: 8}
            },
            vAxis: {
                baseline: 0
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
        chart.draw(data, options);
    }
    catch(err) {
        console.log("err: Empty chart_data");
    }
}

function chartData(match) {
    if(match.dateint) {
        return [match.dateint, match.level_after];    
    } else {
        return ["error", "", "", "", ""];
    }
}


/**
* TODO: remove; change formatting to inside drawChart method
*/
function formatDate(dateint) {
    var date = new Date(dateint * 1000);
    // var monthNames = [
    // "Jan", "Feb", "Mar", "Apr", "May",
    // "Jun", "Jul", "Aug", "Sep", "Oct",
    // "Nov", "Dec"
    // ];
    // var day = date.getDate();
    // var month = date.getMonth();
    // var year = date.getFullYear();

    // var formatted_date = new Date(String(day) + " " + monthNames[month] + " " + String(year));
    return date;
}

function display(data) {
    var data = $.parseJSON(data);
    if (data.status == "good") {
        var id = data.data.summary.playerid;
        var name = data.data.summary.player;

        $("#tab-main").html("Player: " + name);

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
            columns: [
                {title: "Type"},
                {title: "Opponent"},
                {title: "Score"},
                {title: "Level before"},
                {title: "Level after"}
            ]
        });

        // $("#tabs").tabs();
        $("#tab-main").html(drawChart(chartdata));
        $("#tabs").show();
        // $("#msg").html("Success, loaded data for player " + id);
    } else {
        $("#msg").html("Error - " + data.user_message);
    }
}

function load() {
    // $("#tabs").hide();
    var id = $("#playerid").val();
    // let's make sure it's a number
    if (/^[0-9]+$/.test(id)) {
        var data = $.ajax({
            url: "http://www.badsquash.co.uk/player_detail.php?player=" + id + "&format=json",
        }).done(display)
          .fail(function() {
              $("#msg").html("Error in AJAX request.");
          });
    } else {
        $("#msg").html("Error - id must be a number");
    }
}

function main() {
    $("#tabs").hide();

    // $("#playerid").button();
    load();
    // $("#loadbutton").button().click(load);

}

/* launch when page ready */
// $(main);

})
   
.controller('pastMatchesCtrl', function($scope) {

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

function read_team_match(match){
    var seconds = match.dateint;
    var date = new Date(seconds * 1000);
    var formatted_date = format_date(date);

    //var attendance; 
    if (match.withdrawn == "false"){
        var attendance = 'Yes';
    }
    else {
        var attendance = 'No';
    }

    return[match.other_team.name, formatted_date, attendance];
}



function displayteam(teamdata){
    var data = $.parseJSON(teamdata);
    if (data.status == "good") {
        var name = data.data.captain;
        var contact = data.data.contact;
        $("#team_name").html("Captain: " + name + "Contact Number: " + contact);

        var team_matches = data.data.matches;
        var team_matchdata = [];
        for (var i = 0; i < team_matches.length; i++) {
            var t = read_team_match(team_matches[i]);
            team_matchdata.push(t);
        }
        $("#dteamtable").DataTable({
            data: team_matchdata,
            columns: [
                {title: "Opponent"},
                {title: "Date"},
                {title: "Availible"},
            ]
        });

        $("#team").show();
        $("#form").hide();

    }

}


function loadteam() { 
    $("#team").hide();
var teamid = $("#teamid").val(); 
    if (/^[0-9]+$/.test(teamid)) {
      var teamdata = $.ajax({
        url: "http://www.badsquash.co.uk/team.php?team=" + teamid + "&format=json",
        }).done(displayteam)
          .fail(function() {
            $("#msg").html("Error in AJAC equest.");
          }); 
    } else {
        $("#msg").html("Error - id must be a number");
    }
}



function main() {
    $("#team").hide(); 

    $("#teamid").button();
    $("#loadteambutton").button().click(loadteam)

}

/* launch when page ready */
$(main);

})
   
.controller('playersCtrl', function($scope) {

	main();

	function load() {
    // $("#tabs").hide();
    var id = $("#playerid").val();
    // let's make sure it's a number
    // if (/^[0-9]+$/.test(id)) {
        var data = $.ajax({
            url: "http://www.badsquash.co.uk/players.php?leaguetype=1&format=json",
        }).done(display)
          .fail(function() {
              $("#msg").html("Error in AJAX request.");
          });
    // } else {
    //     $("#msg").html("Error - id must be a number");
    // }
	}

	function display(data) {
	    var data = $.parseJSON(data);
	    console.log(data);
	    for (var i = 0; i < data.data.length; i++) {

	    	// $("#players").append('<ion-item ng-repeat="item in items">' + data.data[i].level + '</ion-item>');
	    	$("#poo").append("<ion-item>Hello!</ion-item>")
	    	console.log("poo")
	    }
	    if (data.status == "good") {
	        var level = data.data.summary.level;
	        var name = data.data.summary.player;

	        // $("#tab-main").html("Player: " + name);

	        // var s = data.data.statistics;
	        // $("#p_matches").html("Matches: " + s.matches +
	        //                      " won " + s.matches_won +
	        //                      " lost " + s.matches_lost);
	        // // $("#matchesbar").progressbar({value: 100 * s.matches_win_ratio});
	        // $("#p_games").html("Games: " + (s.games_won + s.games_lost) +
	        //                      " won " + s.games_won +
	        //                      " lost " + s.games_lost);
	        // // $("#gamesbar").progressbar({value: 100 * s.games_win_ratio});
	        // $("#p_points").html("Points: " + (s.points_won + s.points_lost) +
	        //                      " won " + s.points_won +
	        //                      " lost " + s.points_lost);
	        // // $("#pointsbar").progressbar({value: 100 * s.points_win_ratio});

	        // var matches = data.data.matches;
	        // var matchdata = [];
	        // for (var i = 0; i < matches.length; i++) {
	        //     var t = readmatch(matches[i]);
	        //     matchdata.push(t);
	        // }
	        // $("#dtable").dataTable({
	        //     data: matchdata,
	        //     columns: [
	        //         {title: "Type"},
	        //         {title: "Opponent"},
	        //         {title: "Score"},
	        //         {title: "Level before"},
	        //         {title: "Level after"}
	        //     ]
	        // });

	        // // $("#tabs").tabs();
	        // $("#tabs").show();
	        // $("#msg").html("Success, loaded data for player " + id);
	    } else {
	        $("#msg").html("Error - " + data.user_message);
	    }
	}

	function main() {
	    $("#tabs").hide();

	    // $("#playerid").button();
	    load();
	    // $("#loadbutton").button().click(load);

	}

})
   
.controller('settingsCtrl', function($scope) {

})
 