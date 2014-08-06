/* ==========================================================
 * wdesk-alert.js v1.2.0 (http://bit.ly/16ZHY1d)
 * adapted from bootstrap-alert v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery);
    };
    define.isFake = true;
}

define(['jquery', 'wdesk-transition'], 

function($) {

    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]';
    var Alert = function (element, options) {
        this.options = options;
        this.$element = $(element).on('click', dismiss, this.hide);
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-alert.js requires wdesk-transition.js');
    }

    Alert.prototype = {

        constructor: Alert

      , show: function (e) {

            var that = this
              , $this = $(this)
              , selector = $this.attr('data-target')
              , $parent;
            
            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            $parent = $(selector);

            if(e) {
                e.preventDefault();
            }

            if (! $parent.length) {
                $parent = $this.hasClass('alert') ? $this : $this.closest('.alert');
            }

            $parent.trigger('show.wdesk.alert'); // allows subscription to $elem.on('show')

            $parent.addClass('in')
                    .attr('aria-hidden', false);

            function showAlert() {
                $parent.trigger('shown.wdesk.alert'); // allows subscription to $elem.on('shown')
            }

            var transition  = $.support.transition && ($parent.hasClass('fade') || $parent.hasClass('slide') || $parent.hasClass('alert-toast'));
            transition ? 
                $parent.one($.support.transition.end, showAlert).emulateTransitionEnd(150) :
                showAlert();
        }

      , hide: function (e) {
            var $this = $(this);
            var selector = $this.attr('data-target');

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            var $parent = $(selector);

            if(e) {
                e.preventDefault();
            }

            if (! $parent.length) {
                $parent = $this.hasClass('alert') ? $this : $this.closest('.alert');
            }

            $parent.trigger(e = $.Event('hide.wdesk.alert'));

            if (e.isDefaultPrevented()) { 
                return;
            }

            $parent.removeClass('in')
                   .attr('aria-hidden', true);

            var removeAlert = function() {
                $parent.trigger('hidden.wdesk.alert').remove(); // allows subscription to $elem.on('hidden')
            };

            var transition  = $.support.transition && ($parent.hasClass('fade') || $parent.hasClass('slide') || $parent.hasClass('alert-toast'));
            transition ?
                $parent.one($.support.transition.end, removeAlert).emulateTransitionEnd(150) :
                removeAlert();
        }
    };


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert;

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('wdesk.alert')
                , options = $.extend({}, $.fn.alert.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) { 
                $this.data('wdesk.alert', (data = new Alert(this, options)));
            }
            if (typeof option == 'string') { 
                data[option].call($this);
            }
        });
    };

    $.fn.alert.defaults = {
        show: false // show as soon as .alert() is called?
    };

    $.fn.alert.Constructor = Alert;


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old;
        return this;
    };


    // ALERT DATA-API
    // ==============

    $(document).on('click.wdesk.alert.data-api', dismiss, Alert.prototype.hide);

});

if (define.isFake) {
    define = undefined;
}
