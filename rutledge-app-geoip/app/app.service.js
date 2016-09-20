'use strict';

app.service('userService',function($window){
	this.isLogin = function(){
		return  $window.localStorage.loggedUser == undefined ? false : true ;
	};
	this.listAccessPage = function(){
		var listPages = $window.localStorage.listPages;
		var listLinks = [];
		angular.forEach(angular.fromJson(listPages), function(value, key) {
		  this.push(value.link);
		}, listLinks);

		return listLinks;

	};

});

app.service('loginService', ['ConfigService', '$http', '$window', '$state', '$q', function (ConfigService, $http, $window, $state, $q) {
	this.login = function(objUser) {
		var host = ConfigService.host;
		var url = host + "/api/login/";
		var deferred = $q.defer();
		$http.put(url, objUser)
		.then(function (res) {
			$window.localStorage.token = res.data.token;
			deferred.resolve(res.data.data[0]);
		});
		return deferred.promise;
	},
	
	this.logout = function () {
		$window.localStorage.removeItem('loggedUser');
    	$window.localStorage.removeItem('listPages');
    	$window.localStorage.removeItem('token');
	}
}]);

app.factory('generatePassword', [function () {
	return {
		randomPassword: function(length) {
		    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
		    var pass = "";
		    for (var x = 0; x < length; x++) {
		        var i = Math.floor(Math.random() * chars.length);
		        pass += chars.charAt(i);
		    }
		    return pass;
		}
	};
}]);

app.factory('sendEmail', ['ConfigService', '$http', '$q', function (ConfigService, $http, $q) {
	var host = ConfigService.host;
	return {
		sendEmailPassword: function(emailData) {
			var deferred = $q.defer();
			$http.post(host + '/api/sendEmailPassword', emailData)
			.then(function (res) {
				deferred.resolve(res);
			});
			return deferred.promise;
		}
	};
}])