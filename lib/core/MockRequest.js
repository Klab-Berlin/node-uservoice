var q = require('q');

var Mock = function( server, oauth ) {};

Mock.prototype.delete = function( path, data ) {
	var a = q.defer();
	a.resolve(data);
	return a.promise;
};

Mock.prototype.get = function( path, data ) {
	var a = q.defer();
	a.resolve(data);
	return a.promise;
};

Mock.prototype.put = function( path, data ) {
	var a = q.defer();
	a.resolve(data);
	return a.promise;
};

Mock.prototype.post = function( path, data ) {
	var a = q.defer();
	a.resolve(data);
	return a.promise;
};

module.exports = Mock;