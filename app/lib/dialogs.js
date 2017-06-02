var dialog = null;

var addCallback = function(_callback) {
    dialog.addEventListener('click', function onClick(e){
        dialog.removeEventListener('click', onClick);

        if ( _callback ) {
            _callback(e);
        }
    });
};

var openDialog = function(args){
    if (!_.isNull(dialog)) {
        dialog.hide();
        dialog = null;
    }

    dialog = Ti.UI.createAlertDialog({
        title: args.title,
        message: args.message,
        ok: L('accept')
    });

    if ( !_.isUndefined(args.callback)) {
        addCallback(args.callback);
    }

    dialog.show();
};

exports.openDialog = function(args){
    openDialog(args);
};

var openOptionsDialog = function(args){
    if (!_.isNull(dialog)) {
        dialog.hide();
        dialog = null;
    }

    if (!_.isUndefined(args.options.buttonNames)) {
        if (_.isUndefined(args.options.cancel)) {
            _.extend(args.options, { cancel: OS_IOS ? 0 : 1 });
        }
        args.options.buttonNames = OS_IOS ? _.union([L('cancel')], args.options.buttonNames) : _.union(args.options.buttonNames, [L('cancel')]);
    }

    dialog = Ti.UI.createAlertDialog(args.options);

    if ( !_.isUndefined(args.callback)) {
        addCallback(args.callback);
    }

    dialog.show();
};

exports.openOptionsDialog = function(args){
    openOptionsDialog(args);
};
