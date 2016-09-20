"use strict";

app.controller('dashboard-detailCtrl', ['$scope', '$interval', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$filter', '$state', function($scope, $interval, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $filter, $state) {
    var host = ConfigService.host;
    var cityID = $state.params.cityID;
    $http.get(host + '/api/getDrillWithStaffByCityId/' + cityID).success(function(res) {
        $scope.cityname = $state.params.name;
        if (res.data.length === 0) {
            $scope.isShowDrillEmty = true;
            $scope.isShowDrill = false;
        } else {
            $scope.drills = res.data;
            $scope.isShowDrillEmty = false;
            $scope.isShowDrill = true;
        }
    });

    $scope.changeDrill = function(id, name) {
        $scope.selectedId = id;
        $state.go('home.dashboard.drill', {drillID:id,drillname:name});
    }

    $scope.goBack = function() {
        $state.go('home.dashboard');
    }
}]);
