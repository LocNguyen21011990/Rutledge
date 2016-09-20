app.controller('editRoomCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {
    var host = ConfigService.host;
    var roomID = $state.params.roomID;

    $scope.getDrillByCityId = function() {
        var cityId = $scope.cityID;
        $http.get(host + '/api/drill/' + cityId)
            .then(function success(response) {
                $scope.allDrills = response.data.data;
            }, function error(response) {
                alert("Can't get Drill");
            });
    }

    $scope.getZoneByDrillId = function(req, res) {
        var drillId = $scope.drillID;
        $http.get(host + '/api/zone/' + drillId)
            .then(function success(response) {
                $scope.allZones = response.data.data;
            }, function error(response) {
                alert("Can't get Drill");
            });
    }

    $http.get(host + '/api/getAllDrill').then(function success(response) {
        $scope.allDrills = response.data.data;
    }, function error(response) {});

    $http.get(host + '/api/getAllCitys').then(function success(response) {
        $scope.cities = response.data.data;
    }, function error(response) {

    });

    $http.get(host + '/api/getAllZones')
        .then(function success(response) {
            $scope.allZones = response.data.data;
            $http.get(host + '/api/getRoomById/' + roomID)
                .then(function success(response) {
                    var data = response.data.data;
                    if (data.length > 0) {
                        $scope.id = roomID;
                        $scope.roomName = data[0].name;
                        $scope.roomDescription = data[0].description;
                        $scope.status = data[0].active;
                        $scope.zoneID = data[0].zoneid;
                        var zoneID = data[0].zoneid;
                        $http.get(host + '/api/getDrillByZoneId/' + zoneID).then(function success(response) {
                            var data = response.data.data;
                            $scope.drillID = data[0].id;
                            var drillID = data[0].id;
                            $http.get(host + '/api/getCityByDrillId/' + drillID).then(function success(response) {
                                var data = response.data.data;
                                $scope.cityID = data[0].id;
                            });
                        }, function error(response) {});
                    }
                }, function error(response) {
                    alert("Can't get room");
                });
        }, function error(response) {
            alert("Can't get Zone");
        });

    $scope.updateInfoRoom = function() {
        var dataRoomUpdate = {};
        dataRoomUpdate.id = $state.params.roomID;
        dataRoomUpdate.name = $scope.roomName;
        dataRoomUpdate.description = $scope.roomDescription;
        dataRoomUpdate.zoneID = $scope.zoneID;
        dataRoomUpdate.drillID = $scope.drillID;
        dataRoomUpdate.cityID = $scope.cityID;
        dataRoomUpdate.status = $scope.status;
        dataRoomUpdate.datemodified = new Date();
        $http({
            method: "POST",
            url: host + '/api/updateRoom',
            data: dataRoomUpdate
        }).then(function success(response) {
            alert("Updated Room");
            $state.go('home.room');
        }, function error(response) {
            alert("Can't update info Room");
            $state.go('home.room');
        });

    };

    $scope.goListDrill = function() {
        $state.go('home.room');
    }
}]);
