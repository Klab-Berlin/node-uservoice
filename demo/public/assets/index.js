angular
	.module('uservoice', [
		'uservoice.authentication',
		'uservoice.tickets',
		'uservoice.request'
	])
	.run([
		'$rootScope',
		'uservoice.authentication.AuthenticationService',
		function( $rootScope, AuthenticationService ) {
			$rootScope.isAuthenticated = AuthenticationService
				.isAuthenticated.bind(AuthenticationService);
		}
	]);