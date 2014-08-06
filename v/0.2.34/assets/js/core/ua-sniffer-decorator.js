/**
* ua-sniffer-decorator.js for Web Skin v0.2.34
* 
* This script decorates the <html> DOM element with
* CSS classes that contain information parsed from the user-agent string
*/
if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.$);
    };
    define.isFake = true;
}

define(['jquery', 'ua-sniffer'], function($) {

    // decorate the <html> tag
    // with browser / OS detection classes
    // provided by ua-sniffer.js
    var _brPrefix = 'ua-';
    var _osPrefix = 'os-';
    var _rangePrefix = 'lt-';
    var $uaBrowser = $.client.browser.toLowerCase();
    var $uaBrowserVersion = $.client.version.toLowerCase();
    var $uaBrowserVersionRange = $.client.versionRange.toLowerCase();
    var $uaOS = $.client.os.toLowerCase();
    var $uaDevice = $.client.device.toLowerCase();

    var $ua = $.client.userAgent;
    var $vendor = $.client.vendor;
    var $platform = $.client.platform;

    // Uncomment this for debuggin
    // var debugMsg = "You are using " + $uaBrowser + $uaBrowserVersion + " with " + $uaOS + " running on a " + $uaDevice;
    // var debugXtra = "UA: " + $ua + "\n" + "vendor: " + $vendor + "\n" + "platform: " + $platform;
    // console.log(debugMsg);
    // console.log(debugXtra);
    $('html')
        .addClass(_brPrefix + $uaBrowser)
        .addClass(_brPrefix + $uaBrowser + $uaBrowserVersion)
        .addClass(_brPrefix + _rangePrefix + $uaBrowser + $uaBrowserVersionRange)
        .addClass(_osPrefix + $uaOS)
        .addClass($uaDevice);

});

if (define.isFake) {
    define = undefined;
}