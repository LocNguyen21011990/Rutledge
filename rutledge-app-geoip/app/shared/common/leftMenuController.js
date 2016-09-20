"use strict";
app.controller('leftMenuController', ['$scope', '$rootScope', '$window', '$state', '$http', 'ConfigService', 'loginService', function($scope, $rootScope, $window, $state, $http, ConfigService, loginService) {
    var host = ConfigService.host;
    var pageByUser = undefined;
    $scope.isShowLoggedUserName = true;
    if( $window.localStorage.listPages !== undefined){
        pageByUser = $window.localStorage.listPages;
    }
    if(pageByUser == undefined ) {
        $state.go('login');
    }
    else {
        $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);
        $scope.pages = angular.fromJson(pageByUser);
    }

    $scope.logout = function () {
        loginService.logout();
        $state.go('login');
    }

    $scope.changePassword = function() {
        $state.go('changepassword');
    }

    $scope.setStatusLoggedUserName = function() {
        if($scope.isShowLoggedUserName == true) {
            $scope.isShowLoggedUserName = false;
        }
        else {
            $scope.isShowLoggedUserName = true;
        }
    }
}]);