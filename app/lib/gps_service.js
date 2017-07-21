var service, intent;

exports.init = function(){
    var intent = Ti.Android.createServiceIntent({
        url: 'gps_job.js'
    });
    intent.putExtra('interval', 20000); // Sent Job every 20 seconds

    if (Ti.Android.isServiceRunning(intent)) {
        console.error('Service IS running');
    } else {
        console.error('Service is NOT running');

        service = Ti.Android.createService(intent);

        service.addEventListener('start', function(e) {
            console.error('Starting... Instance #' + e.source.serviceInstanceId + ' (bound)');
        });

        service.addEventListener('taskremoved', function(e){
            console.error('Taskremoved fired');
        });

        service.addEventListener('pause',function(e) {
            console.error('Bound instance #' + e.source.serviceInstanceId + ' paused (iteration #' + e.iteration + ')');
        });

        service.addEventListener('resume',function(e) {
            console.error('Bound instance #' + e.source.serviceInstanceId + ' resumed (iteration #' + e.iteration + ')');
        });

        service.start();
    }
};

exports.stop= function(){
    if (Ti.Android.isServiceRunning(intent)) {
        console.error('Stoping gps service');
        service.stop();
    } else {
        console.error('Service is NOT running');
    }
};