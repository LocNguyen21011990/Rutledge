app.controller('editZoneCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', 'Upload', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state, Upload) {
    var host = ConfigService.host;
    var zoneID = $state.params.zoneID;
    $scope.getDrillByCityId = function() {
        var cityId = $scope.cityID;
        $http.get(host + '/api/drill/' + cityId)
            .then(function success(response) {
                $scope.allDrills = response.data.data;
            }, function error(response) {
                alert("Can't get Drill");
            });
    }

    $http.get(host + '/api/getAllDrill').then(function success(response) {
        $scope.allDrills = response.data.data;
        $http.get(host + '/api/getZoneById/' + zoneID)
            .then(function success(response) {
                var data = response.data.data;
                if (data.length > 0) {
                    $scope.id = zoneID;
                    $scope.zoneName = data[0].name;
                    $scope.zoneDescription = data[0].description;
                    $scope.status = data[0].active;
                    $scope.drillID = data[0].drillid;
                    $scope.imgZoneMap = data[0].zonemap;
                    var drillID = data[0].drillid;
                    $http.get(host + '/api/getCityByDrillId/' + drillID).then(function success(response) {
                        var data = response.data.data;
                        $scope.cityID = data[0].id;
                    }, function error(response) {});
                }
            }, function error(response) {
                alert("Can't get drill");
            });
    })

    $http.get(host + '/api/getAllCitys').then(function success(response) {
        $scope.cities = response.data.data;
    }, function error(response) {

    });


    $scope.updateInfoZone = function(file) {
        if (file != null) {
            file.upload = Upload.upload({
                url: '/upload',
                data: { file: file },
            });

            file.upload.then(function(response) {
                var dataZoneUpdate = {};
                dataZoneUpdate.id = $state.params.zoneID;
                dataZoneUpdate.name = $scope.zoneName;
                dataZoneUpdate.description = $scope.zoneDescription;
                dataZoneUpdate.zonemap = '/' + response.data.file.path;
                dataZoneUpdate.drillID = $scope.drillID;
                dataZoneUpdate.status = $scope.status;
                dataZoneUpdate.datemodified = new Date();
                $http({
                    method: "POST",
                    url: host + '/api/updateZone',
                    data: dataZoneUpdate
                }).then(function success(response) {
                    alert("Updated Zone");
                    $state.go('home.zone');
                }, function error(response) {
                    alert("Can't update info Zone");
                    $state.go('home.zone');
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {});
        } else {
            var dataZoneUpdate = {};
            dataZoneUpdate.id = $state.params.zoneID;
            dataZoneUpdate.name = $scope.zoneName;
            dataZoneUpdate.description = $scope.zoneDescription;
            dataZoneUpdate.zonemap = $scope.imgZoneMap;
            dataZoneUpdate.drillID = $scope.drillID;
            dataZoneUpdate.status = $scope.status;
            dataZoneUpdate.datemodified = new Date();
            $http({
                method: "POST",
                url: host + '/api/updateZone',
                data: dataZoneUpdate
            }).then(function success(response) {
                alert("Updated Zone");
                $state.go('home.zone');
            }, function error(response) {
                alert("Can't update info Zone");
                $state.go('home.zone');
            });
        }
    };

    $scope.goListZone = function() {
        $state.go('home.zone');
    }
}]);
