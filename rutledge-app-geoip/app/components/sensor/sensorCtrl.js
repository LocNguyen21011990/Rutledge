app.config(['ChartJsProvider', function(ChartJsProvider) {
    ChartJsProvider.setOptions({
        responsive: false
    });

    ChartJsProvider.setOptions('Line', {
        datasetFill: true
    });
}])


app.controller('sensorCtrl', ['$scope','$q', '$interval', '$rootScope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'ConfigService', '$timeout',
    function($scope,$q, $interval, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder, $compile, ConfigService, $timeout) {

        var host = ConfigService.host;
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + "/api/getSensorByTenantID/4")
            .withDataProp('data')
            .withOption('rowCallback', rowCallback)
            .withOption('createdRow', createdRow)
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('sensorID').withTitle('').renderWith(renderIcon),
            DTColumnBuilder.newColumn('sensorID').withTitle('ID'),
            DTColumnBuilder.newColumn('sensorMAC').withTitle('MAC Address'),
            DTColumnBuilder.newColumn('sensorType').withTitle('Type'),
            DTColumnBuilder.newColumn('sensorIP').withTitle('IP Address'),
            DTColumnBuilder.newColumn('h2s').withTitle('H2S'),
            DTColumnBuilder.newColumn('temp').withTitle('Temp'),
            DTColumnBuilder.newColumn('heartbeat').withTitle('Heartbeat')
        ];



        $scope.dtInstance = {};
        $scope.searchtest = function() {
            $scope.dtOptions = DTOptionsBuilder
                .fromSource(host + "/api/getSensorByTenantID/3").withDataProp('data');;
            $scope.dtInstance.reloadData();
        }



        function createdRow(row, data, dataIndex) {}
        $scope.tab = 1;

        function renderIcon(data) {
            return '<i class="glyphicon glyphicon-plus-sign"></i>';
        }

        function rowCallback(tabRow, data, dataIndex) {
            $(tabRow).unbind('click');
            $(tabRow).on('click', function() {

                var icon = $(this).find('.glyphicon');
                var tr = $(tabRow);
                var table = $scope.dtInstance.DataTable;
                var row = table.row(tr);
                var scope = $scope.$new(true);
                scope.tab = 1;
                if (row.child.isShown()) {
                    icon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    scope.sensorID=row.data().sensorID;
                    
                    fc1(row,scope);
                    icon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');


                    
                    childInfoDetail(row.data(), scope);
                    childHistory(row.data(), scope);
                    
                    tr.addClass('shown');
                }
            });
        }

        var fc1 = function (row,scope){
            showchart(row, scope);
        }
        var fc2 = function(row,scope){
            row.child($compile('<div tmpl class="clearfix"></div>')(scope)).show();
        }

        var childInfoDetail = function(data, scope) {
            var sensorID = data.sensorID;
            $http.get(host+'/api/getDetailSensor/' + sensorID).then(function(resutl) {
                scope.sensorDetail = resutl.data.data[0];
            });
        }

        var childHistory = function(data, scope) {
            var sensorID = data.sensorID;
            $http.get(host+'/api/getTopFiveHistory/' + sensorID).then(function(resutl) {
                scope.topFive = resutl.data.data;
            })
        }

        var showchart = function(dataRow, scope) {
    
            var sensorID = dataRow.data().sensorID;
            $http.get(host+'/api/getTopFiveHistory/' + sensorID).then(function(resutl) {
                function getTimeCreate(resutl) {
                    var times = [];
                    for (var i = 0; i < resutl.length; i++) {
                        var date = new Date(resutl[i].createDate);
                        var formatDate = date.toLocaleString();
                        times.push(formatDate);
                    }
                    return times;
                }

                function getH2S(resutl){

                    var h2s =[];

                    for (var i = 0; i < resutl.length; i++) {
                        h2s.push(resutl[i].h2s);
                    }
                    return h2s;
                }
                var times = [];
                times = getTimeCreate(resutl.data.data);


                scope["labels"] = times;
                scope["series"] = ['H2S A'];
                var h2s = [];
                h2s = getH2S(resutl.data.data);
                scope["data"] = [
                    h2s
                ];

                fc2(dataRow,scope);

            });
        };

        $scope.exportFile = function() {
            var blob = new Blob([document.getElementById('sensorTable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        }

        var stop;
        $scope.reLoad = function() {
            stop = $interval(reloadData, $scope.iInterval * 1000);
        }

        function reloadData() {
            $scope.dtOptions = DTOptionsBuilder
                .fromSource(host + "/api/getSensorByTenantID/4").withDataProp('data');
            $scope.dtInstance.reloadData();
        }

        $scope.stopLoad = function() {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };

        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            $scope.stopLoad();
        });
    }
]);

app.directive('tmpl', testComp);

function testComp($compile) {
    var directive = {};
    directive.restrict = 'A';
    directive.templateUrl = '/app/components/sensor/sensor-detail.html';
    directive.transclude = true;
    directive.link = function(scope, element, attrs) {

    }
    return directive;
}
