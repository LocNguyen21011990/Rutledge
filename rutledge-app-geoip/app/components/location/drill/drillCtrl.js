app.controller('drillCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state','Upload', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state,Upload) {

    var host = ConfigService.host;

    /*Building*/
    $scope.createDrill = function(file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: { file: file },
        });

        file.upload.then(function(response) {
            var drillInfo = {};
            drillInfo.name = $scope.drillName;
            drillInfo.description = $scope.drillDescription;
            drillInfo.imagedrill ='/'+response.data.file.path
            drillInfo.cityID = $scope.cityID;
            drillInfo.status = $scope.status;
            drillInfo.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/createInfoDrill',
                data: drillInfo
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
                alert("Added drill " + drillInfo.name);
            }, function error(response) {
                alert("Can't add a new Building");
            });

        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {});
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoDrill').withDataProp('data')
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('order', [6, 'desc']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('cityName').withTitle('City'),
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
    $scope.status = 1;
    $http.get(host + '/api/getAllCitys')
        .then(function success(response) {
            $scope.allCitys = response.data.data;
        }, function error(response) {
            alert("Can't get Building");
        });

    $scope.clear = function() {
        $scope.status = 1;
        $scope.drillName = '';
        $scope.drillDescription = '';
        $scope.cityID = '';
    }

    $scope.delete = function(drillID, status) {
        var data = {};
        data.status = status;
        data.drillID = drillID;

        $http({
            method: "PUT",
            url: host + '/api/deleteDrill',
            data: data
        }).then(function success(response) {
            $scope.dtInstance.reloadData();
        }, function error(response) {
            alert("Can't change status.");
        });
    };

    $scope.edit = function(drillID) {
        $state.go('home.drill.edit', { drillID: drillID });
    };

    $scope.filterCityChanged = function(cityID) {
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoDrillByCityID/' + cityID).withDataProp('data');
        $scope.dtInstance.reloadData();
        $scope.isShowRefresh = true;
    }

    $scope.refreshData = function() {
        $scope.isShowRefresh = false;
        $scope.data.cityid = "";
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoDrill').withDataProp('data');
    }
}]);
