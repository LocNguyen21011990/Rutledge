app.controller('historyCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', 'ConfigService'
, function ($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, ConfigService) {
	
	var host = ConfigService.host;

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + "/api/getHistory").withDataProp('data');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(renderStatus),
        DTColumnBuilder.newColumn('username').withTitle('User Name'),
        DTColumnBuilder.newColumn('roomname').withTitle('Room'),
        DTColumnBuilder.newColumn('datecheckin').withTitle('Date Check In').renderWith(renderDate),
        DTColumnBuilder.newColumn('datecheckout').withTitle('Date Check Out').renderWith(renderDate),
    ];

    function renderStatus(data, type, full) {
        return (data == 1) ? "In Room" : "Out Room";
    };

    function renderDate(data) {
        return (data != null) ? $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss") : "NaN";
    }
}])