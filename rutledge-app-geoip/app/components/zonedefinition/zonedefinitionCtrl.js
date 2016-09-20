app.controller('zonedefinitionCtrl', ['$scope', '$http', 'ConfigService', '$uibModal', '$window'
	, function($scope, $http, ConfigService, $uibModal, $window) {

    var host = ConfigService.host;
    $scope.host = host;

    $http.get(host + '/api/getAllCitys').success(function (res) {
    	$scope.cities = res.data;
    })

    $scope.changeCity = function (id) {
    	$http.get(host + '/api/drill/' + id).success(function (res) {
	    	$scope.drills = res.data;
	    	if($scope.drills.length > 0) {
	    		$scope.isShowDrill = true;
	    		$scope.isShowZone = false;
	    		$scope.isShowRoom = false;
	    	}
	    	else {
	    		$scope.isShowDrill = false;
	    		$scope.isShowZone = false;
	    		$scope.isShowRoom = false;
	    	}
	    })
    }

    $scope.changeDrill = function (id) {
    	$http.get(host + '/api/zone/' + id).success(function (res) {
	    	$scope.zones = res.data;
	    	if($scope.zones.length > 0) {
	    		$scope.isShowZone = true;
	    		$scope.isShowRoom = false;
	    	}
	    	else {
	    		$scope.isShowZone = false;
	    		$scope.isShowRoom = false;
	    	}
	    })
    }

    $scope.changeZone = function (id) {
    var value=id.split(",");
    var zoneId = value[0];
    	$http.get(host + '/api/room/' + zoneId).success(function (res) {
	    	$scope.rooms = res.data;
	    	if($scope.rooms.length > 0) {
	    		$scope.isShowRoom = true;
	    		$scope.isShowBtnZone = true;
	    		$scope.isShowBtnLoadRoom = true;
	    	}
	    	else {
	    		$scope.isShowRoom = false;
	    		$scope.isShowBtnZone = false;
	    		$scope.isShowBtnLoadRoom = false;
	    	}
	    })
    }

    $scope.changeRoom = function (id) {
    	if(id != "") {
    		$scope.isShowBtnRoom = true;
    	}
    	else {
    		$scope.isShowBtnRoom = false;
    	}
    }

  	$scope.animationsEnabled = true;

  	$window.openModal = function (id) {
  		var size = "lg";
	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	        roomID: function () {
	        	return id
	        }
	      }
	    });
	  };

	  $scope.toggleAnimation = function () {
	    $scope.animationsEnabled = !$scope.animationsEnabled;
	  };
}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, roomID, DTOptionsBuilder, DTColumnBuilder) {

  	$scope.dtOptions = DTOptionsBuilder.fromSource('http://localhost:8081/api/getHumanInRoom/' + roomID).withDataProp('data');

	$scope.dtColumns = [
	    DTColumnBuilder.newColumn('status').withTitle('Status').renderWith(setStatusText),
	    DTColumnBuilder.newColumn('username').withTitle('User Name'),
	    DTColumnBuilder.newColumn('roomname').withTitle('Room'),
	    DTColumnBuilder.newColumn('zonename').withTitle('Zone'),
	    DTColumnBuilder.newColumn('drillname').withTitle('Drill'),
	    DTColumnBuilder.newColumn('cityname').withTitle('City')
	];

	function setStatusText(data, type, full, meta) {
        var txt = '';
        if(data == 1) {
            txt = 'In Room';
        }
        else {
            txt = 'Out Room'
        }
        return txt;
    }



  	$scope.okModal = function () {
    	$uibModalInstance.close();
  	};
});