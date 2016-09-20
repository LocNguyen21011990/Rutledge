app.controller('groupCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',
    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;

        $http.get(host + '/api/getPages').success(function(response) {
            $scope.allPages = response.data;

        });

        $scope.createGroup = function() {
            var data = {};
            data.name = $scope.name;
            data.description = $scope.description;
            data.pages = $scope.pageID;
            data.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/createGroup',
                data: data
            }).then(function success(response) {
                alert('Created group');
                $scope.dtInstance.reloadData();
            }, function error(response) {
                alert("Can not create Group");
            });
        }
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getAllGroup').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('order', [4, 'asc']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
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
            return '<div class="row  option-box">' +
                '<i class="fa fa-pencil-square-o btn btn-info" ng-click="edit(\'' + full.id + '\')"></i>' +
                '</div>';
        }
        $scope.dtInstance = {};

        $scope.edit = function(groupid) {
            $state.go('home.usergroup.edit', { groupID: groupid });
        }

    }
]);
app.controller('editGroupCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',

    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;
        var groupid = $state.params.groupID;
        $http.get(host + '/api/getPages').success(function(response) {
            $scope.allPages = response.data;
        });

        $http.get(host + '/api/getGroupById/' + groupid).success(function(response) {
            var data = response.data;
            if (data.length) {
                $scope.name = data[0].name;
                $scope.description = data[0].description;
            } else {
                alert("Can not get group");
            }
        });

        var arrPageID = [];
        $http.get(host + '/api/getPageByGroupId/' + groupid).success(function(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
                arrPageID.push(data[i].id);
            }
            $scope.pageID = arrPageID;
        });

        $scope.updateGroup = function() {
            var data = {};
            data.name = $scope.name;
            data.description = $scope.description;
            data.pages = $scope.pageID;
            data.datemodified = new Date();



            $http({
                    method: "PUT",
                    url: host + '/api/updateGroup/' + groupid,
                    data: data
                })
                .then(function success(response) {
                    $state.go('home.usergroup');
                }, function error(response) {
                    alert("Can not update");
                });
        }
    }
]);
