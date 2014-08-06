/* ==========================================================
 * wdesk-tab.js v1.2.0 (http://bit.ly/13E6Cqd)
 * adapted from bootstrap-tab v3.0.0
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

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        this.element = $(element);
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-tab.js requires wdesk-transition.js');
    }

    Tab.prototype = {

        show: function () {
            var $this    = this.element;
            var $ul      = $this.closest('ul:not(.dropdown-menu)');
            var selector = $this.attr('data-target');

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            if ( $this.parent('li').hasClass('active') ) { 
                return;
            }

            var previous = $ul.find('.active:last .hitarea')[0];

            var e = $.Event('show.wdesk.tab', {
                relatedTarget: previous
            });

            $this.trigger(e);

            if (e.isDefaultPrevented()) { 
                return;
            }

            var $target = $(selector);

            this.activate($this.parent('li'), $ul);
            this.activate($target, $target.parent(), function () {
                $this.trigger({
                    type: 'shown.wdesk.tab'
                  , relatedTarget: previous
                });
            });
        }

      , activate: function (element, container, callback) {
            var $active     = container.find('> .active');
            var transition  = callback
                    && $.support.transition
                    && $active.hasClass('fade');

            var next = function() {
                $active
                    .removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active');

                element.addClass('active');

                if (transition) {
                    element[0].offsetWidth; // reflow for transition
                    element.addClass('in');
                } else {
                    element.removeClass('fade');
                }

                if ( element.parent('.dropdown-menu') ) {
                    element.closest('li.dropdown').addClass('active');
                }

                callback && callback();
            };

            transition ?
                $active
                    .one($.support.transition.end, next)
                    .emulateTransitionEnd(150) :
                next();

            $active.removeClass('in');
        }
    };


    // TAB PLUGIN DEFINITION
    // =====================

    var old = $.fn.tab;

    $.fn.tab = function ( option ) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('wdesk.tab');
            if (!data) { 
                $this.data('wdesk.tab', (data = new Tab(this)));
            }
            if (typeof option == 'string') { 
                data[option]();
            }
        });
    };

    $.fn.tab.Constructor = Tab;


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old;
        return this;
    };


    // TAB DATA-API
    // ============

    $(document).on('click.wdesk.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

});

if (define.isFake) {
    define = undefined;
}
