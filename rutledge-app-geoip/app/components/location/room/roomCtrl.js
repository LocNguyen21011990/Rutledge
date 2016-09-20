app.controller('roomCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {

    var host = ConfigService.host;

    /*Building*/
    $scope.createZone = function() {
        var roomInfo = {};
        roomInfo.name = $scope.roomName;
        roomInfo.description = $scope.roomDescription;
        roomInfo.zoneID = $scope.zoneID;
        roomInfo.drillID = $scope.drillID;
        roomInfo.cityID = $scope.cityID;
        roomInfo.status = $scope.status;
        roomInfo.datecreated = new Date();
        $http({
            method: "POST",
            url: host + '/api/createInfoRoom',
            data: roomInfo
        }).then(function success(response) {
            $scope.dtInstance.reloadData();
            alert("Added Room : " + roomInfo.name);
        }, function error(response) {
            alert("Can't add a new Room");
        })
    };

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoRoom').withDataProp('data')
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('order', [6, 'desc']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('rName').withTitle('Room Name'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('active').withTitle('Status').renderWith(renderStatus),
        DTColumnBuilder.newColumn('zoneName').withTitle('Zone'),
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

    $scope.getDrillByCityId = function() {
        $scope.zoneID = '';
        var cityid = $scope.cityID;
        console.log(cityid);
        $http.get(host + '/api/drill/' + cityid).then(function success(response) {
            console.log(response.data.data);
            $scope.allDrills = response.data.data;
        })
    };

    $scope.getZoneByDrillId = function(req, res) {
        var drillId = $scope.drillID;
        console.log(drillId);
        $http.get(host + '/api/zone/'+drillId)
            .then(function success(response) {
                $scope.allZones = response.data.data;
            }, function error(response) {
                alert("Can't get Drill");
            });
    }

    $scope.clear = function() {
        $scope.status = 1;
        $scope.roomName = '';
        $scope.roomDescription = '';
        $scope.zoneID = '';
    }

    $scope.delete = function(roomID, status) {
        var data = {};
        data.status = status;
        data.roomID = roomID;
        $http({
            method: "PUT",
            url: host + '/api/deleteRoom',
            data: data
        }).then(function success(response) {
            $scope.dtInstance.reloadData();
        }, function error(response) {
            alert("Can't change status.");
        });
    };

    $scope.edit = function(roomID) {
        console.log(roomID);
        $state.go('home.room.edit', { roomID: roomID });
    };

    $http.get(host + '/api/getAllCitys').success(function(res) {
        $scope.cities = res.data;
    })

    $scope.changeCity = function(id) {
        $http.get(host + '/api/drill/' + id).success(function(res) {
            $scope.drills = res.data;
            if ($scope.drills.length > 0) {
                $scope.isShowDrill = true;
                $scope.isShowZone = false;
            } else {
                $scope.isShowDrill = false;
                $scope.isShowZone = false;
            }
        });

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoRoomByCityID/' + id).withDataProp('data');
        $scope.dtInstance.reloadData();
        $scope.isShowRefresh = true;
    }

    $scope.changeDrill = function(id) {
        $http.get(host + '/api/zone/' + id).success(function(res) {
            $scope.zones = res.data;
            if ($scope.zones.length > 0) {
                $scope.isShowZone = true;
            } else {
                $scope.isShowZone = false;
            }
        });

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoRoomByDrillID/' + id).withDataProp('data');
        $scope.dtInstance.reloadData();
    }

    $scope.changeZone = function(id) {

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoRoomByZoneID/' + id).withDataProp('data');
        $scope.dtInstance.reloadData();
    }


    $scope.refreshData = function() {
        $scope.isShowRefresh = false;
        $scope.data.cityid = "";
        $scope.isShowDrill = false;
        $scope.isShowZone = false;
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getInfoRoom').withDataProp('data');
    }
}]);
