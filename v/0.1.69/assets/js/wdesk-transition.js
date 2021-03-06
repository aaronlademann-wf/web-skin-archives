/* ==========================================================
 * wdesk-transition.js v1.2.0 (http://bit.ly/1bh9VJL)
 * adapted from bootstrap-transition v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery, window.Modernizr);
    };
    define.isFake = true;
}

define(['jquery', 'modernizr'], function($, Modernizr) {

    "use strict";


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

    // GET TRANSITION DURATION SUPPORT (Shoutout: greglittlefield-wf)
    // ==============================================================

    $.fn.getTransitionDuration = ! Modernizr.csstransitions ? (function() {return 0;}) :
        (function(property) {
            var $element = this;
            var millis = 0;

            var properties = $element.css(Modernizr.prefixed('transitionProperty'));
            if (properties) {
                properties = properties.split(', ');
            } else {
                properties = ['all'];
            }

            var index = property ? properties.indexOf(property) : 0;

            if (index !== -1) {
                var durations = $element.css(Modernizr.prefixed('transitionDuration'));
                if (durations) {
                    durations = durations.split(', ');
                } else {
                    durations = [0];
                }

                // Modulo here, because transition durations wrap around
                var duration = durations[index % durations.length];
                var number = parseFloat(duration);

                if (/ms$/.test(duration)) {
                    millis = number;
                } else if (/s$/.test(duration)) {
                    millis = number * 1000;
                } else {
                    millis = number;
                }
            }

            return millis;
        });

    return $.fn.getTransitionDuration;


});

if (define.isFake) {
    define = undefined;
}
