/* ==========================================================
 * wdesk-popover.js v1.1.0 (http://bit.ly/14HLYaP)
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

define(['jquery', 'wdesk-tooltip'], function($) {

    "use strict";


    /* POPOVER PUBLIC CLASS DEFINITION
     * =============================== */

    var Popover = function (element, options) {
        this.init('popover', element, options);
    };

    Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'bottom'
      , trigger: 'click'
      , content: ''
      , angularContent: false
      , html: true
      , template: '<div class="popover"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>'
      , backdrop: '<div class="popover-backdrop backdrop "></div>'
    });


    /* NOTE: POPOVER EXTENDS WDESK-TOOLTIP.js
     * ========================================== */

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
            if(storedContent) {
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
                        if(content.indexOf('.content') < 0) {
                            content = ('<div class="content">' + content + '</div>');
                        }
                    }
                }
            } 
            
            return content;
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

      , destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type);
        }

    });


    /* POPOVER PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.popover;

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('popover')
              , options = typeof option == 'object' && option;
            if (!data) { 
                $this.data('popover', (data = new Popover(this, options)));
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
