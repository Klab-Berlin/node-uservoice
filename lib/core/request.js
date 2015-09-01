var q = require('q');
var querystring = require('querystring');
var http = require('http');

var Request = function( args ) {
	this.options = {
		subdomain: args.subdomain,
		domain: 'uservoice.com'
	};
	this.base = [
		this.options.subdomain,
		this.options.domain
	].join('.');
};

Request.prototype._handleResponse = function( response, promise ) {
	var answer = "";

	response.setEncoding('utf8');

	response.on('data', function( chunk ) {
		answer += chunk.toString();
	});

	response.on('end', function() {
		var json = JSON.parse(answer);
		if( json.errors )
			promise.reject(json.errors);
		else
			promise.resolve(json);
	});
}

Request.prototype.getRequest = function( path, data ) {
	var self = this;
	var a = q.defer();

	var path = [
		'http://',
		this.base,
		path
	].join('');

	http
		.get(path, function( response ) {
			self._handleResponse( response, a );
		})
		.on('error', function( e ) {
			a.reject(e);
		});

	return a.promise;
};

Request.prototype.postRequest = function( path, data ) {
	var a = q.defer();
	var self = this;
	var data = querystring.stringify(data);
	var options = {
		hostname: this.base,
		port: 80,
		path: path,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length
		}
	};

	var request = http.request(
		options,
		function( response ) {
			self._handleResponse( response, a );
		}
	);

	request.on(
		'error',
		function( e ) {
			a.reject( e );
		}
	);

	request.write(data)
	request.end();

	return a.promise;
};

module.exports = function( args ) {
	return new Request(args);
};