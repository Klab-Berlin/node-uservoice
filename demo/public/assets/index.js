angular
	.module('uservoice', [
		'uservoice.authentication',
		'uservoice.tickets',
		'uservoice.request'
	])
	.directive('uservoice', [
		function() {
			return {
				restrict: 'E',
				templateUrl: '/views/app.tpl.html',
				controller: 'uservoiceController',
				replace: false
			};
		}
	])
	.controller('uservoiceController', [
		'$scope',
		'uservoice.authentication.AuthenticationService',
		function( $scope, AuthenticationService ) {
			$scope.isAuthenticated = AuthenticationService
				.isAuthenticated.bind(AuthenticationService);

			$scope.resources = {
				Tickets: true,
				Categories: false,
				Reports: false,
				'Support Queues': false
			};

			$scope.activate = function( resource ) {
				for( var key in $scope.resources )
					$scope.resources[key] = key == resource;
			};
		}
	]);