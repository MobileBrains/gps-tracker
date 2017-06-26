function clickHandler(){
    var user = $.user.getValue();
    var pass  = $.pass.getValue();

    if ( user === null || user === "" ) {
        require('dialogs').openDialog({
            message: L('empty_user'),
            title: L('app_name')
        });
        return;
    } else if ( pass === null || pass === "" ) {
        require('dialogs').openDialog({
            message: L('empty_pass'),
            title: L('app_name')
        });
        return;
    }

    Alloy.Globals.LO.show(L('loader_default'), false);

    require('session').login({
        user: user,
        pass: pass,
        success: function() {
            Alloy.Globals.LO.hide();
            Alloy.Globals.APP.navigatorOpen('home');
        },
        error: function(_errors) {
            Alloy.Globals.LO.hide();
            require('dialogs').openDialog({
                message: _errors[0],
                title: L('app_name')
            });
            return;
        }
    });
}
$.send.addEventListener('click', clickHandler);