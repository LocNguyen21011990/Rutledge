"use strict";

app.controller('dashboard-detail-drillCtrl', ['$scope', '$interval', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$filter', '$state', function($scope, $interval, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $filter, $state) {
    var host = ConfigService.host;
    var drillID = $state.params.drillID;
    var name = $state.params.drillname;
    $http.get(host + '/api/getZoneWithStaffByDrillId/' + drillID).success(function(res) {

        $scope.drillname = name;
        if (res.data.length === 0) {
            $scope.isShowZoneEmty = true;
            $scope.isShowZone = false;
        } else {
            console.log(res.data);
            $scope.date = '';
            $scope.allZones = res.data;
            $scope.isShowZone = true;
            $scope.isShowZoneEmty = false;
        }
    })

    $scope.changeZone = function(id) {
        $http.get(host + '/api/getCityByDrillId/' + drillID).success(function(res) {
            if (res.data.length > 0) {
                var cityID = res.data[0].id;
                $state.go('home.zonemonitoring.isparam', { cityID: cityID, drillID: drillID, zoneID: id });
            }
        })

    }

    $scope.goBack = function() {
        $state.go('home.dashboard');
    }
}]);
