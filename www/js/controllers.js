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
        $("#dtable").DataTable({
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
        $("#msg").html("Success, loaded data for player " + id);
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

})
   
.controller('playersCtrl', function($scope) {

})
   
.controller('settingsCtrl', function($scope) {

})
 