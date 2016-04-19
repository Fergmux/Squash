starter.controller('rankingsCtrl', function($scope, $rootScope, $state) {

	//fires when page is loaded for the first time
	$scope.$on('$ionicView.loaded', function () {
		changeHiddenInput();
	})

	//When search buttton is pressed, hide results, reload data, hide filters
	$scope.onTap = function() {
		$("#msg").empty();
		$("#loading4").show();
		changeHiddenInput();
		$("#filters").slideToggle('slow');
	}

	//when filters button is pressed toggle filters
	$scope.toggleFilters = function() {
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
				    name: info.position + ". " + info.player,
				    level: info.level,
				    id: info.playerid
				};
				
			}
			
			$("#ranklist").players;
			$("#loading4").hide();
			$("#tabs").show();
		} else {
			$("#msg").html("Error - No results for your query");
		}
	}

	$scope.tapped = function(id) {
		console.log(id);
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
})