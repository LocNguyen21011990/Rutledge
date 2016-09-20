app.controller('editCityCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', 'Upload', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state, Upload) {
    var host = ConfigService.host;
    var cityID = $state.params.cityID;
    $http.get(host + '/api/getCityById/' + cityID)
        .then(function success(response) {
            var data = response.data.data;
            if (data.length > 0) {
                $scope.cityName = data[0].name;
                $scope.cityDescription = data[0].description;
                $scope.countryCode = data[0].country_code;
                $scope.imgCity = data[0].imagecity;
                $scope.status = data[0].active;
            }
        }, function error(response) {
            alert("Can't get City");
        });

    $scope.updateInfoCity = function(file) {
        if (file != null) {
            file.upload = Upload.upload({
                url: '/upload',
                data: { file: file },
            });

            file.upload.then(function(response) {
                var dataCity = {};
                dataCity.id = $state.params.cityID;
                dataCity.cityName = $scope.cityName;
                dataCity.countryCode = $scope.countryCode;
                dataCity.description = $scope.cityDescription;
                dataCity.imagecity = '/' + response.data.file.path;
                dataCity.status = $scope.status;
                dataCity.datemodified = new Date();
                $http({
                    method: "POST",
                    url: host + '/api/updateCity',
                    data: dataCity
                }).then(function success(response) {
                    alert("Updated");
                    $state.go('home.city');
                }, function error(response) {
                    alert("Can't update info City");
                    $state.go('home.city');
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {});
        } else {
            var dataCity = {};
            dataCity.id = $state.params.cityID;
            dataCity.cityName = $scope.cityName;
            dataCity.countryCode = $scope.countryCode;
            dataCity.description = $scope.cityDescription;
            dataCity.imagecity = $scope.imgCity;
            dataCity.status = $scope.status;
            dataCity.datemodified = new Date();
            $http({
                method: "POST",
                url: host + '/api/updateCity',
                data: dataCity
            }).then(function success(response) {
                alert("Updated");
                $state.go('home.city');
            }, function error(response) {
                alert("Can't update info City");
                $state.go('home.city');
            });
        }
    };
    $scope.goListCity = function() {
        $state.go('home.city');
    }


}]);
