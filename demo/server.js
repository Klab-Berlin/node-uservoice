var uservoice = require('../lib');
var http = require('http');
var fs = require('fs');
var url = require('url');

var config = {
	base: __dirname,
	public: __dirname + '/public',
	views: __dirname + '/public/views'
};

var connections = {};

var helpers = {
	generateId: function() {
		var generate = function() {
			var sub = function() {
				return ((Math.random() * 90000 + 10000) | 0).toString(16);
			};

			return [
				sub(),
				sub(),
				sub(),
				sub()
			].join('-');
		};

		var id = generate();
		while( id in connections ) {
			id = generate();
		}

		return id;
	},
	addErrorHandler: function() {
		routes.all( '', function( request, response ) {
			console.log("ERROR.");
			response.json({
				error: request.url + ' not found.'
			}, 404);
		});

		return this;
	},
	parseBody: function( request, response, callback ) {
		var body = "";
		request.on('data', function( buffer ) {
			body += buffer.toString();
		});

		request.on('end', function() {
			request.json = JSON.parse(body);
			return callback( request, response );
		});
	},
	parseQuery: function( request ) {
		request.query = url.parse(request.url, true).query;
	},
	render: function( path ) {
		var self = this;
		var absPath = config.public + '/' + path;
		var file = fs.createReadStream(absPath);
		file.on(
			'error',
			function( error ) {
				self.json({error: 'Reading file.'}, 500);
			}
		);
		file.on(
			'close',
			function( error ) {
				self.end();
			}
		);
		file.pipe(this);
	},
	json: function( data, statusCode ) {
		console.log(JSON.stringify(data));
		this.statusCode = statusCode || 200;
		this.setHeader("Content-Type", "application/json");
		this.end(JSON.stringify(data), 'utf8');
	},
	wrap: function( handler, method ) {
		var self = this;
		var jsonMethod = ['POST', 'PUT', 'DELETE'];
		return function( request, response ) {
			response.render = self.render.bind(response);
			response.json = self.json.bind(response);

			self.parseQuery(request);

			if( jsonMethod.indexOf(method.toUpperCase()) != -1 ) {
				return self.parseBody( request, response, handler );
			} else {
				return handler( request, response );
			}
		};
	}
};

var routes = {
	mappings: {
		GET: [],
		POST: [],
		UPDATE: [],
		DELETE: []
	},
	_handle: function( request, response ) {
		var path = request.url;
		var headers = request.headers;
		var method = request.method;

		console.log("Handle [%s] %s", method, path);

		var handlers = this.mappings[method.toUpperCase()];
		for( var i = 0; i < handlers.length; i++ ) {
			var handler = handlers[i];
			if( path.match(handler.regex) )
				return handler.fct(request, response);
		}
	},
	_addHandler: function( method, regex, callback ) {
		this.mappings[method].push(
			{
				regex: regex,
				fct: helpers.wrap(callback, method)
			}
		);

		this.mappings[method].sort(function( a, b ) {
			return b.regex.length - a.regex.length;
		});
	},
	get: function( regex, callback ) {
		this._addHandler('GET', regex, callback);
	},
	post: function( regex, callback ) {
		this._addHandler('POST', regex, callback);
	},
	update: function( regex, callback ) {
		this._addHandler('UPDATE', regex, callback);
	},
	delete: function( regex, callback ) {
		this._addHandler('DELETE', regex, callback);
	},
	all: function( regex, callback ) {
		var self = this;
		Object.keys(this.mappings)
			.forEach(function( method ) {
				self._addHandler(method, regex, callback);
			});
	}
};

helpers.addErrorHandler();

routes.get('/api/.*', function( request, response ) {
	var uservoiceId = request.headers['uservoice-id'];
	if( !uservoiceId )
		return response.json({
			error: 'Specify a uservoice to use.'
		}, 500);
	var uservoice = connections[uservoiceId];
	var regex = /\/api\/(.+)\/(.+)(?:\/(.+)?)?/;
	var data = request.url.match(regex);
	if( !data )
		return response.json({
			error: 'Invalid url.'
		}, 500);
	var module = data[1];
	var method = data[2];
	var id = data.length == 4 ? data[3] : undefined;

	uservoice[module][method](id || request.query, request.query)
		.then(function( result ) {
			response.json(result);
		})
		.fail(function( error ) {
			response.json({
				error: error
			}, 500);
		})
		.catch(function( error ) {
			response.json({
				error: error
			}, 500)
		})
});

routes.post('/api', function( request, response ) {
	var uv = new uservoice({
		uservoice: {
			domain: request.json.domain,
			subdomain: request.json.subdomain
		},
		oauth: {
			consumer_key: request.json.consumerKey,
			consumer_secret: request.json.consumerSecret
		}
	});
	var id = helpers.generateId();
	connections[id] = uv;
	response.json({
		id: id
	});
});

routes.get('/views', function( request, response) {
	response.render(request.url);
});

routes.get('/assets', function( request, response ) {
	response.render(request.url);
});

routes.get('/', function( request, response ) {
	response.render('index.html');
});

var server = http.createServer(routes._handle.bind(routes));
	server.listen(5000, '127.0.0.1', function() {
		console.log("Server started.");
		console.log(
			"Listening on %s:%s",
			"127.0.0.1",
			5000
		);
	});