/* ==========================================================
 * wdesk-dropdown.js v1.1.0 (http://bit.ly/19iagKq)
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

define(['jquery'], function($) {

    "use strict";


    /* DROPDOWN CLASS DEFINITION
     * ========================= */

    var toggle = '[data-toggle=dropdown]';

    var Dropdown = function (element, options) {
        this.options  =
        this.$element = null;
        this.$parent = null;

        this.init(element, options);
    };

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

            $('html').on('click.dropdown.data-api', function () {
                if (!that.options.persistent) {
                    that.$parent.removeClass('open');
                    that.$parent.trigger($.Event('hide')); // allows subscription to $elem.on('hide')
                }
            });

            this.$parent.find(toggle)
                .on('click.dropdown.data-api', $.proxy(this.toggle, this));
            this.$parent.find(toggle + ', [role=menu]')
                .on('keydown.dropdown.data-api', $.proxy(this.keydown, this));
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

            if (!isActive || isPersistent) {
                this.$parent.toggleClass('open');

                if (isActive) {
                    // Was already active, so we just closed it
                    this.$parent.trigger(e = $.Event('hide')); // allows subscription to $elem.on('hide')
                }
                else {
                    // Was not active, so we just opened it
                    this.$parent.trigger(e = $.Event('show')); // allows subscription to $elem.on('show')
                }
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

            $items = $('[role=menu] li:not(.divider):visible a', this.$parent);

            if (!$items.length) { 
                return;
            }

            index = $items.index($items.filter(':focus'));

            if (e.keyCode == 38 && index > 0) index--;                                        // up
            if (e.keyCode == 40 && index < $items.length - 1) index++;                        // down
            if (!~index) index = 0;

            $items
                .eq(index)
                .focus();
        }

    };

    function clearMenus() {
        $(toggle).each(function () {
            var $this = $(this),
                $parent = getParent($this);
            if ($this.data('dropdown') && !$this.data('dropdown').options.persistent) {
                $parent.removeClass('open');
                $parent.trigger($.Event('hide')); // allows subscription to $elem.on('hide')
            }
        });
    }

    function getParent($this) {
        var selector = $this.attr('data-target')
                , $parent;

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        $parent = selector && $(selector);

        if (!$parent || !$parent.length) { 
            $parent = $this.parent();
        }

        return $parent;
    }


    /* DROPDOWN PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.dropdown;

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
               , data = $this.data('dropdown')
               , options = typeof option == 'object' && option;
            if (!data) {
                $this.data('dropdown', (data = new Dropdown(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            } 
        });
    };

    $.fn.dropdown.Constructor = Dropdown;


    /* DROPDOWN NO CONFLICT
     * ==================== */

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };


    /* APPLY TO STANDARD DROPDOWN ELEMENTS
     * =================================== */

    $(document)
        .on('click.dropdown.data-api', clearMenus)
        .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation(); })
        .on('click.dropdown-menu', function (e) { e.stopPropagation(); });

    $(toggle, document).dropdown();

});

if (define.isFake) {
    define = undefined;
}
