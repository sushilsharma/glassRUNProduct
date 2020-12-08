app.service("ControlTowerService", function ($http, $rootScope, $state) {



	//var localbaseUrl = "http://54.72.44.112:8088";
	var localbaseUrl = "http://localhost:56393";
	
	this.GetGlobalCount = function (controlTowerData) {

		var request = $http(
			{
				url: localbaseUrl + "/ControlTower/ControlTowerGlobalCount",
				data: controlTowerData,
				async: false,
				method: "post",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"

			}).success(function (data, status, headers, config) {
				return data;
			}).error(function (data, status, headers, config) {
				console.log(status);
			});
		return request;
	};

	this.GetControlTowerConfiguration = function (controlTowerData) {

		var request = $http(
			{
				url: localbaseUrl + "/ControlTower/ControlTowerConfiguration",
				data: controlTowerData,
				async: false,
				method: "post",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"

			}).success(function (data, status, headers, config) {
				return data;
			}).error(function (data, status, headers, config) {
				console.log(status);
			});
		return request;
	};


});