var moment = require('alloy/moment');

console.error("Service GPS Job ", moment().format('HH:mm:ss - MMM D, YYYY'));

require('gps_tracker').startTracking(function(response){
  console.error("Service GPS Job:  ", response);
});

require('gps_tracker').getCurrentPosition(function(e){
    console.error("GPS DATA: ", e);
    if (!e.error) {
        Ti.App.Properties.setObject("current_location", {
            longitude: e.coords.longitude,
            latitude: e.coords.latitude
        });

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
            },
            failure: function(response) {
                console.error("updateLocation response error: ", response);
            }
        });
    }
});