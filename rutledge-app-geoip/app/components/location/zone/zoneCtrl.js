app.controller('zoneCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', 'Upload', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state, Upload) {

    var host = ConfigService.host;

    uploadZoneMap = function(file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: { file: file },
        });

        file.upload.then(function(response) {
            return response.data.file.path;
        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {});
    }

    /*Building*/
    $scope.createZone = function(file) {
        file.upload = Upload.upload({
            url: '/upload',
            data: { file: file },
        });

        file.upload.then(function(response) {
            var zoneInfo = {};
            zoneInfo.name = $scope.zoneName;
            zoneInfo.zonemap = '/' + response.data.file.path;
            zoneInfo.description = $scope.zoneDescription;
            zoneInfo.drillID = $scope.drillID;
            zoneInfo.status = $scope.status;
            zoneInfo.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/createInfoZone',
                data: zoneInfo
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
                alert("Added Zone " + zoneInfo.name);
            }, function error(response) {
                alert("Can't add a new Zone");
            });
        }, function(response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {});
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoZone').withDataProp('data')
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('order', [6, 'desc']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('zName').withTitle('Zone Name'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('active').withTitle('Status').renderWith(renderStatus),
        DTColumnBuilder.newColumn('drillName').withTitle('Drill'),
        DTColumnBuilder.newColumn('cityName').withTitle('City'),
        DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
        DTColumnBuilder.newColumn('datemodified').withTitle('Modified At').renderWith(renderDate),
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
    $http.get(host + '/api/getAllCitys').then(function success(response) {
        console.log(response.data.data);
        
    }, function error(response) {
        alert("Can't change status");
    });

    $scope.getDrillByCityId = function(){
        var cityid = $scope.cityID;
        $http.get(host + '/api/drill/' + cityid)
            .then(function success(response) {
                console.log(response.data);
                $scope.allDrills = response.data.data;
            }, function error(response) {
                alert("Can't get Drill");
            });
    }

    $scope.clear = function() {
        $scope.status = 1;
        $scope.zoneName = '';
        $scope.zoneDescription = '';
        $scope.drillID = '';
    }

    $scope.delete = function(zoneID, status) {
        var data = {};
        data.status = status;
        data.zoneID = zoneID;
        $http({
            method: "PUT",
            url: host + '/api/deleteZone',
            data: data
        }).then(function success(response) {
            $scope.dtInstance.reloadData();
        }, function error(response) {
            alert("Can't change status.");
        });
    };

    $scope.edit = function(zoneID) {
        $state.go('home.zone.edit', { zoneID: zoneID });
    };

    $http.get(host + '/api/getAllCitys').success(function(res) {
        $scope.cities = res.data;
    })

    $scope.changeCity = function(id) {
        $http.get(host + '/api/drill/' + id).success(function(res) {
            $scope.drills = res.data;
            console.log(id);
            if ($scope.drills.length > 0) {
                $scope.isShowDrill = true;
            } else {
                $scope.isShowDrill = false;
            }
        });

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoZoneByCityID/' + id).withDataProp('data');
        $scope.dtInstance.reloadData();
        $scope.isShowRefresh = true;
    }

    $scope.changeDrill = function(id) {
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoZoneByDrillID/' + id).withDataProp('data');
        $scope.dtInstance.reloadData();
    }


    $scope.refreshData = function() {
        $scope.isShowRefresh = false;
        $scope.data.cityid = "";
        $scope.isShowDrill = false;
        $scope.isShowZone = false;
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoZone').withDataProp('data');
    }
}]);
