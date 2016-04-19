starter.controller('rankingsCtrl', function($scope, $rootScope, $state) {

	// fires when page is loaded for the first time
	$scope.$on('$ionicView.loaded', function () {
		changeHiddenInput();
	})

	// when search buttton is pressed hide results, reload data and hide filters
	$scope.onTap = function() {
		$("#msg").empty();
		$("#loading4").show();
		changeHiddenInput();
		$("#filters").slideToggle('slow');
	}

	// toggle filters on filter button press
	$scope.toggleFilters = function() {
		$("#filters").slideToggle('slow');
	}

	function displayRankingList(rank) {
		$("#ranklist").empty();
		var rank = $.parseJSON(rank);

		// if data has been returned succesfully
		if (rank.status == "good") {
			var rankData = rank.data;
			$scope.players = [];
			// populate rank list with data (Position - Name - Level)
			for (var i = 0; i < rankData.length; i++) {
				var info = rankData[i];
				$scope.players[i] = {
				    name: info.position + ". " + info.player,
				    level: info.level,
				    id: info.playerid
				};
			}
			// hide loading button and populate ionic list with rankings
			$("#ranklist").players;
			$("#loading4").hide();
			$("#tabs").show();
		} else {
			// throw error if data not returned
			$("#msg").html("Error - No results for your query");
		}
	}

	// on list element tap go to player profile page
	$scope.tapped = function(id) {
		$rootScope.tapped = id
		$state.go('squashLevels.playerProfiles')
	}

	// reset filters after being used
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

	// loads data for displaying the rankings, call displayerRankingList on success
	function loadRanking() {
		Cache.request("http://squashlevels.com/players.php?check=1&limit_confidence=1&club=" + clubs + "&county=" + county + "&country=" + country + "&show=" + show + "&events=" + events + "&matchtype=" + matchtype + "&playercat=" + agegroup + "&playertype=" + gender + "&search=Search+name&format=json", displayRankingList, function() {
			$("#msg").html("Error in AJAX request for rank");
		})
	}
})