/* ==========================================================
 * wdesk-button.js v1.1.0 (http://bit.ly/13EbhbR)
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

define(['jquery'], function($) {

    "use strict";


    /* BUTTON PUBLIC CLASS DEFINITION
     * ============================== */

    var Button = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.button.defaults, options);
    };

    Button.prototype.setState = function (state) {
        var d = 'disabled'
            , $el = this.$element
            , $btnText = $el.find('.btn-text')
            , data = $el.data()
            , val = $el.is('input') ? 'val' : 'html';

        state = state + 'Text';
        data.resetText || $el.data('resetText', $el[val]());

        if($el.is('input')) {
            $el[val](data[state] || this.options[state]);
        } else {
            $btnText[val](data[state] || this.options[state]);
        }

        // push to event loop to allow forms to submit
        setTimeout(function () {
            state == 'loadingText' ?
                $el.addClass(d).attr(d, d) :
                $el.removeClass(d).removeAttr(d);
        }, 0);
    };

    Button.prototype.toggle = function () {
        var $parent = this.$element.closest('[data-toggle="buttons-radio"]');

        $parent && $parent
            .find('.active')
            .removeClass('active');

        this.$element.toggleClass('active');
    };

    Button.prototype.clearSearch = function () {
        var $that = this
          , $searchBox = this.$element.parent('.search-box')
          , $searchInput = $searchBox.find('.search-text')
          , searchQuery
          , searchActive = false;
        
        var activateSearch = function() {
            searchActive = true;
            $searchBox.addClass('searching');
            $searchInput.addClass('focus')
                        .trigger('search');
        };

        var deActivateSearch = function() {
            searchActive = false;
            $searchBox.removeClass('searching');
            $searchInput.focus()
                        .removeClass('focus')
                        .trigger('clear');
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
            $searchInput.val('')
                        .trigger('change');
            checkQuery(e);
        });

        $searchInput.on('keyup', function(e) {
            checkQuery(e);
        });

    };


    /* BUTTON PLUGIN DEFINITION
     * ======================== */

    var old = $.fn.button;

    $.fn.button = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('button')
                , options = typeof option == 'object' && option;
            if (!data) { 
                $this.data('button', (data = new Button(this, options)));
            }
            if (option == 'toggle') {
                data.toggle();
            }
            else if (option == 'clearSearch') {
                data.clearSearch()
            }
            else if (option) { 
                data.setState(option);
            }
        });
    };

    $.fn.button.defaults = {
        loadingText: 'loading...'
    };

    $.fn.button.Constructor = Button;


    /* BUTTON NO CONFLICT
     * ================== */

    $.fn.button.noConflict = function () {
        $.fn.button = old;
        return this;
    };


    /* BUTTON DATA-API
     * =============== */

    $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target);
        if (!$btn.hasClass('btn')) { 
            $btn = $btn.closest('.btn');
        }
        $btn.button('toggle');
    });

});

if (define.isFake) {
    define = undefined;
}
