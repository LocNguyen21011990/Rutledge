app.controller('rulemasterCtrl', ['$scope', '$filter', '$http', 'ConfigService', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', function($scope, $filter, $http, ConfigService, DTColumnBuilder, DTOptionsBuilder, $compile, $state) {

    var host = ConfigService.host;
    $http.get(host + '/api/typetemplates')
        .then(function success(response) {
            $scope.allTypeTemplate = response.data.data;
            $scope.typetemplateID = $scope.allTypeTemplate[0].id + ',' + $scope.allTypeTemplate[0].tablename;
        }, function error(response) {
            alert("Can't get type template");
        });

    $scope.addrule = function(typetemplateID) {
        var temp = typetemplateID.split(',');
        var ttpID = temp[0];
        var ttpTablename = temp[1];

        switch (ttpTablename) {
            case 'stayhour':
                $state.go('home.rule.stayhour', { ttpID: ttpID });
                break;
            case 'timeaccess':
                $state.go('home.rule.timeaccess', { ttpID: ttpID });
                break;
        }
    }

    $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/rulemasters').withDataProp('data')
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        })
        .withOption('order', [4, 'asc']);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('title').withTitle('Title'),
        DTColumnBuilder.newColumn('message').withTitle('Message'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('typetemplate').withTitle('Type Template'),
        DTColumnBuilder.newColumn('priority').withTitle('Priority'),
        DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
        DTColumnBuilder.newColumn('datemodified').withTitle('Modified At').renderWith(renderDate),
        DTColumnBuilder.newColumn('rid').withTitle('Actions').renderWith(getOnlyId)
    ];

    function renderStatus(data) {
        return data == 1 ? 'Active' : 'InActive';
    }

    function renderDate(data) {
        return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
    }

    function getOnlyId(data, type, full, meta) {
        var tablename = full.tablename;
        var status = full.active;
        var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
        return '<div class="row  option-box">' +
            '<i class="fa fa-bars btn btn-info" ng-click="detail(\'' + full.rid + '\',\'' + full.tablename + '\')"></i>' +
            '<i class="fa fa-edit btn btn-info" ng-click="edit(\'' + full.rid + '\',\'' + full.tablename + '\')"></i>' +
            '</div>';
    }
    $scope.dtInstance = {};

    $scope.detail = function(rulemasterID, tablename) {

        $state.go('home.rule.detail', { rulemasterID: rulemasterID, tablename: tablename });
    }

    $scope.edit = function(rulemasterID, tablename) {
        if (tablename == 'stayhour') {
            $state.go('home.rule.editstayhour', { rulemasterID: rulemasterID, tablename: tablename });
        } else if (tablename == 'timeaccess') {
             $state.go('home.rule.edittimeaccess', { rulemasterID: rulemasterID, tablename: tablename });
        }
    }

    $http.get(host + '/api/events')
        .then(function success(response) {
            $scope.events = response.data.data;
        }, function error(response) {
            alert("Can't get events");
        });

    $scope.viewRuleByEvent = function(eventID) {

        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/viewDetailEvents/' + eventID).withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('order', [1, 'asc']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('eventname').withTitle('Event'),
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('message').withTitle('Message'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('typetemplate').withTitle('Type Template'),
            DTColumnBuilder.newColumn('priority').withTitle('Priority'),
            DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Modified At').renderWith(renderDate),
            DTColumnBuilder.newColumn('rid').withTitle('Actions').renderWith(getOnlyId)
        ];
    }

    $http.get(host + '/api/ruleroom')
        .then(function success(response) {
            $scope.ruleRooms = response.data.data;
        }, function error(response) {

        });

    $scope.viewRuleByRoom = function(roomid) {
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getRuleByRoom/' + roomid).withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('order', [0, 'asc']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('room').withTitle('Room'),
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('message').withTitle('Message'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('typetemplate').withTitle('Type Template'),
            DTColumnBuilder.newColumn('priority').withTitle('Priority'),
            DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Modified At').renderWith(renderDate),
            DTColumnBuilder.newColumn('rid').withTitle('Actions').renderWith(getOnlyId)
        ];
        $scope.dtInstance = {};
    }

    $scope.reloadPage = function() {
        window.location.reload();
    }
}]);
