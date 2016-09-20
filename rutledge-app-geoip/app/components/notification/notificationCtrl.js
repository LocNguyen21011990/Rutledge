
app.controller('notificationCtrl', ['$scope', '$interval', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', 'ConfigService', function($scope, $interval, $http, $filter, DTOptionsBuilder, DTColumnBuilder, ConfigService) {
    var host = ConfigService.host;


    $http.get(host + "/api/getNotification").then(function(response) {

    });
    $scope.dtOptions = DTOptionsBuilder.fromSource(host + "/api/getNotification").withDataProp('data');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('message').withTitle('Message'),
        DTColumnBuilder.newColumn('username').withTitle('User Name'),
        DTColumnBuilder.newColumn('roomname').withTitle('Room'),
        DTColumnBuilder.newColumn('datecreated').withTitle('Created At').renderWith(renderDate),
    ];

    function renderStatusH2S(data, type, full) {
        return data >= 50 ? 'red' : 'green';
    };

    function renderStatusHeart(data) {
        return data >= 100 ? 'red' : 'green';
    }

    function renderDate(data) {
        return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
    }


    $scope.dtInstance = {};

    var stop;

    $scope.reLoad = function() {
        stop = $interval(reloadData, $scope.iInterval * 1000);
    }

    function reloadData() {
        $scope.dtOptions = DTOptionsBuilder
            .fromSource(host + "/api/getNotification").withDataProp('data');
        $scope.dtInstance.reloadData();
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
