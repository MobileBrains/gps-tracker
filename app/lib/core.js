/**
 * The main app singleton used throughout the app. This object contains static
 * properties, global event handling, etc.
 *
 * @class core
*/

var APP = {
    /**
     * Device information
     * @type {Object}
     * @param {Boolean} isHandheld Whether the device is a handheld
     * @param {Boolean} isTablet Whether the device is a tablet
     * @param {String} type The type of device, either 'handheld' or 'tablet'
     * @param {String} os The name of the OS, either 'IOS' or 'ANDROID'
     * @param {String} name The name of the device, either 'IPHONE', 'IPAD' or the device model if Android
     * @param {String} version The version of the OS
     * @param {Number} versionMajor The major version of the OS
     * @param {Number} versionMinor The minor version of the OS
     * @param {Number} dpi The DPI of the device screen
     * @param {Number} width The width of the device screen
     * @param {Number} height The height of the device screen
     * @param {String} orientation The device orientation, either 'LANDSCAPE' or 'PORTRAIT'
     */
    Device: {
        isHandheld: Alloy.isHandheld,
        isTablet: Alloy.isTablet,
        type: Alloy.isHandheld ? 'handheld' : 'tablet',
        os: null,
        name: null,
        version: Ti.Platform.version,
        versionMajor: parseInt(Ti.Platform.version.split('.')[0], 10),
        versionMinor: parseInt(Ti.Platform.version.split('.')[1], 10),
        dpi: Ti.Platform.displayCaps.dpi,
        width: pxToDP(Ti.Platform.displayCaps.platformWidth),
        height: pxToDP(Ti.Platform.displayCaps.platformHeight),
        orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? 'LANDSCAPE' : 'PORTRAIT'
    },

    /**
     * Network status and information
     * @type {Object}
     * @param {String} type Network type name
     * @param {Boolean} online Whether the device is connected to a network
     */
    Network: {
        type: Ti.Network.networkTypeName,
        online: Ti.Network.online
    },

    /**
     * Global iOS Navigation Group Handler
     * @type {Object}
     */
    navWindow: null,

    /**
     * Initializes the application
     * @type {function}
     * @param {Object} navigationWindow NavigationWindow id
     */
    init: function() {
        Ti.API.debug('APP.init');

        if (OS_IOS) {
            APP.navWindow = Ti.UI.iOS.createNavigationWindow();
        }

        // Determine device characteristics
        APP.determineDevice();

        // Global system Events
        Ti.Network.addEventListener('change', APP.networkObserver);

        if (!APP.Network.online) {
            Alloy.createController('network_lost');
            return;
        }
    },

    /**
    * Determines the device characteristics
    * @type {function}
    */
    determineDevice: function() {
        if (OS_IOS) {
            APP.Device.os = 'IOS';

            if(Ti.Platform.osname.toUpperCase() == 'IPHONE') {
                APP.Device.name = 'IPHONE';
            } else if (Ti.Platform.osname.toUpperCase() == 'IPAD') {
                APP.Device.name = 'IPAD';
            }
        } else if (OS_ANDROID) {
            APP.Device.os = 'ANDROID';
            APP.Device.name = Ti.Platform.model.toUpperCase();
        }
    },

    /**
    * Global network event handler
    * @type {function}
    * @param {Object} event Standard Titanium event callback
    */
    networkObserver: function(event) {
        Ti.API.debug('APP.networkObserver -> ' + JSON.stringify(event));

        APP.Network.type = event.networkTypeName;
        APP.Network.online = event.online;

        if (!Ti.Network.online && Ti.Network.networkTypeName == 'NONE') {
            Alloy.Globals.LO.hide();
            Alloy.createController('network_lost');
        }
    },

    /**
     * Android Back button or window event
     * @type {function}
     * @param {Object} window Window id
     * @package {funtion} callback Callback function
     */
    androidBack: function(window, callback) {
      if (OS_ANDROID && callback) {
          window.addEventListener('android:back', function(e) {
              return callback();
          });
      }
    },

    /**
     * Global Navigation Handler
     * @type {function}
     * @param {Object} navigationWindow NavigationWindow id
     * @param {Object} args JSON Object with params to controller and navigationWindow bool option
     */
    navigatorOpen: function(controller, args) {
        var params = args && args.params ? args.params : {};
        var navigationWindow = args && args.navigationWindow == false ? false : true;

        Ti.API.debug(String.format('APP.navigator.open -> controller: %s with navigationWindow %s and params: %s', controller, navigationWindow.toString(), JSON.stringify(params)));

        var win = Alloy.createController(controller, params).getView();

        if (OS_IOS && navigationWindow) {
            APP.navWindow.open();
            APP.navWindow.openWindow(win);
        } else {
            win.open();
        }
    }
};

module.exports = APP;
