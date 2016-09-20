app.controller('loginCtrl', ['$scope','$rootScope', '$http', 'ConfigService', '$state', '$window', 'md5', 'loginService', function ($scope, $rootScope, $http, ConfigService, $state, $window, md5, loginService) {
	var host = ConfigService.host;
	$scope.isFailed = false;

	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		var objUser  = {"name": username, "password": md5.createHash(password)};
		var promise  = loginService.login(objUser);
		promise.then(function(data) {
			if(data != undefined) {
				if(data.status == 0) {
					$scope.isFailed = true;
					$scope.loginMessage = "Your account did not active. Please active your account first !";
				}
				else {
					$window.localStorage.loggedUser = angular.toJson(data);
					$http.defaults.headers.common['x-access-token'] = $window.localStorage.token;

					$http.get(host + '/api/getListPageByUserId/' + data.id).success(function(resp) {
						if(resp.data.length > 0) {
							var pages = resp.data;
							$window.localStorage.listPages = angular.toJson(pages);
							$state.go('home');
						}
					});
				}
			}
			else {
				$scope.isFailed = true;
				$scope.loginMessage = "Loggin failed. ! Please check your username or password and try again later.";
			}
		})
	};
}]);