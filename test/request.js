var expect = require('expect.js');
var Request = require('../lib/core/request');

describe('Request', function() {
	describe('post request', function() {
		var request;
		beforeEach(function() {
			request = new Request({
				subdomain: 'meinunterricht'
			});
		});

		it('should resolve with data', function( done ) {
			request
				.postRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.then(function( data ) {
					expect(data).to.be.ok;
				})
				.fail(function( error ) {
					expect(error).to.be.ok;
				})
				.finally(function() {
					done();
				});
		});

		it('should fail without authentication', function( done ) {
			var error = new Error('Resolved request.');
			request
				.postRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.fail(function( e ) {
					done();
				});
		});

		it('should fail with json object', function( done ) {
			var error = new Error('Resolved request.');
			request
				.postRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.fail(function( e ) {
					expect( e ).to.be.an('object');
					done();
				});
		});
	});

	describe('get request', function() {
		var request;
		beforeEach(function() {
			request = new Request({
				subdomain: 'meinunterricht'
			});
		});

		it('should resolve with data', function( done ) {
			request
				.getRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.then(function( data ) {
					expect(data).to.be.ok;
				})
				.fail(function( error ) {
					expect(error).to.be.ok;
				})
				.finally(function() {
					done();
				});
		});

		it('should fail without authentication', function( done ) {
			var error = new Error('Resolved request.');
			request
				.getRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.fail(function( e ) {
					done();
				});
		});

		it('should fail with json object', function( done ) {
			var error = new Error('Resolved request.');
			request
				.getRequest('/api/v1/oauth/access_token.json ', {
					some: 'data'
				})
				.fail(function( e ) {
					expect( e ).to.be.an('object');
					done();
				});
		});
	});
});