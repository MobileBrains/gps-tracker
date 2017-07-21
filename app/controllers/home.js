var win = $.HomeWindow;
var map = require('ti.map');
var mapView;
var centerMapFlag = 0;
var updateMapInterval;
var showMap = false;
var currentUser = Ti.App.Properties.getObject('current_user', {});

if ( OS_ANDROID ) {
    require('android_actionbar').build({
        window: win,
        displayHomeAsUp: false,
        title: currentUser.name + ': ' + currentUser.registration_plate,
        menuItemsBehavior: currentUser.name.length >= 20 ? Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW : null,
        menuItems: [
            {
                id: 101,
                title: L('toggle_map'),
                icon: Ti.Android.R.drawable.ic_menu_mapmode,
                callback: function(){
                    toggleMap();
                }
            },
            {
                id: 102,
                title: L('update_gps'),
                icon: Ti.Android.R.drawable.ic_menu_mylocation,
                callback: function(){
                    updateLocation();
                }
            },
            {
                id: 103,
                title: L('logout'),
                icon: Ti.Android.R.drawable.ic_menu_more,//ic_menu_delete,//ic_delete,//ic_menu_close_clear_cancel,
                callback: function(){
                    require('dialogs').openOptionsDialog({
                        options: {
                            buttonNames: [L('accept')],
                            message: L('logout_confirmation'),
                            title: L('app_name')
                        },
                        callback: function(evt){
                            if (evt.index !== evt.source.cancel) {
                                Alloy.Globals.LO.show(L('loader_default'), false);
                                require('session').logout({
                                    success: function(){
                                        Alloy.Globals.LO.hide();
                                        Alloy.Globals.APP.navigatorOpen('login', { navigationWindow: false });
                                    },
                                    error: function(){
                                        Alloy.Globals.LO.hide();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        ]
    });
}

var startMap = function() {
    var isGplay = map.isGooglePlayServicesAvailable();

    switch (isGplay){
        case map.SUCCESS:
            mapView = map.createView({
                animate: true,
                regionFit : true,
                userLocation: true,
                mapType: map.NORMAL_TYPE,//map.HYBRID_TYPE,
                height: Ti.UI.FILL,
                width: Ti.UI.FILL,
                top: 0,
                left: 0
            });

            win.add(mapView);

            updateMap();

            break;
        case map.SERVICE_MISSING:
            Ti.API.info("No hay servicios de google play");
            Ti.UI.createNotification({
                message: "No hay servicios de google play",
                duration: Ti.UI.NOTIFICATION_DURATION_SHORT
            }).show();
            break;
        case map.SERVICE_VERSION_UPDATE_REQUIRED:
            Ti.API.info("Se requiere actualizacion de servicios");
            Ti.UI.createNotification({
                message: "Se requiere actualizacion de servicios",
                duration: Ti.UI.NOTIFICATION_DURATION_SHORT
            }).show();
            break;
        case map.SERVICE_DISABLED:
            Ti.API.info("Servicios deshabilitados");
            break;
        case map.SERVICE_INVALID:
            Ti.API.info("Servicios invalidos, reinstalar");
            break;
        default:
            Ti.API.info("Error desconocido");
            break;
    };
};

var stopMap = function() {
    win.remove(mapView);
};

var updateMap = function() {
    var location = Ti.App.Properties.getObject("current_location", null);
    console.error("updateMap::current_location ", location);

    if (location) {
        var marker = map.createAnnotation({
            latitude: location.latitude,
            longitude: location.longitude,
            pincolor: map.ANNOTATION_AZURE,
            title: location.title,
            subtitle: location.subtitle
        });
        mapView.addAnnotation(marker);

        var region = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: location.latitudeDelta,
            longitudeDelta: location.longitudeDelta
        };

        if (centerMapFlag === 0) {
            mapView.setLocation(region);
            centerMapFlag = 1;
        }
    }
};

var updateLabel = function() {
    var location = Ti.App.Properties.getObject("current_location", null);

    if (location) {
        $.info.setText('longitude: ' + location.longitude + ' latitude: ' + location.latitude);
    }
};

updateMapInterval = setInterval(function(){
    if (showMap === true) {
        updateMap();
    } else {
        updateLabel();
    }
}, 3000);

var run = function() {
    Alloy.Globals.LO.show(L('loader_default'), true);
    require('gps_service').init();
}();

var updateLocation = function(args){
    Alloy.Globals.LO.show(L('loader_default'), false);
    require('gps_tracker').getCurrentPosition(function(e){
        console.error("GPS DATA: ", e);
        if (!e.error) {
            var location = Ti.App.Properties.getObject("current_location", null);

            if (location.longitude !== e.coords.longitude || location.latitude !== e.coords.latitude) {
                Ti.App.Properties.setObject("current_location", {
                    longitude: e.coords.longitude,
                    latitude: e.coords.latitude,
                    title: 'Location title',
                    subtitle: 'Subtitle',
                    latitudeDelta : 0.15,
                    longitudeDelta : 0.15
                });
                if (showMap === true) {
                    updateMap();
                }

                require('http').request({
                    timeout: 10000,
                    type: 'POST',
                    format: 'JSON',
                    oauth_type: 'userToken',
                    data: {
                        longitude: e.coords.longitude,
                        latitude: e.coords.latitude
                    },
                    url: Alloy.Globals.Secrets.backend.url + '/viveApi/v1/updateLocation',
                    success: function(response) {
                        console.error("updateLocation response success: ", response);
                        Alloy.Globals.LO.hide();
                    },
                    failure: function(response) {
                        console.error("updateLocation response error: ", response);
                        Alloy.Globals.LO.hide();
                        require('dialogs').openDialog({
                            message: 'Error al actualizar la ubicacion intenta de nuevo',//L('gps_update_error'),
                            title: L('error')
                        });
                    }
                });
            }
        } else {
            $.info.setText(L('loader_gps'));
            Alloy.Globals.LO.hide();
            require('dialogs').openDialog({
                message: e.error,
                title: L('error')
            });
        }
    });
};