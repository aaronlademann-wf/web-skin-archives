/* ==========================================================
 * wdesk-dropdown.js v1.2.0 (http://bit.ly/19iagKq)
 * adapted from bootstrap-dropdown v3.0.0
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

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop';
    var toggle   = '[data-toggle="dropdown"]';

    var Dropdown = function (element, options) {
        this.options  = null;
        this.$element = null;
        this.$parent  = null;

        this.init(element, options);
        // var $el = $(element).on('click.wdesk.dropdown', this.toggle);
    };

    if (!jQuery) {
        throw new Error('wdesk-dropdown.js requires jQuery');
    }

    Dropdown.DEFAULTS = {
        persistent: false
    };

    Dropdown.prototype = {

        constructor: Dropdown

      , init: function(element, options) {
            this.$element = $(element);
            this.$parent = getParent(this.$element);
            this.options = this.getOptions(options);

            var that = this;

            $('html').on('click.wdesk.dropdown.data-api', function () {
                if (!that.options.persistent) {
                    that.$parent.trigger($.Event('hide.wdesk.dropdown'));
                    that.$parent.removeClass('open');
                    that.$parent.trigger($.Event('hidden.wdesk.dropdown'));
                }
            });

            this.$parent.find(toggle)
                .on('click.wdesk.dropdown.data-api', $.proxy(this.toggle, this));
            this.$parent.find(toggle + ', [role=menu]')
                .on('keydown.wdesk.dropdown.data-api', $.proxy(this.keydown, this));
        }

      , getDefaults: function() {
            return Dropdown.DEFAULTS;
        }

      , getOptions: function(options) {
            return $.extend({}, this.getDefaults(), this.$element.data(), options);
        }

      , toggle: function (e) {
            var isActive
              , isPersistent;

            if (this.$element.is('.disabled, :disabled')) {
                return;
            }

            isActive = this.$parent.hasClass('open');
            isPersistent = this.options.persistent;

            clearMenus();

            if('ontouchstart' in document.documentElement) {
                // if mobile we we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertBefore(this.$element).on('click', clearMenus);
            }

            // If this dropdown wasn't active, then we need to toggle it
            // Alternatively, if this is a persistent dropdown, then we always
            // need to toggle because it won't be closed by clearMenus()
            if (!isActive || isPersistent) {
                this.$parent.trigger(e = $.Event('show.wdesk.dropdown'));

                this.$parent
                    .toggleClass('open')
                    .trigger(e = $.Event('shown.wdesk.dropdown'));
            }

            this.$element.focus();

            return false;
        }

      , keydown: function (e) {
            var $items
              , isActive
              , index;

            if (!/(38|40|27)/.test(e.keyCode)) { 
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (this.$element.is('.disabled, :disabled')) {
                return;
            }

            isActive = this.$parent.hasClass('open');

            if (!isActive || (isActive && e.keyCode == 27)) {
                if (e.which == 27) {
                    this.$parent.find(toggle).focus();
                } 
                return this.$element.click();
            }

            $items = $('[role=menu] li:not(.divider):visible .hitarea', this.$parent);

            if (!$items.length) { 
                return;
            }

            index = $items.index($items.filter(':focus'));

            if (e.keyCode == 38 && index > 0) {                 index--;   } // up
            if (e.keyCode == 40 && index < $items.length - 1) { index++;   } // down
            if (!~index) {                                      index = 0; }

            $items
                .eq(index)
                .focus();
        }
    };

    var clearMenus = function () {
        $(toggle).each(function (e) {
            var $this = $(this)
              , $parent = getParent($this);
            if ($this.data('wdesk.dropdown') && !$this.data('wdesk.dropdown').options.persistent) {
                $(backdrop).remove();
                $parent.trigger(e = $.Event('hide.wdesk.dropdown'));
                if (e.isDefaultPrevented()) {
                    return;
                }
                $parent
                    .removeClass('open')
                    .trigger(e = $.Event('hidden.wdesk.dropdown'));
            }
        });
    };

    var getParent = function ($this) {
        var selector = $this.attr('data-target')
          , $parent;

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent();
    };


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown;

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
               , data = $this.data('wdesk.dropdown')
               , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('wdesk.dropdown', (data = new Dropdown(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            } 
        });
    };

    $.fn.dropdown.Constructor = Dropdown;


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
    
        .on('click.wdesk.dropdown.data-api', clearMenus)
        .on('click.wdesk.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation(); })
        .on('click.dropdown-menu', function (e) { e.stopPropagation(); });

    $(toggle, document).dropdown();

});

if (define.isFake) {
    define = undefined;
}
