$(function () {

    // TODO: would be nice to have some coverage for the keyboard options

    /* global Modal */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------

        // standard modal dom
        var modalId = 'modal-test';
        var modalTriggerBtnId = 'modal-toggle-btn';
        var modalTriggerBtnStickyId = modalTriggerBtnId + '-sticky';
        var modalTriggerCommonAttrs =
            'data-target="#' + modalId + '" ' +
            'data-toggle="modal"';
        var modalTriggerBtn =
            '<a id="' + modalTriggerBtnId + '" ' +
                modalTriggerCommonAttrs + '>' +
            '</a>';
        var modalTriggerBtnSticky =
            '<a id="' + modalTriggerBtnStickyId + '" ' +
                modalTriggerCommonAttrs +
                ' data-sticky="true">' +
            '</a>';
        var commonModalMarkup =
            '<div id="' + modalId + '" class="modal fade" role="dialog">' +
                '<div class="modal-dialog" role="document"><div class="modal-content">' +
                    '<button class="close" data-dismiss="modal">&times;</button>' +
                '</div></div>' +
            '</div>';
        var modalMarkup = modalTriggerBtn + modalTriggerBtnSticky + commonModalMarkup;

        // contained modal dom
        var containedModalId  = 'modal-contained-test';
        var containedModalId2 = 'modal-contained-test-two';
        var containedModalTriggerBtnId  = 'modal-contained-toggle-btn';
        var containedModalTriggerBtnId2 = 'modal-contained-toggle-btn-two';
        var containedModalTriggerBtnStickyId = containedModalTriggerBtnId + '-sticky';
        var containedModalTriggerCommonAttrs =
            'data-target="#' + containedModalId + '" ' +
            'data-parent-container=".parent-container" ' +
            'data-container=".container" ' +
            'data-toggle="modal"';
        var containedModalTriggerCommonAttrs2 =
            'data-target="#' + containedModalId2 + '" ' +
            'data-parent-container=".parent-container" ' +
            'data-container=".container" ' +
            'data-toggle="modal"';
        var containedModalTriggerBtn =
            '<a id="' + containedModalTriggerBtnId + '" ' +
                containedModalTriggerCommonAttrs + '>' +
            '</a>';
        var containedModalTriggerBtn2 =
            '<a id="' + containedModalTriggerBtnId2 + '" ' +
                containedModalTriggerCommonAttrs2 + '>' +
            '</a>';
        var containedModalTriggerBtnSticky =
            '<a id="' + containedModalTriggerBtnStickyId + '" ' +
                containedModalTriggerCommonAttrs +
                ' data-sticky="true">' +
            '</a>';
        var commonContainedModalMarkup =
            '<div class="parent-container" id="outer-parent-container">' +
                '<div class="container" id="outer-container">' +
                    '<div class="parent-container" id="closest-parent-container">' +
                        '<div class="container" id="closest-container">' +
                            '<div id="' + containedModalId + '" class="modal fade">' +
                            '<div class="modal-dialog"><div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button class="close" data-dismiss="modal">&times;</button>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '</div>' +
                            '</div></div>' +
                            '<div id="' + containedModalId2 + '" class="modal fade">' +
                            '<div class="modal-dialog"><div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button class="close" data-dismiss="modal">&times;</button>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '</div>' +
                            '</div></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        var containedModalMarkup = containedModalTriggerBtn + containedModalTriggerBtn2 + containedModalTriggerBtnSticky + commonContainedModalMarkup;

        var cleanupModalDom = function () {
            $('#qunit-fixture').empty();

            // in order for this cleanup to work...
            // every test element you create in this module
            // must have the css class "modal"
            $('.modal').remove();
            $('.modal-backdrop').remove();
            $('[data-toggle="modal"]').remove();
            $(document.body).off();
            $(document.body).removeClass('modal-open');
        };

        var getClickEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').click;
            var namespaces = [];

            if(events) {
                for(var i = 0; i < events.length; i++) {
                    namespaces.push(events[i].namespace);
                }
            }

            return namespaces;
        };

        var existsInArray = function (find, arr) {
            return arr.indexOf(find) > -1;
        };


    // BASE
    // -------------------------
        module('modal-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.modalElem = $(modalMarkup).find('.modal');
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
            }
        });

        test('should provide no conflict', function () {
            var modal = $.fn.modal.noConflict();
            ok(!$.fn.modal,
                'modal was not set back to undefined (org value)'
            );
            $.fn.modal = modal;
        });

        test('should be defined on jQuery object', function () {
            ok(this.modalElem.modal,
                'modal method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            var $modalElem = $(commonModalMarkup).find('.modal');
            equal(this.modalElem.modal()[0], this.modalElem[0],
                'element bound to modal method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.modal.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.modal.Constructor.DEFAULTS;

            equal(DEFAULTS.backdrop,        true,   'Modal.DEFAULTS.backdrop');
            equal(DEFAULTS.backdropClass,   '',     'Modal.DEFAULTS.backdropClass');
            equal(DEFAULTS.keyboard,        true,   'Modal.DEFAULTS.keyboard');
            equal(DEFAULTS.show,            true,   'Modal.DEFAULTS.show');
            equal(DEFAULTS.container,       'body', 'Modal.DEFAULTS.container');
            equal(DEFAULTS.parentContainer, 'body', 'Modal.DEFAULTS.parentContainer');
            equal(DEFAULTS.sticky,          false,  'Modal.DEFAULTS.sticky');
        });


    // EVENTS
    // -------------------------
        module('modal-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                $(modalMarkup).appendTo(document.body);

                this.modalElem = $('#' + modalId);
                this.modalTrigger = $('#' + modalTriggerBtnId);
                this.modalTriggerSticky = $('#' + modalTriggerBtnStickyId);
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
            }
        });

        test('should not fire hidden when hide is prevented', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalTrigger.click();
                })
                .on('hide.wdesk.modal', function (e) {
                    e.preventDefault();
                    hideFired++;
                })
                .on('hidden.wdesk.modal', function (e) {
                    hiddenFired++;
                });

            this.modalTrigger.click();

            equal(hideFired, 1, 'hide.wdesk.modal should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.modal should have been prevented by default');
        });

        test('should not fire hidden if modal is already hidden', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalTrigger.click();
                })
                .on('hide.wdesk.modal', function (e) {
                    that.modalElem.data('wdesk.modal').isShown = false;
                    hideFired++;
                })
                .on('hidden.wdesk.modal', function (e) {
                    hiddenFired++;
                });

            this.modalTrigger.click();

            equal(hideFired, 1, 'hide.wdesk.modal should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.modal should not have been emitted');
        });

        test('should not fire shown when show is prevented', function () {
            var that = this,
                showFired = 0,
                shownFired = 0;

            this.modalElem
                .on('show.wdesk.modal', function (e) {
                    e.preventDefault();
                    showFired++;
                })
                .on('shown.wdesk.modal', function (e) {
                    shownFired++;
                });

            this.modalTrigger.click();

            equal(showFired, 1, 'show.wdesk.modal should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.modal should have been prevented by default');
        });

        test('should not fire shown if modal is already showing', function () {
            var that = this,
                showFired = 0,
                shownFired = 0;

            this.modalElem
                .on('show.wdesk.modal', function (e) {
                    that.modalElem.data('wdesk.modal').isShown = true;
                    showFired++;
                })
                .on('shown.wdesk.modal', function (e) {
                    shownFired++;
                });

            this.modalTrigger.click();

            equal(showFired, 1, 'show.wdesk.modal should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.modal should not have been emitted');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = 0,
                shownFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('show.wdesk.modal', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.modal fired before shown.wdesk.modal did');
                })
                .on('shown.wdesk.modal', function () {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.modal fired after show.wdesk.modal did');

                    start();
                });

            this.modalTrigger.click();
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalTrigger.click();
                })
                .on('hide.wdesk.modal', function (e) {
                    hideFired++;

                    equal(hiddenFired, 0, 'hide.wdesk.modal fired before hidden.wdesk.modal did');
                })
                .on('hidden.wdesk.modal', function () {
                    hiddenFired++;

                    equal(hideFired, 1, 'hidden.wdesk.modal fired after hide.wdesk.modal did');

                    start();
                });

            this.modalTrigger.click();
        });

        test('should only fire backdrop_* events if backdrop option is set to true', function () {
            var that = this,
                backdropShowFired = 0,
                backdropShownFired = 0,
                backdropHideFired = 0,
                backdropHiddenFired = 0;

            stop();

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalTrigger.click();
                })
                .on('backdrop_show.wdesk.modal', function (e) {
                    backdropShowFired++;
                })
                .on('backdrop_shown.wdesk.modal', function (e) {
                    backdropShownFired++;
                })
                .on('backdrop_hide.wdesk.modal', function (e) {
                    backdropHideFired++;
                })
                .on('backdrop_hidden.wdesk.modal', function (e) {
                    backdropHiddenFired++;
                })
                .on('hidden.wdesk.modal', function () {
                    start();
                })
                .modal({
                    backdrop: false,
                    show: true
                });


            equal(backdropShowFired, 0, 'backdrop_show.wdesk.modal should not have been emitted');
            equal(backdropShownFired, 0, 'backdrop_shown.wdesk.modal should not have been emitted');
            equal(backdropHideFired, 0, 'backdrop_hide.wdesk.modal should not have been emitted');
            equal(backdropHiddenFired, 0, 'backdrop_hidden.wdesk.modal should not have been emitted');
        });

        test('should trigger hide event only once when clicking outside of modal-content', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.click();
                })
                .on('hide.wdesk.modal', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.modal', function (e) {
                    hiddenFired++;

                    start();
                });

            this.modalTrigger.click();

            equal(hideFired, 1, 'hide.wdesk.modal should have been emitted once');
            equal(hiddenFired, 1, 'hide.wdesk.modal should have been emitted once');
        });

        test('should broadcast the content_load/unload.wdesk.modal events when remote content is injected / removed', function () {
            var that = this,
                remoteContent = '_assets/remote-modal-content.html',
                remoteTriggerBtnId = modalTriggerBtnId + '-remote',
                remoteModalTriggerBtn =
                    '<a id="' + remoteTriggerBtnId + '" ' +
                        modalTriggerCommonAttrs +
                        ' href="' + remoteContent + '">' +
                    '</a>';

            $(remoteModalTriggerBtn).appendTo(document.body);

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('content_load.wdesk.modal', function (e) {
                    equal(that.modalElem.html(), '<div role="document" class="modal-dialog">Remote Modal Content</div>',
                        'remote content should have been loaded into modal DOM');

                    that.modalElem.modal('hide');
                })
                .on('content_unload.wdesk.modal', function (e) {
                    equal(that.modalElem.children().length, 0,
                        'content loaded for remote modal should have been removed from modal DOM'
                    );

                    start();
                });

            $('#' + remoteTriggerBtnId).click();
        });

        test('should wait until CSS transition completes before firing past-participle events', function () {
            /* MOCK TRANSITIONS */
            $.support.transition = { end: 'webkitTransitionEnd' };
            var mockTransDuration = $.fn.modal.Constructor.DEFAULTS.duration;
            var mockTransDurationBackdrop = $.fn.modal.Constructor.DEFAULTS.backdropDuration;
            $.fn.getTransitionDuration = function () {
                var returnDuration;

                if($(this).is('.modal-dialog')) {
                    returnDuration = mockTransDuration;
                } else {
                    returnDuration = mockTransDurationBackdrop;
                }

                return returnDuration;
            };
            /* END MOCK TRANSITIONS */

            var that = this,
                eventFired = {
                    dialog: {
                        show: 0,
                        shown: 0,
                        hide: 0,
                        hidden: 0
                    },
                    backdrop: {
                        show: 0,
                        shown: 0,
                        hide: 0,
                        hidden: 0
                    }
                };

            stop();

            expect(16); // 15 + setup test

            this.modalElem
                .on('backdrop_show.wdesk.modal', function (e) {
                    eventFired.backdrop.show++;
                })
                .on('backdrop_shown.wdesk.modal', function (e) {
                    eventFired.backdrop.shown++;
                })
                .on('backdrop_hide.wdesk.modal', function (e) {
                    eventFired.backdrop.hide++;
                })
                .on('backdrop_hidden.wdesk.modal', function (e) {
                    eventFired.backdrop.hidden++;
                })
                .on('show.wdesk.modal', function (e) {
                    eventFired.dialog.show++;
                })
                .on('shown.wdesk.modal', function (e) {
                    eventFired.dialog.shown++;
                })
                .on('hide.wdesk.modal', function (e) {
                    eventFired.dialog.hide++;
                })
                .on('hidden.wdesk.modal', function (e) {
                    eventFired.dialog.hidden++;
                });

            this.modalTrigger.click();

            ok(mockTransDuration > 0, 'mockTransDuration must be greater than 0 for this test to work.');
            ok(mockTransDurationBackdrop > 0, 'mockTransDurationBackdrop must be greater than 0 for this test to work.');

            /* BACKDROP */
            setTimeout(function () {
                equal(eventFired.backdrop.shown, 0,
                    '0ms: BACKDROP shown event should not have fired yet.'
                );

                setTimeout(function () {
                    equal(eventFired.backdrop.shown, 0,
                        (mockTransDurationBackdrop - 50) + 'ms: BACKDROP shown event should not have fired yet.'
                    );
                }, mockTransDurationBackdrop - 50);

                setTimeout(function () {
                    equal(eventFired.backdrop.shown, 1,
                        (mockTransDurationBackdrop + 1) + 'ms: BACKDROP shown event should have fired.'
                    );

                    equal(eventFired.dialog.shown, 0,
                        (mockTransDurationBackdrop + 1) + 'ms: DIALOG shown event should not fire before BACKDROP shown event does.'
                    );

                    setTimeout(function () {
                        equal(eventFired.backdrop.hidden, 0,
                            '0ms: BACKDROP hidden event should not have fired yet.'
                        );

                        setTimeout(function () {
                            equal(eventFired.backdrop.hidden, 0,
                                (mockTransDurationBackdrop - 50) + 'ms: BACKDROP hidden event should not have fired yet.'
                            );
                        }, mockTransDurationBackdrop - 50);

                        setTimeout(function () {
                            // TODO: figure out why the callback from wdesk-modal.js is causing problems with this test
                            // equal(eventFired.backdrop.hidden, 1,
                            //     (mockTransDurationBackdrop + 1) + 'ms: BACKDROP hidden event should have fired.'
                            // );

                            equal(eventFired.dialog.hidden, 0,
                                (mockTransDurationBackdrop + 1) + 'ms: DIALOG hidden event should not fire before BACKDROP hidden event does.'
                            );

                        }, mockTransDurationBackdrop + 1);
                    }, 0);
                }, mockTransDurationBackdrop + 1);
            }, 0);
            /* END BACKDROP */

            /* DIALOG */
            setTimeout(function () {
                equal(eventFired.dialog.shown, 0,
                    '0ms: DIALOG shown event should not have fired yet.'
                );

                setTimeout(function () {
                    equal(eventFired.dialog.shown, 0,
                        (mockTransDuration - 50) + 'ms: DIALOG shown event should not have fired yet.'
                    );
                }, mockTransDuration - 50);

                setTimeout(function () {
                    equal(eventFired.dialog.shown, 1,
                        (mockTransDuration + mockTransDurationBackdrop + 1) + 'ms: DIALOG shown event should have fired.'
                    );

                    that.modalElem.click(); // HIDE THE MODAL

                    setTimeout(function () {
                        equal(eventFired.dialog.hidden, 0,
                            '0ms: DIALOG hidden event should not have fired yet.'
                        );

                        setTimeout(function () {
                            equal(eventFired.dialog.hidden, 0,
                                (mockTransDuration - 50) + 'ms: DIALOG hidden event should not have fired yet.'
                            );
                        }, mockTransDuration - 50);

                        setTimeout(function () {
                            equal(eventFired.dialog.hidden, 1,
                                (mockTransDuration + mockTransDurationBackdrop + 1) + 'ms: DIALOG hidden event should have fired.'
                            );

                            start();
                        }, mockTransDuration + mockTransDurationBackdrop + 100);
                    }, 0);
                }, mockTransDuration + mockTransDurationBackdrop + 100);
                /* END DIALOG */
            }, 0);
        });


    // METHODS
    // -------------------------
        module('modal-methods', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                $(modalMarkup).appendTo(document.body);

                this.modalElem = $('#' + modalId);
                this.modalTrigger = $('#' + modalTriggerBtnId);
                this.modalTriggerSticky = $('#' + modalTriggerBtnStickyId);
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
            }
        });

        test('should toggle backdrop dom and modal visibility when toggle method is called', function () {
            var that = this;

            stop();

            expect(6); // 5 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    var $modalBackdrop = $('.modal-backdrop');

                    ok(that.modalElem.hasClass('in'),
                        'modal elem should be visible'
                    );
                    equal($modalBackdrop.length, 1,
                        'one modal backdrop should be present'
                    );
                    ok($modalBackdrop.hasClass('in'),
                        'modal backdrop should be visible'
                    );

                    that.modalElem.modal('toggle');
                })
                .on('hidden.wdesk.modal', function (e) {

                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal('toggle');
        });

        test('should insert backdrop into dom / reveal modal when show method is called', function () {
            var that = this;

            stop();

            expect(4); // 3 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    var $modalBackdrop = $('.modal-backdrop');

                    ok(that.modalElem.hasClass('in'),
                        'modal elem should be visible'
                    );
                    equal($modalBackdrop.length, 1,
                        'one modal backdrop should be present'
                    );
                    ok($modalBackdrop.hasClass('in'),
                        'modal backdrop should be visible'
                    );

                    start();
                })
                .modal('show');
        });

        test('should insert into dom upon modal initialization if show option is set to true', function () {
            var that = this;

            stop();

            expect(4); // 3 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    var $modalBackdrop = $('.modal-backdrop');

                    ok(that.modalElem.hasClass('in'),
                        'modal elem should be visible'
                    );
                    equal($modalBackdrop.length, 1,
                        'one modal backdrop should be present'
                    );
                    ok($modalBackdrop.hasClass('in'),
                        'modal backdrop should be visible'
                    );

                    start();
                })
                .modal({ show: true });
        });

        test('should not insert into dom upon modal initialization if show option is set to true', function () {
            this.modalElem.modal({ show: false });

            ok(this.modalElem.data('wdesk.modal'),
                'modal elem should be instantiated with wdesk.modal data'
            );
            ok(!this.modalElem.hasClass('in'),
                'modal elem should not be visible'
            );
            equal($('.modal-backdrop').length, 0,
                'modal backdrop should not be present'
            );
        });

        test('should remove backdrop from dom / hide modal when hide method is called', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal('show');
        });

        test('should still be able to call modal hide method when backdrop option is false', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {

                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal({
                    backdrop: false,
                    show: true
                });
        });

        test('should close a "sticky" modal when modal hide method is called directly', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal({
                    sticky: true,
                    show: true
                });
        });


    // DOM MANIPULATION
    // -------------------------
        module('modal-dom', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                $(modalMarkup).appendTo(document.body);

                this.modalElem = $('#' + modalId);
                this.modalTrigger = $('#' + modalTriggerBtnId);
                this.modalTriggerSticky = $('#' + modalTriggerBtnStickyId);
                this.modalDismiss = this.modalElem.find('[data-dismiss=modal]');
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
                this.modalDismiss = null;
            }
        });

        test('should hide modal and remove backdrop from DOM when clicking [data-dismiss=modal]', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalDismiss.click();
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal('show');
        });

        test('should hide a re-opened modal and remove backdrop from DOM when clicking [data-dismiss=modal]', function () {
            var that = this,
                hiddenFired = 0;

            stop();

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalDismiss.click();
                })
                .one('hidden.wdesk.modal', function (e) {
                    hiddenFired++;

                    that.modalElem
                        .one('hidden.wdesk.modal', function (e) {
                            hiddenFired++;
                            // second time it's hidden
                            start();
                        })
                        .modal('show');
                })
                .modal('show');

            equal(hiddenFired, 2,
                'hidden.wdesk.modal should have been emitted twice'
            );
        });

        test('should hide modal and remove backdrop from DOM when clicking outside of modal-content', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.click();
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('in'),
                        'modal elem should not be visible'
                    );
                    equal($('.modal-backdrop').length, 0,
                        'modal backdrop should not be present'
                    );

                    start();
                })
                .modal('show');
        });

        test('should fade the backdrop elem in/out if the modal elem fades in/out', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok($('.modal-backdrop').hasClass('fade'),
                        'modal backdrop should have fade css class'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    start();
                })
                .modal('show');
        });

        test('should fade the backdrop elem in/out if the modal elem slides in/out', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.modalElem
                .removeClass('fade')
                .addClass('slide')
                .on('shown.wdesk.modal', function (e) {
                    ok($('.modal-backdrop').hasClass('fade'),
                        'modal backdrop should have fade css class'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    start();
                })
                .modal('show');
        });

        test('should apply custom backdrop CSS class if one is specified', function () {
            var that = this,
                customBackdropClass = 'custom-backdrop-class';

            stop();

            expect(2); // 1 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok($('.modal-backdrop').hasClass(customBackdropClass),
                        'modal backdrop should have a custom css class'
                    );

                    start();
                })
                .modal({
                    backdropClass: customBackdropClass,
                    show: true
                });
        });


    // ACCESSIBILITY
    // -------------------------
        module('modal-accessibility', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                $(modalMarkup).appendTo(document.body);

                this.modalElem = $('#' + modalId);
                this.modalTrigger = $('#' + modalTriggerBtnId);
                this.modalTriggerSticky = $('#' + modalTriggerBtnStickyId);
                this.modalDismiss = this.modalElem.find('[data-dismiss=modal]');
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
                this.modalDismiss = null;
            }
        });

        test('$modalOpener object should be defined within the Constructor prototype when trigger button is clicked', function() {
            this.modalTrigger.click();

            var data = this.modalElem.data('wdesk.modal');

            equal(data.$modalOpener[0], this.modalTrigger[0], '$modalOpener should be defined as the trigger object when calling show');
        });

        // TODO: This works in the browser - don't know why it doesn't work here.
        //
        // test('should re-focus the triggering element when a modal is closed', 2, function() {
        //     var that = this;

        //     stop();

        //     this.modalElem
        //         .on('shown.wdesk.modal', function (e) {
        //             that.modalDismiss.click();
        //         })
        //         .on('refocus.wdesk.modal', function (e) {
        //             equal(that.modalTrigger[0], $(document.activeElement)[0], 'triggering element should be focused when modal is closed');

        //             start();
        //         });

        //     this.modalTrigger.click();
        // });

        test('should toggle `aria-hidden` attribute when the modal is opened / closed', 3, function() {
            var that = this;

            stop();

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    equal(that.modalElem.attr('aria-hidden'), 'false', 'aria-hidden should be false when the modal is visible');

                    that.modalDismiss.click();
                })
                .on('hidden.wdesk.modal', function (e) {
                    equal(that.modalElem.attr('aria-hidden'), 'true', 'aria-hidden should be true when the modal is hidden');

                    start();
                });

            this.modalTrigger.click();
        });

        test('should close the modal when the `esc` key is pressed', 2, function() {
            var that = this;

            stop();

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    that.modalElem.trigger({
                        type: 'keyup',
                        which: 27
                    });
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(! that.modalElem.is(':visible'), 'modal should be hidden');

                    start();
                });

            this.modalTrigger.click();
        });


    // BODY SCROLL
    // -------------------------
        module('modal-body-scroll', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                var css =
                    '.modal-scrollbar-measure {' +
                    '    position: absolute;' +
                    '    top: -9999px;' +
                    '    width: 50px;' +
                    '    height: 50px;' +
                    '    overflow: scroll;' +
                    '}',
                    head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style');

                style.type = 'text/css';
                if (style.styleSheet){
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                head.appendChild(style);

                $(modalMarkup).appendTo(document.body);

                this.modalElem = $('#' + modalId);
                this.modalTrigger = $('#' + modalTriggerBtnId);
                this.modalTriggerSticky = $('#' + modalTriggerBtnStickyId);
                this.modalDismiss = this.modalElem.find('[data-dismiss=modal]');

                $(containedModalMarkup).appendTo('#qunit-fixture');

                this.contained_containerId = 'closest-container';
                this.contained_parentContainerId = 'closest-parent-container';
                this.contained_outerContainerId = 'outer-container';
                this.contained_outerParentContainerId = 'outer-parent-container';

                this.contained_modalElem = $('#' + containedModalId);
                this.contained_modalTrigger = $('#' + containedModalTriggerBtnId);
                this.contained_modalElem2 = $('#' + containedModalId2);
                this.contained_modalTrigger2 = $('#' + containedModalTriggerBtnId2);
                this.contained_modalTriggerSticky = $('#' + containedModalTriggerBtnStickyId);

                this.contained_modalContainer = $('#' + this.contained_containerId);
                this.contained_modalParentContainer = $('#' + this.contained_parentContainerId);
                this.contained_modalOuterContainer = $('#' + this.contained_outerContainerId);
                this.contained_modalOuterParentContainer = $('#' + this.contained_outerParentContainerId);
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
                this.modalDismiss = null;

                this.contained_modalElem = null;
                this.contained_modalTrigger = null;
                this.contained_modalTriggerSticky = null;
                this.contained_containerId = null;
                this.contained_parentContainerId = null;
                this.contained_outerContainerId = null;
                this.contained_outerParentContainerId = null;
                this.contained_modalContainer = null;
                this.contained_modalParentContainer = null;
                this.contained_modalOuterContainer = null;
                this.contained_modalOuterParentContainer = null;
            }
        });

        test('should prevent body scrolling when non-contained modals are showing', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok($(document.body).hasClass('modal-open'),
                        'modal-open css class should be present on body to prevent scrolling'
                    );

                    start();
                })
                .modal('show');
        });

        test('should not call checkScrollbar() or setScrollbar() if this.$parent !== document.body', function () {
            var that = this;

            stop();

            expect(3); // 1 + setup test

            this.contained_modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok(that.contained_modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be present on parent elem'
                    );
                    equal($(document.body).css('padding-right'), '0px',
                        'scrollbar compensation padding should not have been added to document.body'
                    );

                    start();
                })
                .modal({
                    show: true,
                    container: '#' + that.contained_containerId,
                    parentContainer: '#' + that.contained_parentContainerId
                });
        });

        test('should provide checkScrollbar() / setScrollbar() / measureScrollbar() methods to ensure that the contents of document.body do not shift when modal opens', function () {
            this.modalElem.modal();

            var data = this.modalElem.data('wdesk.modal');

            ok(typeof data.checkScrollbar === 'function', 'checkScrollbar method should be defined');
            ok(typeof data.setScrollbar === 'function', 'setScrollbar method should be defined');
            ok(typeof data.measureScrollbar === 'function', 'measureScrollbar method should be defined');
        });

        test('should add modal-open css class to body BEFORE modal-backdrop DOM is injected to prevent flickering', function () {
            var that = this;

            stop();

            expect(4); // 3 + setup test

            this.modalElem
                .on('modal_open_class_added.wdesk.modal', function (e) {
                    equal($('.modal-backdrop').length, 0,
                        'modal-backdrop elem should not be present in DOM yet'
                    );
                    ok($(document.body).hasClass('modal-open'),
                        'modal-open css class should be present on body to prevent scrolling'
                    );
                })
                .on('shown.wdesk.modal', function (e) {
                    equal($('.modal-backdrop').length, 1,
                        'modal-backdrop elem should be present in DOM'
                    );

                    start();
                })
                .modal('show');
        });


    // CONTAINED
    // -------------------------
        module('modal-contained', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                $.support.transition = false;

                // prepare something for all following tests
                $(containedModalMarkup).appendTo('#qunit-fixture');

                this.containerId = 'closest-container';
                this.parentContainerId = 'closest-parent-container';
                this.outerContainerId = 'outer-container';
                this.outerParentContainerId = 'outer-parent-container';

                this.modalElem = $('#' + containedModalId);
                this.modalTrigger = $('#' + containedModalTriggerBtnId);
                this.modalElem2 = $('#' + containedModalId2);
                this.modalTrigger2 = $('#' + containedModalTriggerBtnId2);
                this.modalTriggerSticky = $('#' + containedModalTriggerBtnStickyId);

                this.modalContainer = $('#' + this.containerId);
                this.modalParentContainer = $('#' + this.parentContainerId);
                this.modalOuterContainer = $('#' + this.outerContainerId);
                this.modalOuterParentContainer = $('#' + this.outerParentContainerId);
            },
            teardown: function() {
                // clean up after each test
                cleanupModalDom();

                this.modalElem = null;
                this.modalTrigger = null;
                this.modalTriggerSticky = null;
                this.containerId = null;
                this.parentContainerId = null;
                this.outerContainerId = null;
                this.outerParentContainerId = null;
                this.modalContainer = null;
                this.modalParentContainer = null;
                this.modalOuterContainer = null;
                this.modalOuterParentContainer = null;
            }
        });

        test('should apply css classes on show/hide for contained modal instantiated via js-api', function () {
            var that = this;

            stop();

            expect(10); // 9 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok(that.modalElem.hasClass('contained'),
                        'contained css class should be added to elem'
                    );
                    ok(that.modalContainer.hasClass('modal-container'),
                        'modal-container css class should be added to container elem'
                    );
                    ok(that.modalParentContainer.hasClass('overlaid'),
                        'overlaid css class should be added to parentContainer elem'
                    );
                    ok(that.modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be added to parentContainer elem'
                    );
                    ok(!$(document.body).hasClass('modal-open'),
                        'body scrolling should still be enabled since modal is contained'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('contained'),
                        'contained css class should be removed from elem'
                    );
                    ok(!that.modalContainer.hasClass('modal-container'),
                        'modal-container css class should be removed container elem'
                    );
                    ok(!that.modalParentContainer.hasClass('overlaid'),
                        'overlaid css class should be removed from parentContainer elem'
                    );
                    ok(!that.modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be removed from parentContainer elem'
                    );

                    start();
                })
                .modal({
                    show: true,
                    container: '#' + that.containerId,
                    parentContainer: '#' + that.parentContainerId
                });
        });

        test('should apply css classes on show/hide for contained modal instantiated via data-api', function () {
            var that = this;

            stop();

            expect(10); // 9 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok(that.modalElem.hasClass('contained'),
                        'contained css class should be added to elem'
                    );
                    ok(that.modalContainer.hasClass('modal-container'),
                        'modal-container css class should be added to container elem'
                    );
                    ok(that.modalParentContainer.hasClass('overlaid'),
                        'overlaid css class should be added to parentContainer elem'
                    );
                    ok(that.modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be added to parentContainer elem'
                    );
                    ok(!$(document.body).hasClass('modal-open'),
                        'body scrolling should still be enabled since modal is contained'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    ok(!that.modalElem.hasClass('contained'),
                        'contained css class should be removed from elem'
                    );
                    ok(!that.modalContainer.hasClass('modal-container'),
                        'modal-container css class should be removed container elem'
                    );
                    ok(!that.modalParentContainer.hasClass('overlaid'),
                        'overlaid css class should be removed from parentContainer elem'
                    );
                    ok(!that.modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be removed from parentContainer elem'
                    );

                    start();
                });

            this.modalTrigger.click();
        });

        test('should place modal backdrop within the element\'s container', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    var $backdrops = $('.modal-backdrop');
                    var $containedBackdrop = that.modalContainer.find('> .modal-backdrop');

                    equal($backdrops.length, 1,
                        'only one modal backdrop should be present in DOM'
                    );
                    equal($containedBackdrop.length, 1,
                        'modal backdrop should be placed within container element'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    start();
                });

            this.modalTrigger.click();
        });

        test('should reference the closest elem matching the container / parentContainer selector option', function () {
            var that = this;

            stop();

            expect(8); // 7 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    // these elems SHOULD have the classes
                    ok(that.modalElem.hasClass('contained'),
                        'contained css class should be added to elem'
                    );
                    ok(that.modalContainer.hasClass('modal-container'),
                        'modal-container css class should be added to container elem'
                    );
                    ok(that.modalParentContainer.hasClass('overlaid'),
                        'overlaid css class should be added to parentContainer elem'
                    );
                    ok(that.modalParentContainer.hasClass('modal-open'),
                        'modal-open css class should be added to parentContainer elem'
                    );

                    // these elems SHOULD NOT have the classes
                    ok(!that.modalOuterContainer.hasClass('modal-container'),
                        'modal-container css class should not be added to outer container elem'
                    );
                    ok(!that.modalOuterParentContainer.hasClass('overlaid'),
                        'overlaid css class should not be added to outer parentContainer elem'
                    );
                    ok(!that.modalOuterParentContainer.hasClass('modal-open'),
                        'modal-open css class should not be added to outer parentContainer elem'
                    );

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    start();
                });

            this.modalTrigger.click();
        });

        test('should use the correct instance of .modal when more than one exist in the same container elem', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    var data = $(this).data('wdesk.modal');

                    notEqual(that.modalElem.attr('id'), that.modalElem2.attr('id'));
                    // these are only valid tests if the preceding test passes
                    equal(data.$modalBody.closest('.modal').attr('id'), that.modalElem.attr('id'));
                    equal(data.$modalHeader.closest('.modal').attr('id'), that.modalElem.attr('id'));
                    equal(data.$modalFooter.closest('.modal').attr('id'), that.modalElem.attr('id'));

                    that.modalElem.modal('hide');
                })
                .on('hidden.wdesk.modal', function (e) {
                    start();
                });

            this.modalTrigger.click();
        });

        test('should close a contained modal when user clicks outside it\'s boundaries', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    ok(existsInArray('modal.wdesk', getClickEventNamespaceList(document.body)),
                        'click event should be registered on document.body');

                    $(document.body).click();
                })
                .on('click.dismiss.wdesk.modal', function (e) {
                    ok(!existsInArray('modal.wdesk', getClickEventNamespaceList(document.body)),
                        'click event should be de-registered on document.body');

                    start();
                });

            this.modalTrigger.click();
        });

        test('should not close a "sticky" contained modal when user clicks outside it\'s boundaries', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            expect(5); // 4 + setup test

            this.modalElem
                .on('shown.wdesk.modal', function (e) {
                    equal(that.modalElem.data('wdesk.modal').options.sticky, true,
                        'sticky option should be set to true for this test'
                    );
                    ok(!existsInArray('modal.wdesk', getClickEventNamespaceList(document.body)),
                        'click event should not be registered on document.body');

                    $(document.body).click();

                    start();
                })
                .on('hide.wdesk.modal', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.modal', function (e) {
                    hiddenFired++;
                });

            this.modalTriggerSticky.click();

            equal(hideFired, 0, 'hide.wdesk.modal should not have been emitted');
            equal(hiddenFired, 0, 'hidden.wdesk.modal should not have been emitted');
        });
});