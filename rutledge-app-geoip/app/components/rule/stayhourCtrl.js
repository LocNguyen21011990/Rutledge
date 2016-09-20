app.controller('stayhourCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {

    var host = ConfigService.host;
    var ttpID = $state.params.ttpID;
    $http.get(host + '/api/getAllRoom')
        .then(function success(response) {
            $scope.allRooms = response.data.data;
        }, function error(response) {
            alert("Can't get Room");
    });

    $http.get(host + '/api/events')
        .then(function success(response) {
            $scope.allEvents = response.data.data;
        }, function error(response) {
            alert("Can't get Event");
    });

    $scope.createStayHourRule = function() {
        var data = {};
        data.title = $scope.title;
        data.message = $scope.message;
        data.description = $scope.description;
        data.timeLimit =$scope.timeLimit;
        data.ttpID = ttpID;
        data.priority = $scope.priority;
        data.roomID = $scope.roomID;
        data.eventID = $scope.eventID;
        data.datecreated = new Date();
        
        $http({
            method: "PUT",
            url: host + '/api/rulemaster',
            data: data
        }).then(function success(response) {
            alert("Created StayHour");
            $state.go('home.rule');
        }, function error(response) {
            alert("Can't create info StayHour");
            $state.go('home.rule');
        });
    }
    $scope.goBack = function(){
        $state.go('home.rule');
    }
}]);
