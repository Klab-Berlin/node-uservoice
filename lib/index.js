var OAuthRequest = require('./core/OAuthRequest');
var TicketModule = require('./modules/tickets');

var UserVoice = function( args ) {
	this.oauth = new OAuthRequest(args.uservoice, args.oauth);

	this.registerModules([
		TicketModule
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