// angular.module('app.controllers', [])

starter.controller('loginCtrl', function($scope, $rootScope, $state, $ionicHistory, $window) {
	Cache.initialize();
	//604800000 milliseconds in a week
	Cache.clean(604800000);
	$scope.loginPage = "Login"
	$ionicHistory.nextViewOptions({
	    disableBack: true
	});

	var storedemail;
	var storedpass;

	$scope.$on('$ionicView.enter', function () {
		storedemail = $.parseJSON(localStorage.getItem("email"))
		storedpass = $.parseJSON(localStorage.getItem("password"))
		// console.log(storedemail,storedpass)
		if (storedemail != undefined || storedpass != undefined) {
			login(storedemail, storedpass)
		}
	})

	// pass = "uniapp"
	// 0094539787173fdbc36ecf1c1827193a
	// email = "app.developer@bristol.ac.uk"

	function login(email, pass) {
		//store password and email in local storage (like cookies)
		if (storedemail == undefined) {
			localStorage["email"] = JSON.stringify(email);
		}
		if (storedpass == undefined) {
			localStorage["password"] = JSON.stringify(pass);
		}

		Cache.request("http://www.squashlevels.com/info.php?action=login&email=" + email + "&password=" + pass + "&stay_logged_in=1&format=json", loadUserData, function() {
			$("#msg").html("Error - AJAX failed")
		})
	}

	function loadUserData(data) {
		data = $.parseJSON(data);
		if (data.status == "good") {
			localStorage["userData"] = JSON.stringify(data);
			$state.go('squashLevels.myProfile')
		} else {
			$("#msg").html("Sorry, incorrect email or password")
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
