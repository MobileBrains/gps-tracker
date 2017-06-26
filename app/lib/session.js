var parseUserObject = function(user) {
    var current_user = Ti.App.Properties.getObject('current_user', {});
    current_user = _.extend(current_user, {
        id: user.id,
        email: user.email,
        name: user.name
    });

    Ti.App.Properties.setObject('current_user', current_user);

    return current_user;
};

exports.isLogged = function() {
    return Ti.App.Properties.getBool('logged', false);
};

exports.getCurrentUser = function() {
    return Ti.App.Properties.getObject('current_user', {});
};

exports.login = function(args) {
    require('http').request({
        timeout: 10000,
        type: 'POST',
        format: 'JSON',
        oauth_type: 'appToken',
        url: Alloy.Globals.Secrets.backend.url + '/api/v1/sessions/login',
        data: {
            user: args.user,
            pass: args.pass,
        },
        success: function(response) {
            Ti.API.debug("Sessions.login -> ", response);
            if (!response.success && args.error) {
                args.error(response.errors);
            } else {
                var user = parseUserObject(response.data.user);

                Ti.App.Properties.setBool('logged', true);;
                Ti.App.Properties.setString('user_access_token', response.data.user_access_token);

                args.success();
            }
        },
        failure: function(response) {
            if(args.error) {
                args.error();
            }
        }
    });
};

exports.logout = function(args) {
    var userAccessToken =  Ti.App.Properties.getString('user_access_token', null);
    if (exports.isLogged() && userAccessToken !== null) {
        require('http').request({
            timeout: 10000,
            type: 'POST',
            format: 'JSON',
            oauth_type: 'appToken',
            url: Alloy.Globals.Secrets.backend.url + '/api/v1/sessions/logout',
            data: {
                token: userAccessToken
            },
            success: function(response) {
                if (response.success === true) {
                    Ti.App.Properties.removeProperty('logged');
                    Ti.App.Properties.removeProperty('current_user');
                    Ti.App.Properties.removeProperty('user_access_token');

                    args.success();
                } else {
                    args.error();
                }
            },
            failure: function() {
                args.error();
            }
        });
    }
};
