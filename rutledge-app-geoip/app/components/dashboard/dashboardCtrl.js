"use strict";

app.controller('dashboardCtrl', ['$scope', '$interval', '$http', 'ConfigService','$state', function($scope, $interval, $http,ConfigService,$state) {
    var host = ConfigService.host;
    $scope.hello = 'hot';
    $http.get('http://172.16.0.109:9002/api/getCityWithStaffNumber').then(function success(response) {
        $scope.allCitys = response.data.data;
    }, function error(response) {
        $scope.allCitys='';
        alert('Cant not get all Zone');
    });

    $scope.changeCity = function(id,name) {
        var cityID = id;
        var cityName = name;
        $state.go('home.dashboard.detail', { cityID: cityID,name:cityName});
    }
}]);
