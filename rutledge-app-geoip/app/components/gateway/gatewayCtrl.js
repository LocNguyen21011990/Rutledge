app.controller('gatewayCtrl', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder','ConfigService', function($scope, $http, DTOptionsBuilder, DTColumnBuilder,ConfigService) {

    var host = ConfigService.host;
    console.log(host);
    $scope.dtOptions = DTOptionsBuilder.fromSource(host + "/api/getGatewayByTenantID/4").withDataProp('data');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('gatewayID').withTitle('ID'),
        DTColumnBuilder.newColumn('gatewayName').withTitle('Gateway Name'),
        DTColumnBuilder.newColumn('gatewayIP').withTitle('Gateway IP')
    ];

    $scope.dtInstance = {};
    // $scope.searchtest = function() {
    //     $scope.dtOptions = DTOptionsBuilder
    //         .fromSource(host + "/api/getGatewayByTenantID/3").withDataProp('data');;
    //     $scope.dtInstance.reloadData();
    // }


}]);