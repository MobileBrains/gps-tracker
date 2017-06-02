// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
//

/**
* @method dpToPX
* Converts a density-independent pixel value to screen pixels.
* @param {Number} val Value in density-independent pixels.
* @return {Number} Converted value in screen pixels.
*/
var dpToPX = function (val) {
    var dpi = Ti.Platform.displayCaps.dpi,
        density = Ti.Platform.displayCaps.density;

    if (OS_ANDROID) {
        return val * dpi / 160;
    } else if (OS_IOS) {
        return val * (density === 'high' ? 2 : 1);
    } else {
        return val;
    }
};

/**
* @method pxToDP
* Converts a screen pixel value to density-independent pixels.
* @param {Number} val Value in screen pixels.
* @return {Number} Converted value in density-independent pixels.
*/
var pxToDP = function (val) {
    var dpi = Ti.Platform.displayCaps.dpi,
        density = Ti.Platform.displayCaps.density;

    if (OS_ANDROID) {
        return val / dpi * 160;
    } else if (OS_IOS) {
        return val / (density === 'high' ? 2 : 1);
    } else {
        return val;
    }
};

Alloy.Globals.APP         = require('core');
Alloy.Globals.Secrets     = require('secrets').keys;
Alloy.Globals.icons       = require('icons');
Alloy.Globals.colors      = require('colors');

Alloy.Globals.LO = Alloy.createWidget('com.caffeinalab.titanium.loader', {
    useImages: false
});
