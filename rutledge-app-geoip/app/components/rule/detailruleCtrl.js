app.controller('detailruleCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {

    var host = ConfigService.host;
    var rulemasterID = $state.params.rulemasterID;
    var tablename = $state.params.tablename;
    $http.get(host + '/api/detailruleroom/' + rulemasterID)
        .then(function success(response) {
            $scope.ruleRooms = response.data.data;
        }, function error(error) {
            alert("Can't get detail rule room");
        });

    $http.get(host + '/api/detailrulemaster/' + rulemasterID)
        .then(function success(response) {
            $scope.rulemaster  = response.data.data;
        }, function error(error) {
            alert("Can't get detail rule master");
        });

    $http.get(host+'/api/detailruleevent/'+rulemasterID)
        .then(function success(response){
            $scope.ruleEvents = response.data.data;
        },function error(error){
            alert("Can't get detail rule Event");
        });
    $http.get(host+'/api/detailtyperule/'+rulemasterID+'/'+tablename)
        .then(function success(response){
            if (tablename=='stayhour') {
                $scope.title = "Stay Hour";
                $scope.Stayhours = response.data.data;
                $('#timeaccess').addClass("hidetable");
            }else{
                $scope.title ="Time Access";
                $scope.TimeAccess = response.data.data;
                $('#stayhour').addClass("hidetable");
            }
        },function error(error){
            alert("Can't get detail rule Type");
        }); 
    $scope.goBack = function(){
        $state.go('home.rule');
    }
}]);
