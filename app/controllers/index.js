// try to get a new app access token
require('oauth').appToken({ forceNew: false });

Alloy.Globals.APP.init();

// redirect based on login
require('oauth').validateToken({
    success: function() {
        Alloy.Globals.APP.navigatorOpen('home');
    },
    error: function(){
        Alloy.Globals.APP.navigatorOpen('login', { navigationWindow: false });
    }
});