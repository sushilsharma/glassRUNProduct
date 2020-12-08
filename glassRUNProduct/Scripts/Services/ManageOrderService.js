app.service("ManageOrderService", function ($http, $rootScope, $state) {

	//var localbaseUrl = "http://54.72.44.112:8088";
	var localbaseUrl = "http://localhost:56393";
	//Function to get enquiries of customer
	this.UpdateSequence = function (enquiryData) {

		var request = $http(
			{
				url: localbaseUrl + "/Scheduling/UpdateSequence",
				data: enquiryData,
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





	this.UpdateDeliveryConfirmationByDriver = function (enquiryData) {

		var request = $http(
			{
				url: localbaseUrl + "/OrderMovement/UpdateDeliveryConfirmationByDriver",
				data: enquiryData,
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

	//Function to get orders of customer
	this.LoadOrderDetails = function (orderData) {


		var request = $http(
			{
				url: localbaseUrl + "/Order/SearchOrderList",
				data: orderData,
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

	this.OrderDetailByOrderNumber = function (orderData) {


		var request = $http(
			{
				url: localbaseUrl + "/Order/OrderDetailByOrderNumber",
				data: orderData,
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


	this.SearchPalettesList = function (orderData) {


		var request = $http(
			{
				url: localbaseUrl + "/Order/SearchPalettesList",
				data: orderData,
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


	this.ExportToExcelForOrderList = function (ItemData) {

		var request = $http(
			{
				url: localbaseUrl + "/Order/ExportToExcelForOrderList",
				data: ItemData,
				async: false,
				method: 'POST',

				//responseType: 'arraybuffer'
			}).
			success(function (data, status, headers, config) {
				return data;
			});

		return request;
	};


	this.ExportToExcelForOrderListDetails = function (ItemData) {

		var request = $http(
			{
				url: localbaseUrl + "/Order/ExportToExcelForOrderListDetails",
				data: ItemData,
				async: false,
				method: 'POST',

				//responseType: 'arraybuffer'
			}).
			success(function (data, status, headers, config) {
				return data;
			});

		return request;
	};


	this.ExportToExcelForRPMOrderListDetails = function (ItemData) {

		var request = $http(
			{
				url: localbaseUrl + "/Order/ExportToExcelForRPMOrderListDetails",
				data: ItemData,
				async: false,
				method: 'POST',

				//responseType: 'arraybuffer'
			}).
			success(function (data, status, headers, config) {
				return data;
			});

		return request;
	};

	this.MarkOrderAsShipped = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/UpdateMultipleOrderStatus",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.UpdateOrderReceive = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/UpdateOrderReceive",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.RejectMultipleOrder = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/RejectMultipleOrder",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.GetFilterDataForGrid = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/GetFilterDataForGrid",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.ConfirmCountCheck = function (enquiryData) {

		var request = $http(
			{
				url: localbaseUrl + "/RPMOrder/RPMOrderDetailByOrderId",
				data: enquiryData,
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

	this.SaveConfirmCountQty = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/RPMOrder/SaveConfirmCountQty",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.LoadHistoricalDataTransactionDetails = function (orderData) {


		var request = $http(
			{
				url: localbaseUrl + "/Bay/SearchHistoricalDataTransactionList",
				data: orderData,
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


	//this.LoadQueueDetails = function (orderData) {


	//	var request = $http(
	//		{
	//			url: localbaseUrl + "/Order/LoadQueueDetails",
	//			data: orderData,
	//			async: false,
	//			method: "post",
	//			dataType: 'json',
	//			contentType: "application/json; charset=utf-8"

	//		}).success(function (data, status, headers, config) {

	//			return data;
	//		}).error(function (data, status, headers, config) {
	//			console.log(status);
	//		});
	//	return request;
	//};



	this.LoadQueueDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/LodQueueDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.GetUnassignedBayQueueDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/GetUnassignedBayQueueDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.LoadCapsuleDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/LoadCapsuleDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.CancelOrderAndReQueueSequenceNumber = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/CancelOrderAndReQueueSequenceNumber",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.LoadBayDetailsOnPopup = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/LoadBayDetailsOnPopup",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.UpdateBayDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/UpdateBayDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};




	this.ProceedToQueue = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/ProceedToQueue",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.UpdatePriorityDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/UpdatePriorityDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.GetAllBayList = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/GetAllBayList",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.DeactivatedAndActivatedBay = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/DeactivatedAndActivatedBay",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.UpdateTruckSequenceAfterLoadingEnd = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/UpdateTruckSequenceAfterLoadingEnd",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.LoadHorizontalQueueOnPopup = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/LoadHorizontalQueueOnPopup",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};
	this.LoadCustomerGroup = function (loadJson) {
		var request = $http({
			url: localbaseUrl + "/Product/GetCustomerGroupList",
			data: loadJson,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}
		}).success(function (data, status, headers, config) {
			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.GetSuperUserList = function (loadJson) {
		var request = $http({
			url: localbaseUrl + "/api/ManageLogin/GetSuperUserList",
			data: loadJson,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}
		}).success(function (data, status, headers, config) {
			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.SaveUserOutletMapping = function (loadJson) {
		var request = $http({
			url: localbaseUrl + "/api/ManageLogin/SaveUserOutletMapping",
			data: loadJson,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}
		}).success(function (data, status, headers, config) {
			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.UpdateBranchPlantForRPM = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/UpdateBranchPlantForRPM",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};

	this.GetOrderList = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/OrderList",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}
		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.LoadCapsuleDetails = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/LoadCapsuleDetails",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.LoadForkListActivityViewDetails = function (orderData) {


		var request = $http(
			{
				url: localbaseUrl + "/Bay/LoadForkListActivityViewDetails",
				data: orderData,
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



	this.UpdateBayForForkListDriver = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/UpdateBayForForkListDriver",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.GetAllBayListForForkLift = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/GetAllBayListForForkLift",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.UpdateRequestBay = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Bay/UpdateRequestBay",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.UpdateRejectOrder = function (OrderData) {
		//GetOrderapiUrl="http://localhost:56393";
		var request = $http({
			url: localbaseUrl + "/Order/RejectOrder",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.DownloadDeliveryNote = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/DeliveryNote",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};


	this.UpdateCancelOrder = function (OrderData) {
		//GetOrderapiUrl="http://localhost:56393";
		var request = $http({
			url: localbaseUrl + "/Order/CancelOrder",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



	this.MarkSingleOrderAsShipped = function (OrderData) {
		var request = $http({
			url: localbaseUrl + "/Order/UpdateOrderStatusWithWorkFlow",
			data: OrderData,
			async: false,
			method: "post",
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization': $rootScope.Token
			}

		}).success(function (data, status, headers, config) {

			return data;
		}).error(function (data, status, headers, config) {
			console.log(status);
		});
		return request;
	};



});