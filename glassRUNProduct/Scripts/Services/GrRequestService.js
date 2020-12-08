
app.service( "GrRequestService", function ( $http, $rootScope, $state ) {

	var localbaseUrl = "";
	//Function to get all records Item
	this.ProcessRequest = function ( ItemData ) {
		
		var request = $http(
			{
				url: localbaseUrl + "/api/grRequest/ProcessRequest",
				data: ItemData,
				async: false,
				method: "post",
				headers: {
					'Authorization': $rootScope.Token,
					'UserId': $rootScope.UserId
				}
			} ).
			success( function ( data, status, headers, config ) {

				return data;
			} ).
			error( function ( data, status, headers, config ) {

				//if (status = 401) {


				//    $state.go('loginContent');
				//}


				var sdf;
			} );

		return request;
	};

	


	//var newAPIbaseUrl = "http://localhost:59138";
	var newAPIbaseUrl = "http://localhost:56393";
	//Function to get enquiries of customer
	this.OrderSchedulingService = function ( orderData ) {

		console.log( JSON.stringify( orderData ) );

		var request = $http(
			{
				url: newAPIbaseUrl + "/Scheduling/OrderScheduling",
				data: orderData,
				async: false,
				method: "post",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"
			} ).success( function ( data, status, headers, config ) {
				return data;
			} ).error( function ( data, status, headers, config ) {
				console.log( status );
			} );
		return request;
	};


	
	this.UpdateSequence = function ( enquiryData ) {

		var request = $http(
			{
				url: newAPIbaseUrl + "/Scheduling/UpdateSequence",
				data: enquiryData,
				async: false,
				method: "post",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"

			} ).success( function ( data, status, headers, config ) {
				return data;
			} ).error( function ( data, status, headers, config ) {
				console.log( status );
			} );
		return request;
	};


	this.UpdateDeliveryConfirmationByDriver = function ( enquiryData ) {

		var request = $http(
			{
				url: newAPIbaseUrl + "/OrderMovement/UpdateDeliveryConfirmationByDriver",
				data: enquiryData,
				async: false,
				method: "post",
				dataType: 'json',
				contentType: "application/json; charset=utf-8"

			} ).success( function ( data, status, headers, config ) {
				return data;
			} ).error( function ( data, status, headers, config ) {
				console.log( status );
			} );
		return request;
	};

	






this.ProcessRequestForServiceBuffer = function ( ItemData ) {

	var request = $http(
		{
			url: localbaseUrl + "/api/grRequest/ProcessRequestForBuffer",
			data: ItemData,
			async: false,
			method: 'POST',
			responseType: 'arraybuffer'
		} ).
		success( function ( data, status, headers, config ) {
			return data;
		} );

	return request;
};


this.ProcessRequestForServiceBufferExcelExport = function ( ItemData ) {

	var request = $http(
		{
			url: localbaseUrl + "/api/grRequest/ProcessRequestForExcelExport",
			data: ItemData,
			async: false,
			method: 'POST',
			responseType: 'arraybuffer'
		} ).
		success( function ( data, status, headers, config ) {
			return data;
		} );

	return request;
};






this.SaveConsumer = function ( file ) {


	var fd = new FormData();
	fd.append( 'file', file );
	var request = $http.post( "http://localhost:21657" + "/api/UploadEnquiryST/BulkInserSTOrder", fd,
		{
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		} ).success( function ( data, status, headers, config ) {


			return data;
		} );
	return request;

};

this.LogOut = function ( ItemData ) {
	var request = $http( {

		url: localbaseUrl + "/api/grRequest/LogOut",
		data: ItemData,
		async: false,
		method: "POST"
	} ).success( function ( data, status, headers, config ) {

		return data;
	} ).error( function ( data, status, headers, config ) {
		console.log( status );
	} );

	return request;
};




});


