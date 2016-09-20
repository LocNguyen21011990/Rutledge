app.controller('editStayHourCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {
    var host = ConfigService.host;
    var ruleId = $state.params.rulemasterID;
    var tableName = $state.params.tablename;

    $http.get(host + '/api/getAllRoom')
        .then(function success(response) {
            $scope.allRooms = response.data.data;
            var arrRoomId = [];
            $http.get(host + '/api/detailRuleRoom/' + ruleId).success(function(response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        arrRoomId.push(data[i].roomid);
                    }
                    $scope.roomID = arrRoomId;
                }
            });
        }, function error(response) {
            alert("Can't get Room");
        });

    $http.get(host + '/api/events')
        .then(function success(response) {
            $scope.allEvents = response.data.data;

            var arrEventId = [];
            $http.get(host + '/api/detailruleEvent/' + ruleId).success(function(response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        arrEventId.push(data[i].eventid);
                    }
                    $scope.eventID = arrEventId;
                }
            });
        }, function error(response) {
            alert("Can't get Event");
        });
    $http.get(host + '/api/getDetailStayHourByRuleId/' + ruleId).success(function(response) {
        var data = response.data;
        if (data.length > 0) {
            $scope.timeLimit = data[0].timelimit;
        }
    });

    $http.get(host + '/api/detailrulemaster/' + ruleId).success(function(response) {
        var data = response.data;
        if (data.length > 0) {
            $scope.title = data[0].title;
            $scope.message = data[0].message;
            $scope.description = data[0].description;
            $scope.priority = data[0].priority;
        }
    });

    $scope.updateStayHourRule = function() {
        var data = {};
        data.id = ruleId;
        data.tablename = tableName;
        data.title = $scope.title;
        data.message = $scope.message;
        data.description = $scope.description;
        data.timeLimit = $scope.timeLimit;
        data.priority = $scope.priority;
        data.roomID = $scope.roomID;
        data.eventID = $scope.eventID;
        data.datemodified = new Date();
        $http.get(host + '/api/detailtyperule/' + ruleId + '/stayhour').then(function success(response) {
            data.templateId = response.data.data[0].id;
            data.typetemplateid = response.data.data[0].typetemplateid;
            $http({
                method: "PUT",
                url: host + '/api/updateRuleMaster',
                data: data
            }).then(function success(response) {

                alert("Updated StayHour");
                $state.go('home.rule');
            }, function error(response) {
                alert("Can't update info StayHour");
                $state.go('home.rule');
            });
        });
    }

}]);

app.controller('editTimeAccessCtrl', ['$scope', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {
    var host = ConfigService.host;
    var ruleId = $state.params.rulemasterID;
    var tableName  = $state.params.tablename;
    $http.get(host + '/api/getAllRoom')
        .then(function success(response) {
            $scope.allRooms = response.data.data;
            var arrRoomId = [];
            $http.get(host + '/api/detailRuleRoom/' + ruleId).success(function(response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        arrRoomId.push(data[i].roomid);
                    }
                    $scope.roomID = arrRoomId;
                }
            });
        }, function error(response) {
            alert("Can't get Room");
        });

    $http.get(host + '/api/events')
        .then(function success(response) {
            $scope.allEvents = response.data.data;

            var arrEventId = [];
            $http.get(host + '/api/detailruleEvent/' + ruleId).success(function(response) {
                var data = response.data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        arrEventId.push(data[i].eventid);
                    }
                    $scope.eventID = arrEventId;
                }
            });
        }, function error(response) {
            alert("Can't get Event");
        });

    $http.get(host + '/api/getDetailTimeAccessByRuleId/' + ruleId).success(function(response) {
        var data = response.data;
        if (data.length > 0) {
            $scope.timeBegin = data[0].timebegin;
            $scope.timeEnd = data[0].timeend;
        }
    });

    $http.get(host + '/api/detailrulemaster/' + ruleId).success(function(response) {
        var data = response.data;
        if (data.length > 0) {
            $scope.title = data[0].title;
            $scope.message = data[0].message;
            $scope.description = data[0].description;
            $scope.priority = data[0].priority;
        }
    });

    $scope.updateTimeAccessRule = function() {
        var data = {};
        data.id = ruleId;
        data.tablename = tableName;
        data.title = $scope.title;
        data.message = $scope.message;
        data.description = $scope.description;
        data.timeBegin = $scope.timeBegin;
        data.timeEnd = $scope.timeEnd;
        data.priority = $scope.priority;
        data.roomID = $scope.roomID;
        data.eventID = $scope.eventID;
        data.datemodified = new Date();
        $http.get(host + '/api/detailtyperule/' + ruleId + '/timeaccess').then(function success(response) {
            data.templateId = response.data.data[0].id;
            data.typetemplateid = response.data.data[0].typetemplateid;
            $http({
                method: "PUT",
                url: host + '/api/updateRuleMaster',
                data: data
            }).then(function success(response) {

                alert("Updated StayHour");
                $state.go('home.rule');
            }, function error(response) {
                alert("Can't update info StayHour");
                $state.go('home.rule');
            });
        });
    }
}]);
