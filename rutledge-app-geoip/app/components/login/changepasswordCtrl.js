app.controller('changepasswordCtrl', ['$scope', '$http', 'ConfigService', '$state', 'md5', '$window', function($scope, $http, ConfigService, $state, md5, $window) {
    var host = ConfigService.host;
    $scope.isFailed = false;
    $scope.oldpassword='';

    $scope.changePassword = function() {
        var oldPass = $scope.oldpassword;
        var newPass = $scope.newpassword;
        var confirmPass = $scope.passwordConfirm;


        $http.get(host + '/api/getUserByPassword/' + md5.createHash(oldPass)).success(function(res) {

            if (res.data.length > 0) {
                if (confirmPass != newPass) {
                    $scope.isFailed = true;
                    $scope.pwdMessage = "Confirm password is not match with new password.";
                } else {
                	var loggedUser = angular.fromJson($window.localStorage.loggedUser);
                    var objData = { "email": loggedUser.email, "newPass": md5.createHash(newPass) };
                    $http.put(host + '/api/updatePassword', objData).success(function(resp) {
                        if (resp.Error == false) {
                            if (confirm("Your password was changed successfully !") == true) {
                                $state.go('login');
                            }
                        } else {
                            $scope.isFailed = true;
                            $scope.pwdMessage = "There is a problem with the connection! Please try again later.";
                        }
                    })
                }
            } else {
                $scope.isFailed = true;
                $scope.pwdMessage = "Your old password is not correct.";
            }
        })


    }
}]);
