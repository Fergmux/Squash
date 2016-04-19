// angular.module('app.controllers', [])

starter.controller('loginCtrl', function($scope, $rootScope, $state, $ionicHistory, $window) {
	Cache.initialize();
	//604800000 milliseconds in a week
	Cache.clean(604800000);
	$scope.loginPage = "Login";
	// disable back button appearing
	$ionicHistory.nextViewOptions({
	    disableBack: true
	});

	var storedEmail;
	var storedPass;

	$scope.$on('$ionicView.enter', function () {
		// set email and password variables to previously stored values
		storedEmail = $.parseJSON(localStorage.getItem("email"));
		storedPass = $.parseJSON(localStorage.getItem("password"));
		// if they are valid, log in using those credentials
		if (storedEmail != undefined || storedPass != undefined) {
			login(storedEmail, storedPass);
		}
	})

	function login(email, pass) {
		//store password and email in local storage (like cookies)
		if (storedEmail == undefined) {
			localStorage["email"] = JSON.stringify(email);
		}
		if (storedPass == undefined) {
			localStorage["password"] = JSON.stringify(pass);
		}
		// get data from login url
		Cache.request("http://www.squashlevels.com/info.php?action=login&email=" + email + "&password=" + pass + "&stay_logged_in=1&format=json", loadUserData, function() {
			$("#msg").html("Error - AJAX failed")
		})
	}

	// load the user's log in data to local sotorage, or throw error if bad request
	function loadUserData(data) {
		data = $.parseJSON(data);
		if (data.status == "good") {
			localStorage["userData"] = JSON.stringify(data);
			$state.go('squashLevels.myProfile');
		} else {
			$("#msg").html("Sorry, incorrect email or password");
		}
	}


	$scope.loginTap = function() {
		var email = $("#emailId").val();
		var pass = $("#passId").val();
		//converts pass to md5
		var passHash = CryptoJS.MD5(pass).toString();
		//store email and password in local storage
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		login(email, passHash);
	}
})
