var SupportQueue = function( request ) {
	this.request = request;
};

SupportQueue.prototype.list = function() {
	return this.request
		.get('/api/v1/support_queues.json');
};

SupportQueue.prototype.get = function( id ) {
	return this.request
		.get(
			'/api/v1/support_queues/'+ id +'.json'
		);
};

SupportQueue.prototype.update = function( id, data ) {
	return this.request
		.put(
			'/api/v1/support_queues/' + id + '.json',
			data
		);
};

SupportQueue.prototype.create = function( data ) {
	return this.request
		.post(
			'/api/v1/support_queues.json',
			data
		);
};

SupportQueue.prototype.destroy = function( id ) {
	return this.request
		.delete(
			'/api/v1/' + id + '.json'
		);
};

SupportQueue.prototype.sort = function( data ) {
	return this.request
		.put(
			'/api/v1/support_queues/sort.json',
			data
		);
};

SupportQueue.prototype.register = function( UserVoice ) {
	UserVoice['supportQueues'] = {
		list: this.list.bind(this),
		get: this.get.bind(this),
		update: this.update.bind(this),
		create: this.create.bind(this),
		destroy: this.destroy.bind(this),
		sort: this.sort.bind(this)
	}
};

module.exports = SupportQueue;