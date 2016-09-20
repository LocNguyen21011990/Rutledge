app.controller('userCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',
    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;
        $scope.status = 1;

        $http.get(host + '/api/getAllGroup').success(function(response) {
            $scope.allGroup = response.data;
        });

        $scope.signup = function() {
            var data = {};
            data.username = $scope.username;
            $http({
                method: "POST",
                url: host + '/api/checkUserNameExist',
                data: data
            }).then(function success(response) {
                if (response.data.data == 'false') {
                    alert($filter('translate')('DASHBOARD'));
                } else if (response.data.data == 'true') {
                    data.password = md5.createHash($scope.password || '');
                    data.fullname = $scope.fullname;
                    data.email = $scope.email;
                    data.group = $scope.groupID;
                    data.datecreated = new Date();
                    data.status = $scope.status;

                    $http({
                        method: "POST",
                        url: host + '/api/signup',
                        data: data
                    }).then(function success(response) {
                        alert('Created user');
                        $scope.dtInstance.reloadData();
                    }, function error(response) {
                        alert("Can not create user");
                    });
                }
            }, function error(response) {});

        }

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getAllUser').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('order', [4, 'des']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('username').withTitle('User name'),
            DTColumnBuilder.newColumn('fullname').withTitle('Full name'),
            DTColumnBuilder.newColumn('email').withTitle('Email'),
            DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(renderStatus),
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
            var status = full.status;
            var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
            return '<div class="row"><div class="option-tool"><button ng-click="detail(\'' + full.id + '\')">' +
                '<i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button ng-click="delete(\'' + data + '\',' + !status + ')">' +
                '<i class="fa ' + icon + '"></i>' +
                '</button>&nbsp;</div></div>';
        }

        $scope.dtInstance = {};

        $scope.detail = function(userid) {
            $state.go('home.users.edit', { userID: userid });
        }

        $scope.delete = function(userID, status) {
            var data = {};
            data.status = status;
            data.userID = userID;

            $http({
                method: "PUT",
                url: host + '/api/updateStatusUser',
                data: data
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
            }, function error(response) {
                alert("Can't change status.");
            });
        };

    }
]);

app.controller('editUserCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',
    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;
        var userid = $state.params.userID;

        $http.get(host + '/api/getAllGroup').success(function(response) {
            $scope.allGroup = response.data;
            $http.get(host + '/api/getUserById/' + userid).success(function(response) {
                var data = response.data;

                if (data.length > 0) {
                    $scope.username = data[0].username;
                    $scope.fullname = data[0].fullname;
                    $scope.email = data[0].email;
                    $scope.status = data[0].status;
                }
            });
            var arrGroupId = [];
            $http.get(host + '/api/getGroupByUserId/' + userid).success(function(response) {
                var data = response.data;
                for (var i = 0; i < data.length; i++) {
                    arrGroupId.push(data[i].id);
                }
                $scope.groupID = arrGroupId;
            });
        });

        $scope.updateUser = function() {
            var data = {};
            // data.password = md5.createHash($scope.password || '');
            data.fullname = $scope.fullname;
            data.email = $scope.email;
            data.group = $scope.groupID;
            data.status = $scope.status;
            data.datemodified = new Date();

            $http({
                    method: "PUT",
                    url: host + '/api/updateUser/' + userid,
                    data: data
                })
                .then(function success(response) {
                    $state.go('home.users');
                }, function error(response) {
                    alert("Can not update");
                });
        }
    }
]);
