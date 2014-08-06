/* ==========================================================
 * wdesk-button.js v1.2.0 (http://bit.ly/13EbhbR)
 * adapted from bootstrap-button v3.0.0
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

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element = $(element);
        this.options  = $.extend({}, Button.DEFAULTS, this.$element.data(), options);
    };

    if (!jQuery) {
        throw new Error('wdesk-button.js requires jQuery');
    }

    Button.DEFAULTS = {
        activeClass: 'active',
        prop: 'disabled' // what .prop() should we toggle when setState triggers?
    };

    Button.prototype.setState = function (state) {
        var d        = this.options.prop;
        var $el      = this.$element;
        var val      = $el.is('input') ? 'val' : 'html';
        var data     = $el.data();
        var $btnText = $el.find('.btn-text');

        state = state + 'Text';

        if (!data.resetText) {
            if($el.is('input')) {
                $el.data('resetText', $el[val]());
            } else {
                $el.data('resetText', $btnText[val]());
            }
        }

        if($el.is('input')) {
            $el[val](data[state] || this.options[state]);
        } else {
            $btnText[val](data[state] || this.options[state]);
        }

        // push to event loop to allow forms to submit
        if(d) {
            setTimeout(function () {
                state == 'loadingText' ?
                    $el.addClass(d).prop(d, true) :
                    $el.removeClass(d).prop(d, false);
            }, 0);
        }
    };

    Button.prototype.toggle = function (options) {
        var activeClass = options.activeClass;
        var $el         = this.$element;
        var $parent     = $el.closest('[data-toggle="buttons"]');
        var data        = $el.data();

        if ($parent.length) {
            activeClass = $parent.data('activeClass') || activeClass;
            var $input = this.$element.find('input');

            $input
                .prop('checked', !this.$element.hasClass(activeClass))
                .trigger('change');

            if ($input.prop('type') === 'radio') { 
                $parent.find('.' + activeClass).removeClass(activeClass);
            }
        }

        this.$element.toggleClass(activeClass);
    };

    // toggle nothing but a property / attribute
    Button.prototype.toggleProp = function (options) {
        console.log(options);
        var $el         = this.$element;
        var data        = $el.data();
        var toggleProp  = data.toggleProp || options.prop;
        
        if($el.prop(toggleProp)) {
            $el.addClass(toggleProp);
        } else {
            $el.removeClass(toggleProp);
        }
    };

    Button.prototype.clearSearch = function (options) {
        var $that        = this;
        var $searchBox   = this.$element.parent('.search-box');
        var $searchInput = $searchBox.find('.search-text');
        var searchQuery;
        var searchActive = false;
        
        var activateSearch = function() {
            searchActive = true;
            $searchBox.addClass('searching');
            $searchInput
                .addClass('focus')
                .trigger('search.wdesk.button');
        };

        var deActivateSearch = function() {
            searchActive = false;
            $searchBox.removeClass('searching');
            $searchInput
                .focus()
                .removeClass('focus')
                .trigger('clear.wdesk.button');
        };

        var checkQuery = function(e) {
            searchQuery = $searchInput.val();
            if(searchQuery.length > 0) {
                if(!searchActive) {
                    activateSearch();
                }
            } else {
                deActivateSearch();
            }
        };

        this.$element.on('click', function(e) {
            $searchInput
                .val('')
                .trigger('change');

            checkQuery(e);
        });

        $searchInput.on('keyup', function(e) {
            checkQuery(e);
        });

    };


    // BUTTON PLUGIN DEFINITION
    // ========================

    var old = $.fn.button;

    $.fn.button = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('wdesk.button');
            var options = $.extend({}, Button.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) { 
                $this.data('wdesk.button', (data = new Button(this, options)));
            }
            if (option == 'toggle') {
                data.toggle(options);
            }
            if (option == 'toggleProp') {
                data.toggleProp(options);
            }
            else if (option == 'clearSearch') {
                data.clearSearch(options);
            }
            else if (option) { 
                data.setState(option);
            }
        });
    };

    $.fn.button.Constructor = Button;


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old;
        return this;
    };


    // BUTTON DATA-API
    // ===============

    $(document).on('click.wdesk.button.data-api', '[data-toggle^="button"], [data-toggle^="checkbox"], [data-toggle-prop]', function (e) {
        var $target = $(e.target);
        if(!$target.hasClass('btn') && !$target.is('input[type="checkbox"]')) { 
            $target = $target.closest('.btn');
        }
        if($target.data('toggleProp')) {
            $target.button('toggleProp');
        } else {
            var toggleType = $target.data('toggle');

            $target.button('toggle');
            if(toggleType === 'button') {
                e.preventDefault();
            }
        }
    });

});

if (define.isFake) {
    define = undefined;
}
