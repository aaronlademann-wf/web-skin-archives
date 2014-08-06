/* ==========================================================
 * wdesk-alert.js v1.1.0 (http://bit.ly/16ZHY1d)
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

define(['jquery', 'wdesk-transition'], function($) {

    "use strict";


    /* ALERT CLASS DEFINITION
     * ====================== */

        var dismiss = '[data-dismiss="alert"]',
            Alert = function (element, options) {
                this.options = options;
                this.$element = $(element).delegate('[data-dismiss="alert"]', 'click.dismiss.alert', $.proxy(this.hide, this));
                this.$element.find('[data-dismiss="alert"]').on('click', dismiss, this.hide);
            };

    Alert.prototype = {

        constructor: Alert

      , show: function (e) {

            e && e.preventDefault();

            var that = this
              , $element= this.$element;

            $element.trigger(e = $.Event('show')); // allows subscription to $elem.on('show')

            $element.addClass('in')
                    .attr('aria-hidden', false);

            function showAlert() {
                $element.trigger(e = $.Event('shown')); // allows subscription to $elem.on('shown')
            }

            $.support.transition && ($element.hasClass('fade') || $element.hasClass('slide') || $element.hasClass('alert-toast')) ?
                $element.one($.support.transition.end, showAlert) :
                showAlert();
        }        

      , hide: function (e) {
            
            e && e.preventDefault();

            var that = this
              , $this = $(this)
              , selector = $this.attr('data-target')
              , $parent;

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            $parent = $(selector);
            $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent());
            $parent.trigger(e = $.Event('hide')); // allows subscription to $elem.on('hide')

            $parent.removeClass('in')
                   .attr('aria-hidden', true);

            var hideAlert = function() {
                $parent.trigger(e = $.Event('hidden')); // allows subscription to $elem.on('hidden')
            };

            $.support.transition && ($parent.hasClass('fade') || $parent.hasClass('slide') || $parent.hasClass('alert-toast')) ?
                $parent.one($.support.transition.end, hideAlert) :
                hideAlert();
        }
    };


    /* ALERT PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.alert;

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('alert')
                , options = $.extend({}, $.fn.alert.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) { 
                $this.data('alert', (data = new Alert(this, options)));
            }
            if (typeof option == 'string') { 
                data[option]();
            }
            else if (options.show) {
                data.show(this);
            }
        });
    };

    $.fn.alert.defaults = {
        show: false // show as soon as .alert() is called?
    };

    $.fn.alert.Constructor = Alert;


    /* ALERT NO CONFLICT
     * ================= */

    $.fn.alert.noConflict = function () {
        $.fn.alert = old;
        return this;
    };


 /* ALERT DATA-API
    * ============== */

    $(document).on('click.alert.data-api', dismiss, Alert.prototype.hide);

});

if (define.isFake) {
    define = undefined;
}
