var moment = require('alloy/moment');
var location_flag = Ti.App.Properties.getBool("location_flag", true);

console.error("Service GPS Job ", moment().format('HH:mm:ss - MMM D, YYYY'));

require('gps_tracker').startTracking(function(response){
  console.error("Service GPS Job:  ", response);
});

require('gps_tracker').getCurrentPosition(function(e){
    console.error("GPS DATA: ", e);
    if (!e.error) {
        var current_location = Ti.App.Properties.getObject("current_location", null);
        var mt_distance = require('gps_tracker').getDistanceFromLatLonInMt(current_location.latitude, current_location.longitude, e.coords.latitude, e.coords.longitude);
        console.error("updateLocation mt_distance: ", mt_distance, "  - ", location_flag);
        if (mt_distance > 30 || location_flag) { // Only send at the first time or if the distance is bigger than 30mts
            Ti.App.Properties.setBool("location_flag", false);
            Ti.App.Properties.setObject("current_location", {
                longitude: e.coords.longitude,
                latitude: e.coords.latitude,
                latitudeDelta : 0.15,
                longitudeDelta : 0.15,
                title: 'Location title',
                subtitle: 'Subtitle'
            });

            console.error("GPS Job::current_location ", current_location);

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
                },
                failure: function(response) {
                    console.error("updateLocation response error: ", response);
                }
            });
        } else {
            console.error("updateLocation Location Ignored");
        }
    }
});