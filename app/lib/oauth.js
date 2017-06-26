var clientId     = Alloy.Globals.Secrets.backend.client_id,
    clientSecret = Alloy.Globals.Secrets.backend.client_secret,
    baseUrl      = Alloy.Globals.Secrets.backend.url;

exports.appToken = function(args) {

    if (!args.forceNew) {
        var appAccessToken = Ti.App.Properties.getString('app_access_token', null);

        if (appAccessToken !== null) {
            if (args.callback) {
                args.callback(appAccessToken);
            }
            return;
        }
    }

    require('http').request({
        timeout: 10000,
        type: 'POST',
        format: 'JSON',
        url: baseUrl + '/oauth/token',
        data: {
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        },
        success: function(response) {
            Ti.App.Properties.setString('app_access_token', response.access_token);

            if (args.callback) {
                args.callback(response.access_token);
            }
            return;
        }
    });
};

exports.validateToken = function(args){
    var userAccessToken =  Ti.App.Properties.getString('user_access_token', null);
    if (require('session').isLogged() && userAccessToken !== null) {
        require('http').request({
            timeout: 10000,
            type: 'POST',
            format: 'JSON',
            oauth_type: 'appToken',
            url: baseUrl + '/api/v1/sessions/validate_token',
            data: {
                token: userAccessToken
            },
            success: function(response) {
                if (response.success === true) {
                    args.success();
                } else {
                    require('session').logout({
                        success: function(){
                            args.error(true);
                        },
                        error: function(){}
                    });
                }
            },failure: function(){
                args.error();
            }
        });
    } else {
        args.error();
    }
};

exports.userToken = function(args) {
    var userAccessToken =  Ti.App.Properties.getString('user_access_token', null);

    if ( userAccessToken !== null ) {
        if (args.callback) {
            args.callback(userAccessToken);
        }
        return;
    }
};
