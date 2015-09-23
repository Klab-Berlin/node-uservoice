var OAuthRequest = require('./core/OAuthRequest');
var MockRequest = require('./core/MockRequest');
var TicketModule = require('./modules/tickets');
var SupportQueueModule = require('./modules/supportQueues');

var UserVoice = function( args ) {
	console.log("Init UserVoice as Mock: ", !!args.mock);
	if( args.mock )
		this.oauth = new MockRequest();
	else
		this.oauth = new OAuthRequest(args.uservoice, args.oauth);

	this.registerModules([
		TicketModule,
		SupportQueueModule
	]);
};

UserVoice.prototype.registerModules = function( modules ) {
	var self = this;
	modules.forEach(function( Module ) {
		var module = new Module( self.oauth );
		module.register(self);
	});
};

module.exports = UserVoice;