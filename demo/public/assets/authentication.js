angular.module('uservoice.authentication', [])
	.service('uservoice.authentication.AuthenticationService', [
		'$http',
		function( $http ) {
			var credentials = {
				domain: null,
				subdomain: null,
				consumerKey: null,
				consumerSecret: null
			};
			var uservoiceId = null;

			this.setCredentials = function( args ) {
				Object.keys(args)
					.forEach(function(key) {
						credentials[key] = args[key] || credentials[key]
					});

				return this;
			};

			this.authenticate = function( callback ) {
				if( !credentials.subdomain )
					return callback( 'Please specify a subdomain.' );
				if( !credentials.consumerKey )
					return callback( 'Please specify a consumer key.' );
				if( !credentials.consumerSecret )
					return callback( 'Please specify a consumer secret.' );

				$http
					.post(
						'/api',
						credentials
					)
					.then(
						function( result ) {
							uservoiceId = result.data.id;
							callback( null, uservoiceId );
						},
						callback
					);

				return this;
			};

			this.isAuthenticated = function() {
				return !!uservoiceId;
			};

			this.getUservoiceId = function() {
				return uservoiceId;
			};
		}
	])
	.directive('uservoiceAuthenticate', [
		function() {
			return {
				restrict: 'E',
				templateUrl: '/views/authentication/authentication-form.tpl.html',
				controller: 'uservoiceAuthenticateController'
			};
		}
	])
	.controller('uservoiceAuthenticateController', [
		'$scope',
		'uservoice.authentication.AuthenticationService',
		function( $scope, AuthenticationService ) {
			$scope.arguments = {
				domain: null,
				subdomain: null,
				consumerKey: null,
				consumerSecret: null
			};

			$scope.authenticating = false;
			$scope.error = null;

			$scope.authenticate = function() {
				$scope.authenticating = true;
				AuthenticationService
					.setCredentials($scope.arguments)
					.authenticate(function( error, result ) {
						if( error ) {
							$scope.error = error;
						}

						$scope.authenticating = false;
					})
			}
		}
	]);