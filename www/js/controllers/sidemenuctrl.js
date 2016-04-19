starter.controller('sideMenuCtrl', function($scope, $rootScope) {
	var storedemail;
	var storedpass;
	$scope.$on('$ionicView.enter', function () {
		storedemail = $.parseJSON(localStorage.getItem("email"));
		storedpass = $.parseJSON(localStorage.getItem("password"));
		if (storedemail != undefined && storedpass != undefined) {
			$('#menulogin').hide();
		} else {
			$('#menulogin').show();
		}
	})
})