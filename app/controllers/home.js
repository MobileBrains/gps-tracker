if ( OS_ANDROID ) {
    require('android_actionbar').build({
        window: $.HomeWindow,
        displayHomeAsUp: false,
        // menuItemsBehavior: Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW,
        menuItems: [
            {
                id: 101,
                title: 'Actualizar ubicacion', // L('update_gps')
                icon: Ti.Android.R.drawable.ic_menu_mylocation,
                callback: function(){
                    updateLocation();
                }
            }
        ]
    });
}

var run = function() {
    Alloy.Globals.LO.show(L('loader_default'), true);
    require('gps_service').init();
}();

var updateLocation = function(args){
    Alloy.Globals.LO.show(L('loader_default'), false);
    require('gps_tracker').getCurrentPosition(function(e){
        console.error("GPS DATA: ", e);
        if (!e.error) {
            $.info.setText('longitude: ' + e.coords.longitude + ' latitude: ' + e.coords.latitude);//L('gps_info'),

            require('http').request({
                timeout: 10000,
                type: 'POST',
                format: 'JSON',
                data: {
                    longitude: e.coords.longitude,
                    latitude: e.coords.latitude,
                    vehicle_id: 1
                },
                url: Alloy.Globals.Secrets.backend.url + '/viveApi/v1/updateLocation',
                success: function(response) {
                    console.error("updateLocation response success: ", response);
                    Alloy.Globals.LO.hide();
                    require('dialogs').openDialog({
                        message: 'Ubicacion actualizada con exito',//L('gps_update_success'),
                        title: L('success')
                    });
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