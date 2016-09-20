app.controller('editSiteTreeCtrl', ['$scope', '$http', 'ConfigService', 'md5', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile', '$state', '$filter',
    function($scope, $http, ConfigService, md5, DTColumnBuilder, DTOptionsBuilder, $compile, $state, $filter) {

        var host = ConfigService.host;
        $scope.host = host;
        var pageId = $state.params.pageID;

        $http.get(host + '/api/getPageById/' + pageId).success(function(response) {
            var data = response.data;
            if (data.length > 0) {

                $scope.title = data[0].title;
                $scope.link = data[0].link;
                $scope.icon = data[0].icon;
                $scope.keyLanguage = data[0].keylanguage;
                $scope.sortOrder = data[0].sortorder;
                $scope.showInMenu = data[0].showmenu;
                $scope.status = data[0].status;
            } else {
                alert("Can't not get info Page");
            }
        });

        $scope.updatePage = function() {
            var data = {};
            data.title = $scope.title;
            data.link = $scope.link;
            data.icon = $scope.icon;
            data.keyLanguage = $scope.keyLanguage;
            data.showInMenu = $scope.showInMenu;
            data.status = $scope.status;
            data.sortOrder = $scope.sortOrder;
            data.datemodified = new Date();
            $http({
                    method: "PUT",
                    url: host + '/api/updatePage/' + pageId,
                    data: data
                })
                .then(function success(response) {
                    $state.go('home.sitetree');
                }, function error(response) {
                    alert("Can not update");
                });
        }
    }
]);
