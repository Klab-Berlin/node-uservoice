var Ticket = function( request ) {
	this.request = request;
};

Ticket.prototype.list = function() {
	return this.request
		.get('/api/v1/tickets.json');
};

Ticket.prototype.get = function() {};

Ticket.prototype.search = function() {};

Ticket.prototype.update = function() {};

Ticket.prototype.create = function( data ) {
	return this.request
		.post(
			'/api/v1/tickets.json',
			data
		);
};

Ticket.prototype.register = function( UserVoice ) {
	UserVoice['tickets'] = {
		list: this.list.bind(this),
		get: this.get.bind(this),
		search: this.search.bind(this),
		update: this.update.bind(this),
		create: this.create.bind(this)
	}
};

module.exports = Ticket;