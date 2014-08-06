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
