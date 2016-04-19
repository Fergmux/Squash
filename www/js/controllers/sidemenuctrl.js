starter.controller('sideMenuCtrl', function($scope, $rootScope) {
	var storedEmail;
	var storedPass;

	// requests username and possword from localstorage
	$scope.$on('$ionicView.enter', function () {
		storedemail = $.parseJSON(localStorage.getItem("email"));
		storedPass = $.parseJSON(localStorage.getItem("password"));
		// if user has logged in hide login menu
		if (storedemail != undefined && storedPass != undefined) {
			$('#menulogin').hide();
		} else {
			$('#menulogin').show();
		}
	})

})