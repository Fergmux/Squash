starter.controller('settingsCtrl', function($scope, $state, $ionicHistory, $rootScope) {
	$ionicHistory.nextViewOptions({
		disableBack: true
	});
	// when cache clear button is pressed
	$scope.clearCache = function() {
		// from start of time clear cache
		Cache.clean(315360000000);
		$("#message").html("Cache emptied")
		setTimeout(function() {
			$("#message").empty()
		}, 3000);
	}
	// when logging out, delete saved details
	$scope.logout = function() {
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("userData");
		$state.go('squashLevels.login')
	}
})