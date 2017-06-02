var abx = require('com.alcoapps.actionbarextras');

exports.build = function(options) {
    abx.window = options.window;

    var openCallback = (function(abx, options){
        return function(e){
            var activity = options.window.getActivity();
            activity.invalidateOptionsMenu();
            activity.actionBar.displayHomeAsUp = _.isUndefined(options.displayHomeAsUp) ? true : options.displayHomeAsUp;

            // set initial values
            abx.title           = options.title || L('app_name');
            abx.titleColor      = options.titleColor || Alloy.Globals.colors.white;
            abx.titleFont       = options.titleFont  || 'DroidSans';
            abx.disableIcon     = options.disableIcon || false;
            abx.backgroundColor = options.backgroundColor || Alloy.Globals.colors.black;

            if (options.homeAsUpIcon) {
                abx.homeAsUpIcon = options.homeAsUpIcon;
            }

            if (options.iconURL) {
                activity.actionBar.icon = options.iconURL;
            }

            if (!options.disableBack) {
                var back = function() {
                    if (options.backFunction) {
                        options.backFunction();
                    } else {
                        options.window.close();
                    }
                };

                activity.actionBar.onHomeIconItemSelected = function(){
                    back();
                };

                options.window.addEventListener('android:back', function(e) {
                    back();
                });
            } else {
                options.window.addEventListener('android:back', function(e) {});
            }

            activity.onCreateOptionsMenu = function(e){
                e.menu.clear();

                if (options.menuItems) {
                    var menuBehavior;

                    if (options.menuItems.length == 1) {
                        menuBehavior = Ti.Android.SHOW_AS_ACTION_ALWAYS;
                    } else if (options.menuItemsBehavior) {
                        menuBehavior = options.menuItemsBehavior;
                    } else {
                        menuBehavior = Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW | Ti.Android.SHOW_AS_ACTION_IF_ROOM;
                    }

                    _.each(options.menuItems, function(menuItem){
                        var _menuItem = e.menu.add({
                            itemId: menuItem.id, // don't forget to set an id here
                            title: menuItem.title,
                            icon: menuItem.icon,
                            //actionView: menuItem.view, // use this instead of title and icon params
                            showAsAction: menuBehavior
                        });

                        _menuItem.addEventListener('click', function(){
                            menuItem.callback();
                        });
                    });
                }
            };
        };
    })(abx, options);

    options.window.addEventListener('open', openCallback);
};
