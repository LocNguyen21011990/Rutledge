app.controller('locationCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state','Upload', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state,Upload) {

    var host = ConfigService.host;
    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getAllCitys').withDataProp('data')
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('order', [6, 'desc']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('City Name'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('country_code').withTitle('Country Code'),
        DTColumnBuilder.newColumn('active').withTitle('Status').renderWith(renderStatus),
        DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
        DTColumnBuilder.newColumn('datemodified').withTitle('Modified at').renderWith(renderDate),
        DTColumnBuilder.newColumn('id').withTitle('Actions').renderWith(getOnlyId)
    ];

    function renderStatus(data) {
        return data == 1 ? 'Active' : 'InActive';
    }

    function renderDate(data) {
        return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
    }

    function getOnlyId(data, type, full, meta) {

        var status = full.active;
        var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
        return '<div class="row"><div class="option-tool"><button ng-click="edit(\'' + data + '\')">' +
            '<i class="fa fa-edit"></i>' +
            '</button>&nbsp;' +
            '<button ng-click="delete(\'' + data + '\',' + !status + ')">' +
            '<i class="fa ' + icon + '"></i>' +
            '</button>&nbsp;</div></div>';
    }


    $scope.dtInstance = {};

    /*city*/

    $scope.status = 1;
    $scope.createInfoCity = function(file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: { file: file },
        });

        file.upload.then(function(response) {
            var dataCity = {};
            dataCity.cityName = $scope.cityName;
            dataCity.countryCode = $scope.countryCode;
            dataCity.description = $scope.cityDescription;
            dataCity.imagecity = '/'+response.data.file.path
            dataCity.status = $scope.status;
            dataCity.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/createInfoCity',
                data: dataCity
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
                alert("Added "+dataCity.cityName);
            }, function error(response) {
                alert("Can't add a new City");
            });
        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {});
    }

    $scope.clear = function() {
        $scope.status = 1;
        $scope.cityName = '';
        $scope.countryCode = '';
        $scope.cityDescription = '';
    }

    $scope.delete = function(cityID, status) {
        var data = {};
        data.status = status;
        data.cityID = cityID;

        $http({
            method: "PUT",
            url: host + '/api/deleteCity',
            data: data
        }).then(function success(response) {
            $scope.dtInstance.reloadData();
        }, function error(response) {
            alert("Can't change status.");
        });
    };


    $scope.edit = function(cityID) {
        $state.go('home.city.edit', { cityID: cityID });
    };

}]);
