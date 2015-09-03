angular.module('uservoice.tickets', [])
	.service('uservoice.tickets.TicketsService', [
		'uservoice.request.RequestService',
		function( RequestService ) {
			var tickets = [];

			this.getTickets = function() {
				return tickets;
			};

			this.loadTickets = function() {
				RequestService
					.get('/api/tickets/list')
					.then(
						function( result ) {
							result.data.tickets
							.forEach(function( ticket ) {
								tickets.push(ticket);
							});
						}
					);
			};

			this.loadTickets();
		}
	])
	.directive('uservoiceTicketsList', [
		function() {
			return {
				restrict: 'E',
				templateUrl: 'views/tickets/tickets-list.tpl.html',
				controller: 'uservoiceTicketsListController'
			};
		}
	])
	.controller('uservoiceTicketsListController', [
		'$scope',
		'uservoice.tickets.TicketsService',
		function( $scope, TicketsService ) {
			$scope.tickets = TicketsService.getTickets();
		}
	]);