app.controller('siteTreeCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',
    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;
        $scope.status = 1;
        $scope.showInMenu = 1;

        $scope.createPage = function() {
            var data = {};
            data.title = $scope.title;
            data.link = $scope.link;
            data.icon = $scope.icon;
            data.keyLanguage = $scope.keyLanguage;
            data.showInMenu = $scope.showInMenu;
            data.status = $scope.status;
            data.sortOrder = $scope.sortOrder;
            data.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/createPage',
                data: data
            }).then(function success(response) {
                alert('Created Page');
                $scope.dtInstance.reloadData();
            }, function error(response) {
                alert("Can not create page");
            });

        }

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/getPages').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('order', [4, 'des']);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('link').withTitle('Link'),
            DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(renderStatus),
            DTColumnBuilder.newColumn('showmenu').withTitle('Show In Menu').renderWith(renderShowInMenu),
            DTColumnBuilder.newColumn('datecreated').withTitle('Create At').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Modified At').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').withTitle('Actions').renderWith(getOnlyId)
        ];

        function renderStatus(data) {
            return data == 1 ? 'Active' : 'InActive';
        }

        function renderShowInMenu(data) {
            return data == 1 ? 'Yes' : 'No';
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOnlyId(data, type, full, meta) {
            var status = full.status;
            var showInMenu = full.showmenu;
            var icon = status == 1 ? 'fa-lock' : 'fa-unlock';
            var iconShow = showInMenu == 1 ? 'fa-eye' : 'fa-eye-slash';
            return '<div class="row"><div class="option-tool"><button ng-click="edit(\'' + full.id + '\')">' +
                '<i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button ng-click="delete(\'' + data + '\',' + !status + ')">' +
                '<i class="fa ' + icon + '"></i>' +
                '</button>&nbsp;</div></div>' +
                '<button ng-click="isShowMenu(\'' + data + '\',' + !showInMenu + ')">' +
                '<i class="fa ' + iconShow + '"></i>' +
                '</button>&nbsp;</div></div>';
        }

        $scope.dtInstance = {};

        $scope.edit = function(pageId) {
            $state.go('home.sitetree.edit', { pageID: pageId });
        }

        $scope.delete = function(pageId, status) {
            var data = {};
            data.status = status;
            data.pageId = pageId;
            $http({
                method: "PUT",
                url: host + '/api/updateStatusPage',
                data: data
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
            }, function error(response) {
                alert("Can't change status.");
            });
        };

        $scope.isShowMenu = function(pageId,showInMenu){

            var data = {};
            data.showmenu = showInMenu;
            data.pageId = pageId;
            $http({
                method: "PUT",
                url: host + '/api/showInMenu',
                data: data
            }).then(function success(response) {
                $scope.dtInstance.reloadData();
            }, function error(response) {
                alert("Can't change show in menu.");
            });
        }

    }
]);
