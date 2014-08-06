/* ==========================================================
 * wdesk-tooltip.js v1.1.0 (http://bit.ly/12iYtta)
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

define(['jquery', 'wdesk-transition'], function($) {

    "use strict";


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
      , backdrop: '<div class="tooltip-backdrop backdrop "></div>'
    };

    Tooltip.prototype = {

        constructor: Tooltip

      , init: function (type, element, options) {
            var eventIn
              , eventOut
              , triggers
              , trigger
              , i;

            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.enabled = true;

            triggers = this.options.trigger.split(' ');

            for (i = triggers.length; i--;) {
                trigger = triggers[i];
                if (trigger == 'click') {
                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
                } else if (trigger != 'manual') {
                    eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
                    eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
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

      , enter: function (obj) {
            var defaults = this.getDefaults()
              , options  = {}
              , self;

            // this._options && $.each(this._options, function (key, value) {
            //     if (defaults[key] != value) options[key] = value;
            // }, this);
            this._options && $.each(this._options, function (key, value) {
                if (defaults[key] != value) options[key] = value;
            });
            // if (this._options) options = $.extend({}, defaults, this._options, $(obj.currentTarget).data());

            // self = $(obj.currentTarget)[this.type](options).data(this.type);
            self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](options).data(this.type)

            if (!self.options.delay || !self.options.delay.show) { 
                return self.show();
            }

            clearTimeout(this.timeout);
            self.hoverState = 'in';
            this.timeout = setTimeout(function() {
                if (self.hoverState == 'in') { 
                    self.show();
                }
            }, self.options.delay.show);
        }

      , leave: function (obj) {
            // var self = $(obj.currentTarget)[this.type](this._options).data(this.type);
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](this._options).data(this.type)

            if (this.timeout) clearTimeout(this.timeout);
            if (!self.options.delay || !self.options.delay.hide) return self.hide();

            self.hoverState = 'out';
            this.timeout = setTimeout(function() {
                if (self.hoverState == 'out') { 
                    self.hide();
                }
            }, self.options.delay.hide);
        }

      , show: function () {
            var $tip
              , $that = this // must localize this to get it to pass through setTimeout below
              , $backdrop
              , targetID
              , e = $.Event('show');

            if (this.hasContent() && this.enabled) {
                
                if (e.isDefaultPrevented()) { 
                    return;
                }
                $tip = this.tip();
                $backdrop = this.backdrop();
                this.setContent();

                if (this.options.animation) {
                    $tip.addClass('fade');
                    if(this.options.modal) {
                        $backdrop.addClass("fade");
                    }
                }

                targetID = typeof(this.$element.attr("data-target")) == 'string' ? this.$element.attr("data-target") : "no_pop_id";


                $tip
                    .detach()
                    .attr("id", targetID)
                    .css({ top: 0, left: 0, display: 'block' });
                if(this.options.modal) {
                    $backdrop
                        .attr("id", targetID + "_backdrop")
                        .css({ top: 0, left: 0, display: 'block' });

                    // close tooltip if backdrop is clicked
                    this.$backdrop.bind('mousedown', $.proxy(this.hide, this));
                }

                if(this.options.container) {
                    $tip.appendTo(this.options.container);
                    if(this.options.modal) {
                        $backdrop.insertAfter($tip);
                    }
                } else {
                    $tip.insertAfter(this.$element);
                    if(this.options.modal) {
                        $backdrop.appendTo('body');
                    }
                } 

                var showAndPlace = function() {
                    $tip.addClass('in');
                    if($that.options.modal) {
                        $backdrop.addClass('in');
                    }
                    $.support.transition && $tip.hasClass('fade') ?
                        $tip.one($.support.transition.end, function() { $that.$element.trigger('shown'); }) :
                        $that.$element.trigger('shown');

                    // Ensure that subsewuent calls to reapplyPlacement result in same placement
                    $that.reapplyPlacement();

                    $that.$element.trigger(e);
                };

                if (this.options.angularContent) {
                    // we need to delay just a bit before measuring this
                    // because angular must inject our content before the container will be sized accordingly.
                    setTimeout(showAndPlace, 5);
                } else {
                    showAndPlace();
                }


            }
        }

      , reapplyPlacement: function() {
            var $tip
              , btnPos
              , tipPos
              , actualWidth
              , actualHeight
              , placement;


            // Reset the arrow for when we manually reapply placement
            this.replaceArrow(0, 1, 'left'); 

            $tip = this.tip();

            btnPos = this.getPosition();

            placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement;

            actualWidth = $tip[0].offsetWidth;
            actualHeight = $tip[0].offsetHeight;

            switch (placement) {
                case 'bottom':
                    tipPos = {top: btnPos.top + btnPos.height, left: btnPos.left + btnPos.width / 2 - actualWidth / 2};
                    break;
                case 'top':
                    tipPos = {top: btnPos.top - actualHeight, left: btnPos.left + btnPos.width / 2 - actualWidth / 2};
                    break;
                case 'left':
                    tipPos = {top: btnPos.top + btnPos.height / 2 - actualHeight / 2, left: btnPos.left - actualWidth};
                    break;
                case 'right':
                    tipPos = {top: btnPos.top + btnPos.height / 2 - actualHeight / 2, left: btnPos.left + btnPos.width};
                    break;
                default:
                    tipPos = {top: btnPos.top, left: btnPos.left};
            }
            
            this.applyPlacement(btnPos, tipPos, placement, actualWidth, actualHeight);
        }
      , applyPlacement: function(btnOffset, tipOffset, placement, actualWidth, actualHeight){
            var $tip = this.tip()
              , width = $tip.width()
              , height = $tip.height()
              , delta
              , replace = false;

            // dimensions we will use to applyPlacement / detect viewport edges
            var containerWidth = $tip.parent().width();
            var containerOffset = $tip.parent().offset();

            $tip
                .offset(tipOffset)
                .addClass(placement);

            var arrowSize = (placement == 'bottom' || placement == 'top') ? this.arrow().outerHeight() : this.arrow().outerWidth();

            if (placement == 'top' && actualHeight != height) {
                tipOffset.top = tipOffset.top + height - actualHeight - arrowSize / 2;
                replace = true;
            } else if (placement == 'bottom' && actualHeight != height) {
                tipOffset.top = tipOffset.top - height + actualHeight + arrowSize / 2;
                replace = true;
            } 

            if (placement == 'bottom' || placement == 'top') {
                delta = 0;


                var minLeft = containerOffset.left + arrowSize;
                // flowing off the screen to the left
                if (tipOffset.left < minLeft) {
                    delta = (-tipOffset.left + minLeft) * 2;
                    tipOffset.left = minLeft;
                    $tip.offset(tipOffset);
                    replace = true;
                }

                var maxLeft = containerOffset.left + containerWidth + arrowSize;
                // flowing off the screen to the right
                if (tipOffset.left + actualWidth > maxLeft) {
                    var btnWidth = btnOffset.right - btnOffset.left;

                    if (replace) {
                        $tip.offset(tipOffset);
                    }
                    $tip.css({ 
                        left: 'auto',
                        right: arrowSize
                    });
                    
                    var tipLeft = btnOffset.left + btnWidth / 2 - arrowSize;
                    $tip.find(".arrow").
                        // Do this twice due to a bug in offset() for Safari
                        offset({left: tipLeft}).
                        offset({left: tipLeft});

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
        }

      , replaceArrow: function(delta, dimension, position){
            this
                .arrow()
                .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
        }

      , setContent: function () {
            var $tip = this.tip()
              , title = this.getTitle();

            $tip.find('.inner')[this.options.html ? 'html' : 'text'](title);
            $tip.removeClass('fade in top bottom left right');
        }

      , hide: function () {
            var that = this
              , $tip = this.tip()
              , $backdrop = this.backdrop()
              , e = $.Event('hide');

            this.$element.trigger(e);
            if (e.isDefaultPrevented()) { 
                return;
            }

            $tip.removeClass('in');
            if(this.options.modal) {
                $backdrop.removeClass('in');
            }

            var removeWithAnimation = function() {

                $tip.one($.support.transition.end, function () {
                    that.$element.trigger('hidden');
                    if(that.options.persist == false) {
                        $tip.remove();
                    }
                });

                if ($backdrop.hasClass('fade')) {
                    $backdrop.one($.support.transition.end, function () {                        
                        if(that.options.persist == false) {
                            $backdrop.remove();
                        }
                    });
                } else if (that.options.persist == false) {
                    $backdrop.remove();
                }


            };

            var removeWithoutAnimation = function() {
                that.$element.trigger('hidden');
                if(that.options.persist == false) {
                    $tip.remove();
                    $backdrop.remove();
                }
            };

            $.support.transition && this.$tip.hasClass('fade') ?
                removeWithAnimation() :
                removeWithoutAnimation();

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
              , o = this.options;

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
            return this.$arrow = this.$arrow || this.tip().find(".arrow");
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
            var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
        }

      , destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type);
        }

    };


    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

    var old = $.fn.tooltip;

    $.fn.tooltip = function ( option ) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('tooltip')
              , options = typeof option == 'object' && option;
            if (!data) { 
                $this.data('tooltip', (data = new Tooltip(this, options)));
            }
            if (typeof option == 'string') { 
                data[option]();
            }
        });
    };

    $.fn.tooltip.Constructor = Tooltip;



    /* TOOLTIP NO CONFLICT
     * =================== */

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };

});

if (define.isFake) {
    define = undefined;
}
