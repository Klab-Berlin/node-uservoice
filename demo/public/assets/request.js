angular.module('uservoice.request', [])
	.service('uservoice.request.RequestService', [
		'$http',
		'uservoice.authentication.AuthenticationService',
		function( $http, AuthenticationService ) {
			this.get = function( path, data ) {
				return $http.get(
					path,
					{
						headers: {
							'Uservoice-Id': AuthenticationService.getUservoiceId()
						},
						params: data
					}
				);
			};

			this.post = function( path, data ) {
				return $http.post(
					path,
					data,
					{
						headers: {
							'Uservoice-Id': AuthenticationService.getUservoiceId()
						}
					}
				);
			};
		}
	]);