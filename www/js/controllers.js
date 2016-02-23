angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('myProfileCtrl', function($scope) {

})
   
.controller('newMatchCtrl', function($scope) {

$("#tabs").hide();
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
        for (var i = 0; i < matches.length; i++) {
            var t = readmatch(matches[i]);
            matchdata.push(t);
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

})
   
.controller('settingsCtrl', function($scope) {

})
 