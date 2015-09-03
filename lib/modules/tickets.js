var Ticket = function( request ) {
	this.request = request;
};

Ticket.prototype.list = function() {
	return this.request
		.get('/api/v1/tickets.json');
};

Ticket.prototype.get = function( id ) {
	return this.request
		.get(
			'/api/v1/tickets/'+ id +'.json'
		);
};

Ticket.prototype.search = function( data ) {
	return this.request
		.get(
			'/api/v1/tickets/search.json',
			data
		);
};

Ticket.prototype.update = function( id, data ) {
	return this.request
		.put(
			'/api/v1/tickets/' + id + '.json',
			data
		);
};

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