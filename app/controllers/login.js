function clickHandler(){
    var email = $.email.getValue();
    var pass  = $.pass.getValue();

    if ( email === null || email === "" ) {
        require('dialogs').openDialog({
            message: L('empty_email'),
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
        email: email,
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