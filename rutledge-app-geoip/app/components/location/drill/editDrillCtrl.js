app.controller('editDrillCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', 'Upload', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state, Upload) {
    var host = ConfigService.host;
    var drillID = $state.params.drillID;
    $http.get(host + '/api/getAllCitys')
        .then(function success(response) {
            $scope.allCitys = response.data.data;
            $http.get(host + '/api/getDrillById/' + drillID)
                .then(function success(response) {
                    var data = response.data.data;
                    if (data.length > 0) {
                        $scope.id = drillID;
                        $scope.drillName = data[0].name;
                        $scope.drillDescription = data[0].description;
                        $scope.imgDrill = data[0].imagedrill;
                        $scope.status = data[0].active;
                        $scope.cityID = data[0].cityid;
                    }
                }, function error(response) {
                    alert("Can't get drill");
                });
        }, function error(response) {
            alert("Can't get City");
        });

    $scope.updateInfoDrill = function(file) {
        if (file != null) {
            file.upload = Upload.upload({
                url: '/upload',
                data: { file: file },
            });

            file.upload.then(function(response) {
                var dataDrillUpdate = {};
                dataDrillUpdate.id = $state.params.drillID;
                dataDrillUpdate.name = $scope.drillName;
                dataDrillUpdate.description = $scope.drillDescription;
                dataDrillUpdate.imagedrill = '/' + response.data.file.path;
                dataDrillUpdate.cityID = $scope.cityID;
                dataDrillUpdate.status = $scope.status;
                dataDrillUpdate.datemodified = new Date();
                $http({
                    method: "POST",
                    url: host + '/api/updateDrill',
                    data: dataDrillUpdate
                }).then(function success(response) {
                    alert("Updated Drill");
                    $state.go('home.drill');
                }, function error(response) {
                    alert("Can't update info Drill");
                    $state.go('home.drill');
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {});
        } else {
            var dataDrillUpdate = {};
            dataDrillUpdate.id = $state.params.drillID;
            dataDrillUpdate.name = $scope.drillName;
            dataDrillUpdate.description = $scope.drillDescription;
            dataDrillUpdate.imagedrill = $scope.imgDrill;
            dataDrillUpdate.cityID = $scope.cityID;
            dataDrillUpdate.status = $scope.status;
            dataDrillUpdate.datemodified = new Date();
            $http({
                method: "POST",
                url: host + '/api/updateDrill',
                data: dataDrillUpdate
            }).then(function success(response) {
                alert("Updated Drill");
                $state.go('home.drill');
            }, function error(response) {
                alert("Can't update info Drill");
                $state.go('home.drill');
            });
        }
    };

    $scope.goListDrill = function() {
        $state.go('home.drill');
    }
}]);
