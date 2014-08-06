/* ==========================================================
 * wdesk-affix.js v1.2.0 (http://bit.ly/15J47Ss)
 * adapted from bootstrap-affix v3.0.0
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

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        this.$window = $(window)
            .on('scroll.wdesk.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.wdesk.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this));
        
        this.$element = $(element);
        this.affixed;
        this.unpin    = null;

        this.checkPosition();
    };

    if (!jQuery) {
        throw new Error('wdesk-affix.js requires jQuery');
    }

    Affix.RESET = 'affix affix-top affix-bottom';

    Affix.DEFAULTS = {
        offset: 0
    };

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) { 
            return;
        }

        var scrollHeight    = $(document).height();
        var scrollTop       = this.$window.scrollTop();
        var position        = this.$element.offset();
        var offset          = this.options.offset;
        var offsetBottom    = offset.bottom;
        var offsetTop       = offset.top;

        if (typeof offset != 'object')          offsetBottom = offsetTop = offset;
        if (typeof offsetTop == 'function')     offsetTop    = offset.top();
        if (typeof offsetBottom == 'function')  offsetBottom = offset.bottom();

        var affix = this.unpin      != null && (scrollTop + this.unpin <= position.top) ? false : 
                    offsetBottom    != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' : 
                    offsetTop       != null && scrollTop <= offsetTop ? 'top' : false;

        if (this.affixed === affix) { 
            return;
        }
        if (this.unpin) {
            this.$element.css('top', '');
        }

        this.affixed = affix;
        this.unpin   = affix == 'bottom' ? position.top - scrollTop : null;

        this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''));

        if (affix == 'bottom') {
            this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() });
        }
    };


    // AFFIX PLUGIN DEFINITION
    // =======================

    var old = $.fn.affix;

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('wdesk.affix');
            var options = typeof option == 'object' && option;

            if (!data) {
                $this.data('wdesk.affix', (data = new Affix(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.affix.Constructor = Affix;


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old;
        return this;
    };


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this);
            var data = $spy.data();

            data.offset = data.offset || {};

            if (data.offsetBottom) {
                data.offset.bottom = data.offsetBottom;
            }
            if (data.offsetTop) {
                data.offset.top = data.offsetTop;
            }

            $spy.affix(data);
        });
    });

});

if (define.isFake) {
    define = undefined;
}
