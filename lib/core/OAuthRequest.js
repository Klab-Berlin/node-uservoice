var q = require('q');
var querystring = require('querystring');
var OAuth = require('oauth').OAuth;

var OAuthRequest = function( server, oauth ) {
	console.log( server, oauth );
	this.options = {
		domain: server.domain || 'uservoice.com',
		subdomain: server.subdomain,

		consumer_key: oauth.consumer_key,
		consumer_secret: oauth.consumer_secret,
		oauth_token: oauth.oauth_token || null,
		oauth_secret: oauth.oauth_secret || null
	};

	this.options.base = [
		'https://',
		this.options.subdomain,
		'.',
		this.options.domain
	].join(''),

	this.request = new OAuth(
		this.options.base + "/api/v1/oauth/request_token.json",
		this.options.base + "/api/v1/oauth/access_token.json",
		this.options.consumer_key,
		this.options.consumer_secret,
		"1.0A",
		null,
		"HMAC-SHA1"
	);
};

OAuthRequest.prototype._handleResponse = function( promise, error, result ) {
	if( error )
		return promise.reject(error);

	result = JSON.parse(result);

	if( result.errors || result.error )
		return promise.reject(result);

	return promise.resolve(result);
};

OAuthRequest.prototype.delete = function( path, data ) {
	var a = q.defer();

	this.request.delete(
		thisoptions.base + path + querystring.stringify(data),
		this.options.oauth_token,
		this.options.oauth_secret,
		this._handleResponse.bind(this, a)
	);

	return a.promise;
};

OAuthRequest.prototype.get = function( path, data ) {
	var a = q.defer();

	this.request.get(
		this.options.base + path + querystring.stringify(data),
		this.options.oauth_token,
		this.options.oauth_secret,
		this._handleResponse.bind(this, a)
	);

	return a.promise;
};

OAuthRequest.prototype.put = function( path, data ) {
	var a = q.defer();

	this.request.put(
		this.options.base + path,
		this.options.oauth_token,
		this.options.oauth_secret,
		JSON.stringify(data),
		'application/json',
		this._handleResponse.bind(this, a)
	);

	return a.promise;
};

OAuthRequest.prototype.post = function( path, data ) {
	var a = q.defer();

	this.request.post(
		this.options.base + path,
		this.options.oauth_token,
		this.options.oauth_secret,
		JSON.stringify(data),
		'application/json',
		this._handleResponse.bind(this, a)
	);

	return a.promise;
};

module.exports = OAuthRequest;