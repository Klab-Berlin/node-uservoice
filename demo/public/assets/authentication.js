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

			var hasLocalStorage = function() {
				return window.localStorage;
			};

			var store = function() {
				if( hasLocalStorage() )
					localStorage.setItem('uservoice-credentials', JSON.stringify(credentials));
			};

			(function retrieve() {
				if( hasLocalStorage() ) {
					var retrieved = localStorage.getItem('uservoice-credentials');
					if( retrieved ) {
						try {
							credentials = JSON.parse(retrieved);
						} catch(e) {
							localStorage.removeItem('uservoice-credentials');
						}
					}
				}
			})();

			this.setCredentials = function( args ) {
				Object.keys(args)
					.forEach(function(key) {
						credentials[key] = args[key] || credentials[key]
					});

				return this;
			};

			this.getCredentials = function() {
				return credentials;
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
							store();
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
			$scope.arguments = AuthenticationService.getCredentials();

			$scope.authenticating = false;
			$scope.error = null;

			$scope.authenticate = function() {
				$scope.authenticating = true;
				AuthenticationService
					.authenticate(function( error, result ) {
						if( error ) {
							$scope.error = error;
						}

						$scope.authenticating = false;
					})
			}
		}
	]);