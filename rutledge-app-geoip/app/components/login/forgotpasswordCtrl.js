app.controller('forgotpasswordCtrl', ['$scope', '$http', 'ConfigService', '$state', 'generatePassword', 'md5', 'sendEmail', function ($scope, $http, ConfigService, $state, generatePassword, md5, sendEmail) {
	var host = ConfigService.host;
	$scope.isFailed = false;
	$scope.getPassword = function() {
		var formEmail = $scope.email;
		if(formEmail == "") {
			$scope.isFailed = true;
			$scope.pwdMessage = "Please enter email address or username for password reset";
		}
		else {
			$http.get(host + '/api/getUserByEmail/' + formEmail).success(function(res) {
				if(res.data.length <= 0) {
					$scope.isFailed = true;
					$scope.pwdMessage = "Your email is not exists !";
				}
				else {
					var newPassword = generatePassword.randomPassword(10);

					var objpass = {"email" : formEmail, "newPass" : md5.createHash(newPassword)};
					$http.put(host + '/api/updatePassword', objpass).success(function(res) {
						if(res.Error == false) {
							var emailData = {"email" : formEmail, "newPass" : newPassword};
							var promise = sendEmail.sendEmailPassword(emailData);
							promise.then(function(data) {

								if(data.data.Error == false) {
									if(confirm("Your new password was sent successfully! Please check your email and login again!") == true) {
										$state.go('login');
									}
								}
								else {
									$scope.isFailed = true;
									$scope.pwdMessage = "Can not reach to your email! Please try again later.";
								}
							});
						}
						else {
							$scope.isFailed = true;
							$scope.pwdMessage = "There is a problem with the connection! Please try again later.";
						}
					})
				}
			})
		}
	}
}]);