/* ==========================================================
 * wdesk-transition.js v1.2.0 (http://bit.ly/1bh9VJL)
 * adapted from bootstrap-transition v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery);
    };
    define.isFake = true;
}

define(['jquery'], 

function($) {

    'use strict';

    if (!jQuery) {
        throw new Error('wdesk-transition.js requires jQuery');
    }

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    var transitionEnd = function () {

        var el = document.createElement('wdesk');
        
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd'
          , 'MozTransition'    : 'transitionend'
          , 'OTransition'      : 'oTransitionEnd otransitionend'
          , 'transition'       : 'transitionend'
        };

        for (var name in transEndEventNames){
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
            }
        }

    };

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false, 
            $el    = this;
        $(this).one($.support.transition.end, function () { called = true });
        var callback = function () { 
            if (!called) {
                $($el).trigger($.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $(function () {
        $.support.transition = transitionEnd();
    });

});

if (define.isFake) {
    define = undefined;
}
