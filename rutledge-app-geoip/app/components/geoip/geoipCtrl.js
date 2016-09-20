"use strict";

app.controller('geoipCtrl', ['$scope', '$interval', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$filter', function($scope, $interval, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $filter) {
    var host = ConfigService.host;
    getRoomInfo();

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getRoomDetail/' + 1).withDataProp('data');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('peopleInRoomID').withTitle('People ID'),
        DTColumnBuilder.newColumn('staffName').withTitle('Staff Name'),
        DTColumnBuilder.newColumn('checkInDate').withTitle('Check In').renderWith(renderDate),
        DTColumnBuilder.newColumn('checkOutDate').withTitle('Check Out').renderWith(renderDate),
        DTColumnBuilder.newColumn('status').withTitle('Status')
    ];

    $scope.isShow = true;

    function renderDate(data) {
        return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
    }

    $scope.dtInstance = {};
    $scope.selectedObject = {};
    $scope.showRoomDetail = function(roomID) {

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getRoomDetail/' + roomID).withDataProp('data');
        $scope.dtInstance.reloadData();

        activeClass(roomID);

        $scope.isShow = true;
    };



    function activeClass(roomID) {

        // if ($scope.selectedObject == roomID) //reference equality should be sufficient
        //     $scope.selectedObject = {}; //de-select if the same object was re-clicked
        // else
        $scope.selectedObject = roomID;
    }


    $scope.showChart = function(roomID) {
        activeClass(roomID);
        $http.get(host + '/api/getTopFiveH2S/' + roomID).then(function(response) {
            var data = response.data.data;

            var times = [];
            times = getTimeCreate(data);


            $scope["labels"] = times;
            $scope["series"] = ['H2S A'];
            var h2s = [];
            h2s = getH2S(data);
            $scope["data"] = [
                h2s
            ];
        });

        $scope.isShow = false;
    }

    function getTimeCreate(resutl) {
        var times = [];
        for (var i = 0; i < resutl.length; i++) {
            var date = new Date(resutl[i].createDate);
            var formatDate = date.toLocaleString();
            times.push(formatDate);
        }
        return times;
    }

    function getH2S(resutl) {

        var h2s = [];

        for (var i = 0; i < resutl.length; i++) {
            h2s.push(resutl[i].h2s);
        }
        return h2s;
    }

    var stop;
    $scope.reLoad = function() {
        stop = $interval(autoReloadData, $scope.iInterval * 1000);
    }

    function autoReloadData() {
        getRoomInfo();
        $scope.showRoomDetail(1);
    }

    function getRoomInfo() {
        $http.get(host + '/api/getRoomInfo').then(function(response) {
            $scope.roomInfos = response.data.data;
        });
    }

    $scope.stopLoad = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopLoad();
    });

}]);
