/* ==========================================================
 * wdesk-tooltip.js v1.3.0 (http://bit.ly/12iYtta)
 * adapted from bootstrap-tooltip v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery);
    };
    define.isFake = true;
}

define(['jquery', 'wdesk-transition', 'underscore'], 

function($) {

    'use strict';


    /* TOOLTIP PUBLIC CLASS DEFINITION
     * =============================== */

    var Tooltip = function (element, options) {
        this.type       =
        this.options    =
        this.enabled    =
        this.timeout    =
        this.hoverState =
        this.$element   = null;

        this.init('tooltip', element, options);
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-tooltip.js requires wdesk-transition.js');
    }
    if (typeof _ === 'undefined') {
        throw new Error('wdesk-tooltip.js requires underscorejs');
    }

    Tooltip.DEFAULTS = {
        animation: true
      , html: false
      , placement: 'top'
      , selector: false
      , template: '<div class="tooltip"><div class="arrow"></div><div class="inner"></div></div>'
      , trigger: 'hover focus'
      , title: ''
      , delay: 0
      , container: 'body'
      , persist: false
      , modal: false
      , backdrop: '<div class="tooltip-backdrop backdrop"></div>'
      , angularContent: false
    };

    Tooltip.prototype = {

        constructor: Tooltip

      , init: function (type, element, options) {
            this.enabled    = true;
            this.type       = type;
            this.$element   = $(element);
            this.options    = this.getOptions(options);

            var triggers = this.options.trigger.split(' ');

            for (var i = triggers.length; i--;) {
                var trigger = triggers[i];
                
                if (trigger == 'click') {
                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
                } else if (trigger != 'manual') {
                    var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus';
                    var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';

                    this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
                }
            }

            this.options.selector ?
                (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
                this.fixTitle();
        }

      , getDefaults: function () {
            return Tooltip.DEFAULTS;
        }

      , getOptions: function (options) {
            options = $.extend({}, this.getDefaults(), this.$element.data(), options);
            if (options.delay && typeof options.delay == 'number') {
                options.delay = {
                    show: options.delay
                  , hide: options.delay
                };
            }

            return options;
        }

      , getDelegateOptions: function () {
            var options  = {};
            var defaults = this.getDefaults();

            this._options && $.each(this._options, function (key, value) {
                if (defaults[key] != value) options[key] = value;
            });

            return options;
        }

      , hasModality: function() {
            var o = this.options;
            return o.modal && (o.trigger == 'click' || o.trigger == 'manual');
        }

      , enter: function (obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('wdesk.' + this.type);

            clearTimeout(self.timeout);

            if (!self.options.delay || !self.options.delay.show) { 
                return self.show();
            }

            self.hoverState = 'in';
            self.timeout    = setTimeout(function() {
                if (self.hoverState == 'in') { 
                    self.show();
                }
            }, self.options.delay.show);
        }

      , leave: function (obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('wdesk.' + this.type);

            clearTimeout(self.timeout);

            if (!self.options.delay || !self.options.delay.hide) { 
                return self.hide();
            }

            self.hoverState = 'out';
            self.timeout    = setTimeout(function() {
                if (self.hoverState == 'out') { 
                    self.hide();
                }
            }, self.options.delay.hide);
        }

      , show: function () {
            var e = $.Event('show.wdesk.' + this.type);
            var $that = this; // must localize this to get it to pass through setTimeout below
            var o = this.options; 

            var hasContent = o.content || this.hasContent();

            if (hasContent && this.enabled) {
                this.$element.trigger(e);

                if (e.isDefaultPrevented()) { 
                    return;
                }

                var $tip = this.tip();
                var $backdrop = this.backdrop();
                
                this.setContent();

                if (o.animation) {
                    $tip.addClass('fade');
                    if(this.hasModality()) {
                        $backdrop.addClass('fade');
                    }
                }

                var placement = typeof o.placement == 'function' ?
                    o.placement.call(this, $tip[0], this.$element[0]) :
                    o.placement;

                var targetID = typeof(this.$element.attr('data-target')) == 'string' ? this.$element.attr('data-target') : 'no_pop_id';

                $tip
                    .detach()
                    .css({ top: 0, left: 0, display: 'block' })
                    .addClass(placement)
                    .attr('id', targetID);

                if(this.hasModality()) {
                    $backdrop
                        .attr('id', targetID + '_backdrop')
                        .css({ top: 0, left: 0, display: 'block' });

                    // close tooltip if backdrop is clicked
                    this.$backdrop.bind('mousedown', $.proxy(this.hide, this));
                }

                if(o.container) {
                    $tip.appendTo(o.container);
                    if(this.hasModality()) {
                        $backdrop.insertAfter($tip);
                    }
                } else {
                    $tip.insertAfter(this.$element);
                    if(this.hasModality()) {
                        $backdrop.appendTo('body');
                    }
                } 

                var showAndPlace = function() {
                    // Ensure that subsewuent calls to setupPlacement result in same placement
                    $that.setupPlacement();
                };

                if (o.angularContent) {
                    // we need to delay just a bit before measuring this
                    // because angular must inject our content before the container will be sized accordingly.
                    setTimeout(showAndPlace, 5);
                } else {
                    showAndPlace();
                }

                // update the position of the tooltip as the window is resized

                var updatePlacement = _.debounce(function(e) {
                    var updateEvent = $.Event('update.wdesk.' + $that.type);
                    $that.setupPlacement(updateEvent);
                }, 50);

                $(window)
                    .on('resize.wdesk.' + $that.type, updatePlacement)
                    .on('orientationchange.wdesk.' + $that.type, updatePlacement);

            } // END if (this.hasContent() && this.enabled)
        } // END show()

      , getCalculatedOffset: function (placement, btnOffset, actualWidth, actualHeight) {
            return placement == 'bottom' ? { top: btnOffset.top + btnOffset.height, left: btnOffset.left + btnOffset.width / 2 - actualWidth / 2  } :
                   placement == 'top'    ? { top: btnOffset.top - actualHeight,  left: btnOffset.left + btnOffset.width / 2 - actualWidth / 2     } :
                   placement == 'left'   ? { top: btnOffset.top + btnOffset.height / 2 - actualHeight / 2, left: btnOffset.left - actualWidth     } :
                /* placement == 'right' */ { top: btnOffset.top + btnOffset.height / 2 - actualHeight / 2, left: btnOffset.left + btnOffset.width };
        }

      , setupPlacement: function(e) {
            e = (typeof e === 'undefined') ? $.Event('shown.wdesk.' + this.type) : e;

            var $tip = this.tip();

            // TODO: figure out a way to possibly not have to make this duplicate call for placement
            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;

            // Reset the arrow for when we manually reapply placement
            this.replaceArrow(0, 1, 'left'); 

            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);

            if (autoPlace) { 
                placement = placement.replace(autoToken, '') || 'top';
            }

            var btnOffset    = this.getPosition();
            var actualWidth  = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;

            //
            // PARALLEL VIEWPORT EDGE DETECTION
            //  autoPlace will physically change the css placement class on the elem
            //  if the script detects that the requested placement will cause the tooltip to
            //  flow off the edge of the screen parallel to the direction requested 
            //  (e.g. off the bottom edge if bottom placement requested)
            //  we also detect viewport edges in the perpendicular axis within applyPlacement() (see: EDGE DETECTION)
            // -------------------------
            if (autoPlace) {
                var $parent = $tip.parent();

                var orgPlacement = placement;
                var docScroll    = document.documentElement.scrollTop || document.body.scrollTop;
                var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth();
                var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight();
                var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left;

                placement = placement == 'bottom' && btnOffset.top   + btnOffset.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                            placement == 'top'    && btnOffset.top   - docScroll   - actualHeight < 0                               ? 'bottom' :
                            placement == 'right'  && btnOffset.right + actualWidth > parentWidth                                    ? 'left'   :
                            placement == 'left'   && btnOffset.left  - actualWidth < parentLeft                                     ? 'right'  :
                            placement;

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement);
            }

            var tipOffset = this.getCalculatedOffset(placement, btnOffset, actualWidth, actualHeight);

            this.applyPlacement(tipOffset, placement, btnOffset, actualWidth, actualHeight);
            this.$element.trigger(e);
        }

      , applyPlacement: function(tipOffset, placement, btnOffset, actualWidth, actualHeight){
            var replace;
            var $tip   = this.tip();
            var $parent = $tip.parent();
            var $backdrop = this.backdrop();
            var $arrow = this.arrow();
            var width  = $tip[0].offsetWidth;
            var height = $tip[0].offsetHeight;

            // manually read margins because getBoundingClientRect includes difference
            var marginTop = parseInt($tip.css('margin-top'), 10);
            var marginLeft = parseInt($tip.css('margin-left'), 10);

            // we must check for NaN for ie 8/9
            if (isNaN(marginTop))  marginTop  = 0;
            if (isNaN(marginLeft)) marginLeft = 0;

            tipOffset.top  = tipOffset.top  + marginTop;
            tipOffset.left = tipOffset.left + marginLeft;

            $tip.offset(tipOffset);

            if(this.hasModality()) {
                $backdrop.addClass('in');
            }

            var arrowSize = (placement == 'bottom' || placement == 'top') ? $arrow.outerHeight() : $arrow.outerWidth();
            var containerWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth();
            var containerOffset = this.options.container == 'body' ? {top: 0, left: 0} : $parent.offset();
            
            //
            // PERPENDICULAR VIEWPORT EDGE DETECTION
            //  this will ensure that tooltips placed bottom/top
            //  will not flow off the edge of the screen right or left
            //  and that the arrow will remain pointing at the center of 
            //  the element that triggered it
            // -------------------------
            if (/bottom|top/.test(placement)) {
                var delta = 0;

                if(actualHeight != height) {
                    replace = true;

                    if(/top/.test(placement)) {
                        tipOffset.top = tipOffset.top + height - actualHeight - arrowSize / 2;
                    }
                    if(/bottom/.test(placement)) {
                        tipOffset.top = tipOffset.top - height + actualHeight + arrowSize / 2;
                    }
                }
                
                // flowing off the screen to the left
                // -------------------------
                var minLeft = containerOffset.left + arrowSize;
                if (tipOffset.left < minLeft) {
                    var tipLeft = Math.max(arrowSize, btnOffset.left);

                    $tip.css({
                        left: arrowSize,
                        right: 'auto'
                    });

                    $tip.find('.arrow').css({
                        left: tipLeft,
                        right: 'auto'
                    });

                    delta = false;
                    replace = false;
                }

                // flowing off the screen to the right
                // -------------------------
                var maxLeft = containerOffset.left + containerWidth - arrowSize;
                if (tipOffset.left + actualWidth > maxLeft) {
                    var btnWidth = btnOffset.right - btnOffset.left;
                    var tipRight = Math.max(0, containerOffset.left + containerWidth - btnOffset.right);

                    if (replace) {
                        $tip.offset(tipOffset);
                    }

                    $tip.css({
                        left: 'auto',
                        right: arrowSize
                    });

                    $tip.find('.arrow').css({
                        left: 'auto',
                        right: tipRight
                    });

                    delta = false;
                    replace = false;
                }

                if(delta) {
                    this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
                }
            } else {
                this.replaceArrow(actualHeight - height, actualHeight, 'top');
            }

            if (replace) {
                $tip.offset(tipOffset);
            }
            
            $tip.addClass('in');
        }

      , replaceArrow: function(delta, dimension, position){
            this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '');
        }

      , setContent: function () {
            var $tip = this.tip()
              , title = this.getTitle();

            $tip.find('.inner')[this.options.html ? 'html' : 'text'](title);
            $tip.removeClass('fade in top bottom left right');
        }

      , hide: function () {
            var $that = this
              , $tip = this.tip()
              , $backdrop = this.backdrop()
              , o = $that.options
              , e = $.Event('hide.wdesk.' + this.type);

            this.$element.trigger(e);

            if (e.isDefaultPrevented()) { 
                return;
            }

            $tip.removeClass('in');
            if(this.hasModality()) {
                $backdrop.removeClass('in');
            }

            var complete = function () {
                if($that.hoverState != 'in' && !o.persist) {
                    // cleanup .data() on $element if it needs 
                    // to have dynamic angular content
                    if(o.angularContent && o.trigger == 'manual') {
                        $that.$element.removeData('wdesk.' + $that.type);
                    }

                    // remove tooltip
                    $tip.remove();
                    // remove backdrop
                    if($that.hasModality()) {
                        $backdrop.remove();
                    }
                }
            };

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one($.support.transition.end, complete)
                    .emulateTransitionEnd(150) : 
                complete();

            this.$element.trigger('hidden.wdesk.' + this.type);

            // de-register the window resize event listener added in this.show()
            $(window)
                .off('resize.wdesk.' + $that.type)
                .off('orientationchange.wdesk.' + $that.type)
                .removeData('wdesk.' + $that.type);

            return this;
        }

      , fixTitle: function () {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
            }
        }

      , hasContent: function () {
            return this.getTitle();
        }

        // gets the position of the button / element that triggered the tooltip
      , getPosition: function () {
            var el = this.$element[0];
            return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
                width: el.offsetWidth
              , height: el.offsetHeight
            }, this.$element.offset());
        }

      , getTitle: function () {
            var title
              , $e = this.$element
              , o  = this.options;

            title = $e.attr('data-original-title')
                || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

            return title;
        }

      , tip: function () {
            return this.$tip = this.$tip || $(this.options.template);
        }

      , backdrop: function() {
            return this.$backdrop = this.$backdrop || $(this.options.backdrop);
        }

      , arrow: function(){
            return this.$arrow = this.$arrow || this.tip().find('.arrow');
        }

      , validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        }

      , enable: function () {
            this.enabled = true;
        }

      , disable: function () {
            this.enabled = false;
        }

      , toggleEnabled: function () {
            this.enabled = !this.enabled;
        }

      , toggle: function (e) {
            var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('wdesk.' + this.type) : this;
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
        }

      , destroy: function () {
            this.hide().$element.off('.' + this.type).removeData('wdesk.' + this.type);
        }

    };


    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

    var old = $.fn.tooltip;

    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('wdesk.tooltip')
              , options = typeof option == 'object' && option;
            
            if (!data) { 
                $this.data('wdesk.tooltip', (data = new Tooltip(this, options)));
            }
            if (typeof option == 'string') { 
                data[option]();
            }
        });
    };

    $.fn.tooltip.Constructor = Tooltip;


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };

});

if (define.isFake) {
    define = undefined;
}
