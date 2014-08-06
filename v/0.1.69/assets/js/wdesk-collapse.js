/* ==========================================================
 * wdesk-collapse.js v1.2.0 (http://bit.ly/15J56BZ)
 * adapted from bootstrap-collapse v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery);
    };
    define.isFake = true;
}

define(['jquery', 'wdesk-transition'], function($) { "use strict";

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element = $(element);
        this.options  = $.extend({}, Collapse.DEFAULTS, options);
        this.transitioning = null;

        if (this.options.parent) {
            this.$parent = $(this.options.parent);
        }
        if (this.options.toggle) {
            this.toggle();
        }
    };

    Collapse.DEFAULTS = {
        toggle: true
    };

    Collapse.prototype = {

        dimension: function () {
            var hasWidth = this.$element.hasClass('width');
            return hasWidth ? 'width' : 'height';
        }

      , getSpeed: function () {
            var speed;
            if(this.options.speed) {
                var n = this.options.speed;
                if(! (isNaN(parseFloat(n)) && isFinite(n))) {
                    speed = this.options.speed;
                } else {
                    // since they screwed up their option... lets try to help them anyway
                    speed = this.$element.getTransitionDuration() || 350;
                    try {
                        console.warn('collapse.options.speed must be a number.');
                    } catch(err) {

                    }
                }
            } else {
                // they did not request a custom speed
                speed = this.$element.getTransitionDuration() || 350;
            }
            
            return speed;
        }

      , show: function () {
            if (this.transitioning || this.$element.hasClass('in')) { 
                return;
            }

            var startEvent = $.Event('show.wdesk.collapse');
            this.$element.trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return;
            }

            var actives = this.$parent && this.$parent.find('> .accordion-group > .in');

            if (actives && actives.length) {
                var hasData = actives.data('wdesk.collapse')
                if (hasData && hasData.transitioning) {
                    return;
                }
                actives.collapse('hide');
                hasData || actives.data('wdesk.collapse', null);
            }

            var dimension = this.dimension();

            this.$element
                .removeClass('collapse')
                .addClass('collapsing')
                [dimension](0);

            this.transitioning = 1;

            var complete = function () {
                this.$element
                    .removeClass('collapsing')
                    .addClass('in')
                    [dimension]('auto');
                this.transitioning = 0;
                this.$element.trigger('shown.wdesk.collapse')
            };

            if (!$.support.transition) {
                return complete.call(this);
            }

            var scrollSize = $.camelCase(['scroll', dimension].join('-'));

            var transitionDuration = this.getSpeed();
            this.$element
                .one($.support.transition.end, $.proxy(complete, this))
                .emulateTransitionEnd(transitionDuration)
                [dimension](this.$element[0][scrollSize]);

        }

      , hide: function () {
            if (this.transitioning || !this.$element.hasClass('in')) { 
                return;
            }

            var startEvent = $.Event('hide.wdesk.collapse');
            this.$element.trigger(startEvent);
            if (startEvent.isDefaultPrevented()) {
                return;
            }

            var dimension = this.dimension();
            
            this.$element
                [dimension](this.$element[dimension]())
                [0].offsetHeight;

            this.$element
                .addClass('collapsing')
                .removeClass('collapse')
                .removeClass('in');

            this.transitioning = 1;

            var complete = function () {
                this.transitioning = 0;
                this.$element
                    .trigger('hidden.wdesk.collapse')
                    .removeClass('collapsing')
                    .addClass('collapse');
            };

            if (!$.support.transition) {
                return complete.call(this);
            }

            var transitionDuration = this.getSpeed();
            this.$element
                [dimension](0)
                .one($.support.transition.end, $.proxy(complete, this))
                .emulateTransitionEnd(transitionDuration)
        }

      , toggle: function () {
            this[this.$element.hasClass('in') ? 'hide' : 'show']();
            var $heading = this.$element.parent().find('.accordion-heading');
            if($heading) {
                $heading.toggleClass('open');
            }
        }

    };


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    var old = $.fn.collapse;

    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('wdesk.collapse');
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);
            
            if (!data) { 
                $this.data('wdesk.collapse', (data = new Collapse(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();  
            }
        });
    };

    $.fn.collapse.Constructor = Collapse;


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old;
        return this;
    };


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.wdesk.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this   = $(this), href;
        var target  = $this.attr('data-target')
            || e.preventDefault()
            || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); //strip for ie7
        var $target = $(target);
        var data    = $target.data('wdesk.collapse');
        var option  = data ? 'toggle' : $this.data();
        var parent  = $this.attr('data-parent');
        var $parent = parent && $(parent);

        if (!data || !data.transitioning) {
          if ($parent) $parent.find('[data-toggle=collapse][data-parent=' + parent + ']').not($this).addClass('collapsed');
          $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
        }

        $target.collapse(option);
    });

});

if (define.isFake) {
    define = undefined;
}
