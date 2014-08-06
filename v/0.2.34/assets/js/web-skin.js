/**
* Wdesk's web-skin.js v0.2.34 by Aaron Lademann and WebFilings <https://github.com/WebFilings>
* Copyright 2014 WebFilings <https://github.com/WebFilings>
*/
if (!jQuery) { throw new Error("web-skin.js requires jQuery") }

/* ==========================================================
 * wdesk-transition.js v1.2.0 (http://bit.ly/1bh9VJL)
 * adapted from bootstrap-transition v3.0.0
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

    if (!jQuery) {
        throw new Error('wdesk-transition.js requires jQuery');
    }

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    var transitionEnd = function () {

        var el = document.createElement('wdesk');
        
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd'
          , 'MozTransition'    : 'transitionend'
          , 'OTransition'      : 'oTransitionEnd otransitionend'
          , 'transition'       : 'transitionend'
        };

        for (var name in transEndEventNames){
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
            }
        }

    };

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false, 
            $el    = this;
        $(this).one($.support.transition.end, function () { called = true });
        var callback = function () { 
            if (!called) {
                $($el).trigger($.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $(function () {
        $.support.transition = transitionEnd();
    });

});

if (define.isFake) {
    define = undefined;
}

/* ==========================================================
 * wdesk-alert.js v1.2.0 (http://bit.ly/16ZHY1d)
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

define(['jquery', 'wdesk-transition'], 

function($) {

    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]';
    var Alert = function (element, options) {
        this.options = options;
        this.$element = $(element).on('click', dismiss, this.hide);
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-alert.js requires wdesk-transition.js');
    }

    Alert.prototype = {

        constructor: Alert

      , show: function (e) {

            var that = this
              , $this = $(this)
              , selector = $this.attr('data-target')
              , $parent;
            
            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            $parent = $(selector);

            if(e) {
                e.preventDefault();
            }

            if (! $parent.length) {
                $parent = $this.hasClass('alert') ? $this : $this.closest('.alert');
            }

            $parent.trigger('show.wdesk.alert'); // allows subscription to $elem.on('show')

            $parent.addClass('in')
                    .attr('aria-hidden', false);

            function showAlert() {
                $parent.trigger('shown.wdesk.alert'); // allows subscription to $elem.on('shown')
            }

            var transition  = $.support.transition && ($parent.hasClass('fade') || $parent.hasClass('slide') || $parent.hasClass('alert-toast'));
            transition ? 
                $parent.one($.support.transition.end, showAlert).emulateTransitionEnd(150) :
                showAlert();
        }

      , hide: function (e) {
            var $this = $(this);
            var selector = $this.attr('data-target');

            if (!selector) {
                selector = $this.attr('href');
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
            }

            var $parent = $(selector);

            if(e) {
                e.preventDefault();
            }

            if (! $parent.length) {
                $parent = $this.hasClass('alert') ? $this : $this.closest('.alert');
            }

            $parent.trigger(e = $.Event('hide.wdesk.alert'));

            if (e.isDefaultPrevented()) { 
                return;
            }

            $parent.removeClass('in')
                   .attr('aria-hidden', true);

            var removeAlert = function() {
                $parent.trigger('hidden.wdesk.alert').remove(); // allows subscription to $elem.on('hidden')
            };

            var transition  = $.support.transition && ($parent.hasClass('fade') || $parent.hasClass('slide') || $parent.hasClass('alert-toast'));
            transition ?
                $parent.one($.support.transition.end, removeAlert).emulateTransitionEnd(150) :
                removeAlert();
        }
    };


    // ALERT PLUGIN DEFINITION
    // =======================

    var old = $.fn.alert;

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('wdesk.alert')
                , options = $.extend({}, $.fn.alert.defaults, $this.data(), typeof option == 'object' && option);
            if (!data) { 
                $this.data('wdesk.alert', (data = new Alert(this, options)));
            }
            if (typeof option == 'string') { 
                data[option].call($this);
            }
        });
    };

    $.fn.alert.defaults = {
        show: false // show as soon as .alert() is called?
    };

    $.fn.alert.Constructor = Alert;


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old;
        return this;
    };


    // ALERT DATA-API
    // ==============

    $(document).on('click.wdesk.alert.data-api', dismiss, Alert.prototype.hide);

});

if (define.isFake) {
    define = undefined;
}

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

define(['jquery', 'wdesk-transition'], 

function($) {

    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element = $(element);
        this.options  = $.extend({}, Collapse.DEFAULTS, options);
        this.transitioning = null;
        this.$heading = this.$element.parent().find('[class*=heading]');

        if (this.options.parent) {
            this.$parent = $(this.options.parent);
        }
        if (this.options.toggle) {
            this.toggle();
        }
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-collapse.js requires wdesk-transition.js');
    }

    Collapse.DEFAULTS = {
        toggle: true
    };

    Collapse.prototype = {

        dimension: function () {
            var hasWidth = this.$element.hasClass('width');
            return hasWidth ? 'width' : 'height';
        }

      , show: function () {
            if (this.transitioning || this.$element.hasClass('in')) { 
                return;
            }

            var startEvent = $.Event('show.wdesk.collapse');
            this.$element.trigger(startEvent);
            if(this.$heading) {
                this.$heading.addClass('open');
            }
            if (startEvent.isDefaultPrevented()) {
                return;
            }

            var actives = this.$parent && this.$parent.find('> [class*=group] .in');

            if (actives && actives.length) {
                var hasData = actives.data('wdesk.collapse');
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
                this.$element.trigger('shown.wdesk.collapse');
            };

            if (!$.support.transition) {
                return complete.call(this);
            }

            var scrollSize = $.camelCase(['scroll', dimension].join('-'));

            this.$element
                .one($.support.transition.end, $.proxy(complete, this))
                .emulateTransitionEnd(350)
                [dimension](this.$element[0][scrollSize]);

        }

      , hide: function () {
            if (this.transitioning || !this.$element.hasClass('in')) { 
                return;
            }

            var startEvent = $.Event('hide.wdesk.collapse');
            this.$element.trigger(startEvent);
            if(this.$heading) {
                this.$heading.removeClass('open');
            }
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

            this.$element
                [dimension](0)
                .one($.support.transition.end, $.proxy(complete, this))
                .emulateTransitionEnd(350);
        }

      , toggle: function () {
            this[this.$element.hasClass('in') ? 'hide' : 'show']();
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
            if ($parent) {
                $parent.find('[data-toggle=collapse][data-parent=' + parent + ']').not($this).addClass('collapsed');
            }
            $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
        }

        $target.collapse(option);
    });

});

if (define.isFake) {
    define = undefined;
}

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

/* ==========================================================
 * wdesk-modal.js v1.2.0 (http://bit.ly/164zLvx)
 * adapted from bootstrap-modal v3.0.0
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

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options    = options;
        this.$element   = $(element);
        this.$backdrop  = null;
        this.isShown    = null;

        var o = this.options;

        this.$container = o.container       === 'body' ? $(document.body) : this.$element.closest(o.container);
        this.$parent    = o.parentContainer === 'body' ? $(document.body) : this.$element.closest(o.parentContainer);
    };

    if (!$.fn.emulateTransitionEnd) {
        throw new Error('wdesk-modal.js requires wdesk-transition.js');
    }

    Modal.DEFAULTS = {
        backdrop: true
      , backdropClass: ''
      , keyboard: true
      , show: true
      , container: 'body'
      , parentContainer: 'body'
      , sticky: false
    };

    Modal.prototype = {

        toggle: function (_relatedTarget) {
            return this[!this.isShown ? 'show' : 'hide'](_relatedTarget);
        }

      , dismissContainedModal: function (e) {
            var that = this;
            if($(e.target).closest('.modal').length < 1) {
                that.$element.trigger('click.dismiss.modal');

                $(document.body).off('click.wdesk.modal');
            }
        }

      , setupContainedModal: function ($elem) {
            var that = this;

            that.$container.addClass('modal-container');
            $elem
                .on('backdrop_shown.wdesk.modal', function () {
                    that.$parent.addClass('overlaid');
                })
                .on('backdrop_hide.wdesk.modal', function () {
                    that.$parent.removeClass('overlaid');
                    that.$container.removeClass('modal-container');
                });

            // clicking anywhere outside the contained modal should dismiss the modal if sticky option is not set to true
            if(!that.options.sticky) {
                $(document.body).on('click.wdesk.modal', $.proxy(that.dismissContainedModal, that));
            }
        }

      , autoSizeContainedModal: function () {
            var that = this;
            var $container = that.$container;
            var $parent = that.$parent;

            var $modalBody   = $container.find('.modal-body');
            var $modalHeader = $container.find('.modal-header');
            var $modalFooter = $container.find('.modal-footer');
            
            var reversedBodyAlignment = $modalBody.hasClass('top');

            var containerHeight = $parent.outerHeight();
            var containerWidth  = $parent.outerWidth();
            var containerFooterOffset = parseInt($modalFooter.css('bottom'), 10);
            var containerFooterHeight = $modalFooter.outerHeight() + containerFooterOffset;

            var modalHeaderHeight = $modalHeader.height();
            var hasBodyContent = $modalBody.length > 0 && $modalBody.text().length > 0;
            var modalBodyHeight = hasBodyContent ? $modalBody.outerHeight() : 0;

            var availableMsgHeight = containerHeight - containerFooterHeight;
            var bottomOffset = ((availableMsgHeight - modalHeaderHeight - modalBodyHeight) / 2) + containerFooterHeight;

            if(reversedBodyAlignment) {
                // reverse configuration (header below body)
                $modalBody.css('bottom', bottomOffset + modalBodyHeight);
                $modalHeader.css('bottom', bottomOffset);
            } else {
                // normal configuration (header on top, body below)
                $modalBody.css('bottom', bottomOffset);
                $modalHeader.css('bottom', bottomOffset + modalBodyHeight);
            }
        }

      , show: function (_relatedTarget) {

            var that = this;
            var o    = this.options;
            var e    = $.Event('show.wdesk.modal', { relatedTarget: _relatedTarget });

            var relatedTarget = _relatedTarget;

            this.$element.trigger(e);

            if (this.isShown || e.isDefaultPrevented()) { 
                return;
            }

            this.isShown = true;
            this.escape();
            this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));


            this.$container = o.container       === 'body' ? $(document.body) : this.$element.closest(o.container);
            this.$parent    = o.parentContainer === 'body' ? $(document.body) : this.$element.closest(o.parentContainer);

            if(o.container !== 'body') {
                this.$element.addClass('contained');
                this.setupContainedModal(this.$element);
            }

            if (o.remote) {
                // make sure that each time a modal is shown, the content is re-loaded
                this.$element.load(o.remote, function(e) {
                    that.$element.trigger($.Event('content_load.wdesk.modal'));
                    // wait until the content is done loading to call showModal
                    that.showModal(relatedTarget);
                });
            } else {
                this.showModal(relatedTarget);
            }
        }

      , showModal: function(_relatedTarget) {

            var that = this;
            var o    = this.options;

            var _isContained  = o.container === 'body' ? false : true;
            var relatedTarget = _relatedTarget;

            this.backdrop(function () {

                var transition = $.support.transition && (that.$element.hasClass('fade') || that.$element.hasClass('slide'));

                if(o.backdrop) {
                    that.$element.insertBefore(that.$backdrop);
                } else {
                    that.$element.appendTo(that.$container);
                }

                that.$element.show();

                if (transition) {
                    that.$element[0].offsetWidth; // force reflow
                }

                that.$element
                    .addClass('in')
                    .attr('aria-hidden', false);

                that.enforceFocus();

                // modal content alignment helpers
                if(_isContained) {
                    that.autoSizeContainedModal();
                }

                var complete = function() {
                    var e = $.Event('shown.wdesk.modal', { relatedTarget: relatedTarget });
                    that.$parent.addClass('modal-open');
                    that.$element.focus().trigger(e);
                };

                if(o.backdrop) {
                    that.$element.trigger($.Event('backdrop_shown.wdesk.modal'));
                }
                transition ?
                    that.$element.find('.modal-dialog')
                        .one($.support.transition.end, complete)
                        .emulateTransitionEnd(150) :
                    complete();

            });
        }

      , hide: function (e) {
            var that = this;
            var o    = this.options;

            var transition = $.support.transition && (that.$element.hasClass('fade') || that.$element.hasClass('slide'));
            
            if (e) { 
                try { 
                    e.preventDefault(); 
                } catch(err) {
                    // preventDefault() not defined
                }
            }
            e = $.Event('hide.wdesk.modal');

            if(o.backdrop) {
                this.$element.trigger($.Event('backdrop_hide.wdesk.modal'));
            }
            this.$element.trigger(e);

            if (!this.isShown || e.isDefaultPrevented()) { 
                return;
            }

            this.isShown = false;

            this.escape();

            $(document).off('focusin.wdesk.modal');

            this.$element
                .removeClass('in')
                .attr('aria-hidden', true)
                .off('click.dismiss.modal');

            transition ?
                this.$element.find('.modal-dialog')
                    .one($.support.transition.end, $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(150) :
                this.hideModal();
        }

      , hideModal: function () {
            var that = this;
            var o    = this.options;

            this.$element.hide();

            this.backdrop(function () {
                
                if(o.backdrop) {
                    that.removeBackdrop();
                    that.$element.trigger('backdrop_hidden.wdesk.modal');
                }
                if(o.remote) {
                    that.removeModal();
                }
                
                that.$parent.removeClass('modal-open');
                that.$element
                    .removeClass('contained')
                    .trigger('hidden.wdesk.modal');
            });
        }

      , removeModal: function () {
            this.$element && this.$element.find('.modal-dialog').remove();
            this.$element.trigger($.Event('content_unload.wdesk.modal'));
        }

      , removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove();
            this.$backdrop = null;
        }

      , backdrop: function (callback) {
            var that    = this;
            var o       = this.options;
            var animate = (this.$element.hasClass('fade') || this.$element.hasClass('slide')) ? 'fade' : '';

            if (this.isShown && o.backdrop) {
                var doAnimate = $.support.transition && animate;

                this.$backdrop = $('<div class="modal-backdrop ' + animate + ' ' + o.backdropClass + '" />');
                this.$backdrop.appendTo(this.$container);

                this.$element.on('click.dismiss.modal',$.proxy(function (e) {
                    if(e.target !== e.currentTarget) { return; }
                    o.backdrop == 'static'
                        ? this.$element[0].focus.call(this.$element[0])
                        : this.hide.call(this);
                }, this));

                if (doAnimate) {
                    this.$backdrop[0].offsetWidth; // force reflow  
                } 

                this.$element.trigger($.Event('backdrop_show.wdesk.modal'));
                this.$backdrop.addClass('in');

                if (!callback) { 
                    return;
                }

                doAnimate ?
                    this.$backdrop
                        .one($.support.transition.end, callback)
                        .emulateTransitionEnd(150) :
                    callback();

            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in');

                $.support.transition && (this.$element.hasClass('fade') || this.$element.hasClass('slide')) ?
                    this.$backdrop
                        .one($.support.transition.end, callback)
                        .emulateTransitionEnd(150) :
                    callback();

            } else if (callback) {
                callback();
            }
        }

      , enforceFocus: function () {
            $(document)
                .off('focusin.wdesk.modal') // guard against infinite focus loop
                .on('focusin.wdesk.modal', $.proxy(function (e) {
                    if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                        this.$element.focus();
                    }
                }, this));
        }

      , escape: function () {
            if (this.isShown && this.options.keyboard) {
                this.$element.on('keyup.dismiss.wdesk.modal', $.proxy(function (e) {
                    e.which == 27 && this.hide();
                }, this));
            } else if (!this.isShown) {
                this.$element.off('keyup.dismiss.wdesk.modal');
            }
        }
    };


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal;

    $.fn.modal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('wdesk.modal');
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data) { 
                $this.data('wdesk.modal', (data = new Modal(this, options)));
            }
            if (typeof option == 'string') { 
                data[option](_relatedTarget);
            }
            else if (options.show) {
                data.show(_relatedTarget);  
            }
        });
    };

    $.fn.modal.Constructor = Modal;


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };


    // MODAL DATA-API
    // ==============

    $(document).on('click.wdesk.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this   = $(this);
        var href    = $this.attr('href') || $this.attr('data-href');
        var target  = $this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''));
        var $target = $(target); //strip for ie7
        var option  = $target.data('wdesk.modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());

        e.preventDefault();

        $target
            .modal(option, $this)
            .one('hide', function () {
                $this.is(':visible') && $this.focus();
            });
    });

});

if (define.isFake) {
    define = undefined;
}

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

/* ==========================================================
 * wdesk-popover.js v1.2.0 (http://bit.ly/14HLYaP)
 * adapted from bootstrap-popover v3.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Twitter, Inc.
 * ========================================================== */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.jQuery);
    };
    define.isFake = true;
}

define(['jquery', 'wdesk-tooltip'], 

function($) {

    'use strict';


    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options);
    };

    if (!$.fn.tooltip) { 
        throw new Error('wdesk-popover.js requires wdesk-tooltip.js');
    }

    Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
        html: true
      , placement: 'bottom'
      , trigger: 'click'
      , content: ''
      , angularContent: false
      , modal: true
      , template: '<div class="popover"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>'
      , backdrop: '<div class="popover-backdrop backdrop"></div>'
    });


    // NOTE: POPOVER EXTENDS wdesk-tooltip.js
    // ======================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

        constructor: Popover

      , getDefaults: function () {
            return Popover.DEFAULTS;
        }

      , setContent: function () {
            var $tip = this.tip();
            var title = this.getTitle();
            var content = this.getContent();
            var o = this.options;
            var $backdrop = this.backdrop();
            var $angularContainer = $tip.find('.inner');

            var hasInPageContent = o.content ? o.content.toString().charAt(0) === '#' : false;

            if(o.angularContent === true || hasInPageContent) {
                $angularContainer.html(content);
            } else {
                if (title) {
                    $tip.find('.title')[this.options.html ? 'html' : 'text'](title);
                }
                if (content) {
                    $tip.find('.content')[this.options.html ? 'html' : 'text'](content);
                }
            }

            $tip.removeClass('fade top bottom left right in');

            // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
            // this manually by checking the contents.
            var $tipTitle = $tip.find('.title');
            if (!$tipTitle.html()) {
                $tipTitle.hide();
            }
        }

      , hasContent: function () {
            return this.getTitle() || this.getContent();
        }

      , storeContent: function (html, $container) {
            var storedContent = true;
            try {
                this.$element.data('stored-content', html);
            } catch(err) {
                // did not succeed storing the content
                storedContent = false;
            }
            if(storedContent && this.$element.data('content-container') === 'temporary') {
                // don't need this now
                $container.remove();
            }
        }

      , getContent: function () {
            var $e = this.$element;
            var o  = this.options;
            var content = $e.attr('data-content') || (typeof o.content == 'function' ?
                o.content.call($e[0]) :
                o.content);

            // if the first character of data-content is a hash
            // lets assume we want to populate the content using
            // the html content of the elem on the page with matching id
            // this is useful for injecting django template DOM into menus
            if(o.content) {
                if(o.content.toString().charAt(0) === '#') {
                    // existing content on the page as target
                    var $contentContainer = $(o.content);
                    var storedContent = $e.data('stored-content');

                    if($contentContainer.length > 0 || storedContent) {
                        content = storedContent || $contentContainer.html();
                        // store this in data so we can remove the reference content container
                        if(!storedContent && $contentContainer.length > 0) {
                            this.storeContent(content, $contentContainer);
                        }

                        // we need the content to be within .content to be a valid popover elem
                        // check to see if the content is already wrapped in it
                        if(content.indexOf('<div class="content') < 0) {
                            content = ('<div class="content">' + content + '</div>');
                        }
                    }
                }
            } 

            return content;
        }

      , arrow: function(){
            return this.$arrow = this.$arrow || this.tip().find('.arrow');
        }

      , tip: function () {
            if (!this.$tip) {
                this.$tip = $(this.options.template);
            }
            return this.$tip;
        }

      , backdrop: function () {
            if (!this.$backdrop) {
                this.$backdrop = $(this.options.backdrop);
            }
            return this.$backdrop;
        }

    });


    // POPOVER PLUGIN DEFINITION
    // =========================

    var old = $.fn.popover;

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('wdesk.popover');
            var options = typeof option == 'object' && option;
            
            if (!data) { 
                $this.data('wdesk.popover', (data = new Popover(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();  
            } 
        });
    };

    $.fn.popover.Constructor = Popover;



    /* POPOVER NO CONFLICT
     * =================== */

    $.fn.popover.noConflict = function () {
        $.fn.popover = old;
        return this;
    };

});

if (define.isFake) {
    define = undefined;
}

/* ==========================================================
 * wdesk-scrollspy.js v1.2.0 (http://bit.ly/13E6Cqd)
 * adapted from bootstrap-scrollspy v3.0.0
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

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    var ScrollSpy = function(element, options) {
        var href;
        var process = $.proxy(this.process, this);
        
        this.$element       = $(element).is('body') ? $(window) : $(element);
        this.$body          = $('body');
        this.$scrollElement = this.$element.on('scroll.wdesk.scroll-spy.data-api', process);
        this.options        = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector       = (this.options.target
            || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            || '') + ' .nav li > .hitarea';
        this.offsets        = $([]);
        this.targets        = $([]);
        this.activeTarget   = null;
        
        this.refresh();
        this.process();
    };

    if (!jQuery) {
        throw new Error('wdesk-scrollspy.js requires jQuery');
    }

    ScrollSpy.DEFAULTS = {
        offset: 10
    };

    ScrollSpy.prototype = {

        refresh: function () {
            var offsetMethod = this.$element[0] == window ? 'offset' : 'position';

            this.offsets = $([]);
            this.targets = $([]);

            var self     = this;
            var $targets = this.$body
                .find(this.selector)
                .map(function () {
                    var $el   = $(this);
                    var href  = $el.data('target') || $el.attr('href');
                    var $href = /^#\w/.test(href) && $(href);
                    return ($href
                        && $href.length
                        && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null;
                })
                .sort(function (a, b) { return a[0] - b[0]; })
                .each(function () {
                    self.offsets.push(this[0]);
                    self.targets.push(this[1]);
                });
        }

      , process: function () {
            var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset;
            var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
            var maxScroll    = scrollHeight - this.$scrollElement.height();
            var offsets      = this.offsets;
            var targets      = this.targets;
            var activeTarget = this.activeTarget;
            var i;

            if (scrollTop >= maxScroll) {
                return activeTarget != (i = targets.last()[0]) && this.activate (i);
            }

            for (i = offsets.length; i--;) {
                activeTarget != targets[i]
                    && scrollTop >= offsets[i]
                    && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
                    && this.activate( targets[i] );
            }
        }

      , activate: function (target) {
            this.activeTarget = target;

            $(this.selector)
                .parents('.active')
                .removeClass('active');

            var selector = this.selector
                + '[data-target="' + target + '"],'
                + this.selector + '[href="' + target + '"]';

            var active = $(selector)
                .parents('li')
                .addClass('active');

            if (active.parent('.dropdown-menu').length)  {
                // TODO: should we be using the dropdown data-api to properly "activate" the dropdown instead of just adding the class that opens it via css?
                active = active
                    .closest('.dropdown')
                    .addClass('active');
            }

            active.trigger('activate.wdesk.scrollspy');
        }

    };


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    var old = $.fn.scrollspy;

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('wdesk.scrollspy');
            var options = typeof option == 'object' && option;
            if (!data) $this.data('wdesk.scrollspy', (data = new ScrollSpy(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.scrollspy.Constructor = ScrollSpy;


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old;
        return this;
    };


    /* SCROLLSPY DATA-API
     * ================== */

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this);
            $spy.scrollspy($spy.data());
        });
    });

});

if (define.isFake) {
    define = undefined;
}

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

/* ==========================================================
 * wdesk-chosen.js v1.2.3 (http://bit.ly/18CWEdt)
 * adapted from harvest's chosen.js v1.0.0
 * ===================================================
 * Copyright 2013 WebFilings, LLC and Harvest
 * ========================================================== */
 
/* jshint quotmark: false, prototypejs: true, shadow: true, -W049: true, -W015: true, -W018: true */

(function() {

  if (!jQuery) {
      throw new Error('wdesk-chosen.js requires jQuery');
  }

  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 5;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(data.text);
          }
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      group_el = document.createElement("li");
      group_el.className = "group-result";
      group_el.innerHTML = group.search_text;
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + escapedSearchText, 'i');
      zregex = new RegExp(escapedSearchText, 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          if (!(option.group && !this.group_search)) {
            option.search_text = option.group ? option.label : option.html;
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen) {
          chosen.destroy();
        } else if (!chosen) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container select"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single dropdown"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="form-control input-sm default" autocomplete="off" style="width:25px;"></li></ul><div class="chosen-drop dropdown-menu"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default btn dropdown-toggle" tabindex="-1"><span>' + this.default_text + '</span><b class="caret"></b></a><div class="chosen-drop dropdown-menu"><div class="chosen-search"><input type="text" autocomplete="off" class="form-control input-sm"></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      this.set_label_behavior();
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled && (evt && evt.which !== 3)) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(document).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      if (this.container.is($(evt.target).closest('.chosen-container'))) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      this.results_count = this.results_data.length;
      this.no_remaining_results = this.results_count === 0;
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      if (this.is_multiple && this.no_remaining_results) {
        this.form_field_jq.trigger("chosen:allselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop open");
      this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop open");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      if(evt && evt.which !== 3) {
        var target;
        target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
        if (target.length) {
          this.result_highlight = target;
          this.result_select(evt);
          return this.search_field.focus();
        }
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice btn btn-sm"
      }).html("<span>" + item.html + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close close delete',
          'data-option-array-index': item.array_index
        }).html("&times;");
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result active");
        } else {
          this.reset_single_select_options();
        }
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = this.selected_option_count + 1;
        this.no_remaining_results = this.selected_option_count === this.results_count;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(item.text);
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").text(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = this.selected_option_count - 1;
        this.no_remaining_results = false;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close close delete\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      if (this.search_field.val() === this.default_text) {
        return "";
      } else {
        return $('<div/>').text($.trim(this.search_field.val())).html();
      }
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus btn-error");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus btn-error");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

  $.fn.chosen.Constructor = Chosen;

}).call(this);
