// try to get a new app access token
require('oauth').appToken({ forceNew: true });

Alloy.Globals.APP.init();

// redirect based on login
require('oauth').validateToken({
    success: function() {
        Ti.App.Properties.setBool("location_flag", true);
        Alloy.Globals.APP.navigatorOpen('home');
    },
    error: function(){
        Alloy.Globals.APP.navigatorOpen('login', { navigationWindow: false });
    }
});