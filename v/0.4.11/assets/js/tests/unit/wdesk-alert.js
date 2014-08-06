$(function () {

    /* global Alert */
    /* jshint phantom: true, indent: false */

    // BASE
    // -------------------------
        module('alert-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                $(document.body).off();
            }
        });

        test('should provide no conflict', function () {
            var alert = $.fn.alert.noConflict();
            ok(!$.fn.alert,
                'alert was not set back to undefined (org value)'
            );
            $.fn.alert = alert;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).alert,
                'alert method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal($(document.body).alert()[0], document.body,
                'element bound to alert method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.alert.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.alert.Constructor.DEFAULTS;

            equal(DEFAULTS.show, false, 'Alert.DEFAULTS.show');
        });


    // EVENTS
    // -------------------------
        module('alert-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                var alertDOM =
                    '<div class="alert alert-warning fade" id="alert-fade-test">' +
                        '<a class="close" href="#"" data-dismiss="alert">×</a>' +
                        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
                    '</div>';

                this.$alertElem = $(alertDOM).appendTo('#qunit-fixture');
                this.DEFAULTS = $.fn.alert.Constructor.DEFAULTS;

                this.getAlertElem = function() {
                    return $('.alert');
                };
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                $(document.body).off();
            }
        });

        test('should fire show event', function () {
            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(2); // 1 + setup test

            this.$alertElem
                .on('show.wdesk.alert', function() {
                    ok(true, 'show.wdesk.alert should be emitted');
                    start();
                })
                .alert('show');
        });

        test('should fire shown event', function () {
            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(2); // 1 + setup test

            this.$alertElem
                .on('shown.wdesk.alert', function() {
                    ok(true, 'shown.wdesk.alert should be emitted');
                    start();
                })
                .alert('show');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = false
              , shownFired = false;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.$alertElem
                .on('show.wdesk.alert', function() {
                    showFired = true;

                    ok(!shownFired,
                        'show.wdesk.alert should fire before shown.wdesk.alert does'
                    );
                })
                .on('shown.wdesk.alert', function() {
                    shownFired = true;

                    ok(showFired,
                        'shown.wdesk.alert should fire after show.wdesk.alert does'
                    );

                    start();
                })
                .alert('show');
        });

        test('should fire hide event', function () {
            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(2); // 1 + setup test

            this.$alertElem
                .on('shown.wdesk.alert', function() {
                    $(this).alert('hide');
                })
                .on('hide.wdesk.alert', function() {
                    ok(true, 'hide.wdesk.alert should be emitted');

                    start();
                })
                .alert('show');
        });

        test('should fire hidden event', function () {
            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(2); // 1 + setup test

            this.$alertElem
                .on('shown.wdesk.alert', function() {
                    $(this).alert('hide');
                })
                .on('hidden.wdesk.alert', function() {
                    ok(true, 'hidden.wdesk.alert should be emitted');

                    start();
                })
                .alert('show');
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var hideFired = false
              , hiddenFired = false;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.$alertElem
                .on('shown.wdesk.alert', function() {
                    $(this).alert('hide');
                })
                .on('hide.wdesk.alert', function() {
                    hideFired = true;
                    ok(!hiddenFired,
                        'hide.wdesk.alert should fire before hidden.wdesk.alert does'
                    );
                })
                .on('hidden.wdesk.alert', function() {
                    hiddenFired = true;

                    ok(hideFired,
                        'hidden.wdesk.alert should fire after hide.wdesk.alert does'
                    );

                    start();
                })
                .alert('show');
        });

        test('should not fire hidden when hide is prevented', function () {
            var hideFired = false
              , hiddenFired = false;

            stop();

            this.$alertElem
                .on('hide.wdesk.alert', function (e) {
                    e.preventDefault();

                    hideFired = true;

                    start();
                })
                .on('hidden.wdesk.alert', function () {
                    hiddenFired = true;
                })
                .alert('hide');

            ok(hideFired,
                'hide.wdesk.alert should be emitted despite default being prevented'
            );
            ok(!hiddenFired,
                'hidden.wdesk.alert should not be emitted when default is prevented'
            );
        });

        test('should wait until CSS transition completes before firing past-participle events', function () {
            /* MOCK TRANSITIONS */
            $.support.transition = { end: 'webkitTransitionEnd' };
            var mockTransDuration = $.fn.alert.Constructor.DEFAULTS.duration;
            $.fn.getTransitionDuration = function () {
                return mockTransDuration;
            };
            /* END MOCK TRANSITIONS */

            var that = this,
                showFired   = 0,
                shownFired  = 0,
                hideFired   = 0,
                hiddenFired = 0;

            stop();

            expect(8); // 7 + setup test

            this.$alertElem
                .on('show.wdesk.alert', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.alert', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.alert', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.alert', function (e) {
                    hiddenFired++;

                    start();
                })
                .alert('show');

            ok(mockTransDuration > 0, 'mockTransDuration must be greater than 0 for this test to work.');

            setTimeout(function () {
                equal(shownFired, 0,
                    '0ms: shown event should not have fired yet.'
                );

                setTimeout(function () {
                    equal(shownFired, 0,
                        (mockTransDuration - 50) + 'ms: shown event should not have fired yet.'
                    );
                }, mockTransDuration - 50);

                setTimeout(function () {
                    equal(shownFired, 1,
                        (mockTransDuration + 1) + 'ms: shown event should have fired.'
                    );

                    that.$alertElem.alert('hide');

                    setTimeout(function () {
                        equal(hiddenFired, 0,
                            '0ms: hidden event should not have fired yet.'
                        );

                        setTimeout(function () {
                            equal(hiddenFired, 0,
                                (mockTransDuration - 50) + 'ms: hidden event should not have fired yet.'
                            );
                        }, mockTransDuration - 50);

                        setTimeout(function () {
                            equal(hiddenFired, 1,
                                (mockTransDuration + 1) + 'ms: hidden event should have fired.'
                            );
                        }, mockTransDuration + 1);
                    }, 0);
                }, mockTransDuration + 1);
            }, 0);
        });


    // DOM MANIPULATION
    // -------------------------
        module('alert-dom', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                var alertDOM =
                    '<div class="alert alert-warning fade" id="alert-fade-test">' +
                        '<a class="close" href="#"" data-dismiss="alert">×</a>' +
                        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
                    '</div>';

                this.$alertElem = $(alertDOM).appendTo('#qunit-fixture').alert();
                this.DEFAULTS = $.fn.alert.Constructor.DEFAULTS;

                this.getAlertElem = function() {
                    return $('.alert');
                };
            },
            teardown: function() {
                // clean up after each test
                this.$alertElem.remove();
                $('#qunit-fixture').empty();
                $(document.body).off();
            }
        });

        test('should show / not show alert on instantiation based on default', function () {
            equal(this.getAlertElem().length, 1,
                'alert element should present in dom'
            );

            if(this.DEFAULTS.show) {
                ok(this.getAlertElem().hasClass('in'),
                    'alert element is visible when alert() instantiated'
                );
            } else {
                ok(!this.getAlertElem().hasClass('in'),
                    'alert element is hidden when alert() instantiated'
                );
            }
        });

        test('should fade-out alert element when data-dismiss=alert button clicked, and remove element from DOM after that', function () {
            var that = this;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(4); // 3 + setup test

            this.$alertElem
                .on('hide.wdesk.alert', function (e) {
                    equal(that.getAlertElem().length, 1,
                        'alert element should still present in dom'
                    );
                    setTimeout(function() {
                        ok(!that.getAlertElem().hasClass('in'),
                            'alert element should be hidden'
                        );
                    }, 10);
                })
                .on('hidden.wdesk.alert', function (e) {
                    setTimeout(function () {
                        equal(that.getAlertElem().length, 0,
                            'alert element should be removed from dom'
                        );

                        start();
                    }, 10);
                })
                .alert('show');

            this.$alertElem.find('[data-dismiss=alert]').click();
        });


    // METHODS
    // -------------------------
        module('alert-methods', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                var alertDOM =
                    '<div class="alert alert-warning fade" id="alert-fade-test">' +
                        '<a class="close" href="#"" data-dismiss="alert">×</a>' +
                        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
                    '</div>';

                this.$alertElem = $(alertDOM).appendTo('#qunit-fixture');
                this.DEFAULTS = $.fn.alert.Constructor.DEFAULTS;

                this.getAlertElem = function() {
                    return $('.alert');
                };

                // should be hidden initially
                ok(!this.getAlertElem().hasClass('in'),
                    'alert element not visible initially'
                );
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                $(document.body).off();
            }
        });

        test('should fade element in/out via the show/hide method', function () {
            this.$alertElem.alert('show');

            ok(this.getAlertElem().hasClass('in'),
                'alert element should gain .in css class via show() method'
            );

            this.$alertElem.alert('hide');

            ok(!this.getAlertElem().hasClass('in'),
                'alert element should lose .in css class via hide() method'
            );
        });

        test('should fade-out alert element when hide method called, and remove element from DOM after that', function () {
            var that = this;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(5); // 3 + 2 setup tests

            this.$alertElem
                .on('shown.wdesk.alert', function (e) {
                    $(this).alert('hide');
                })
                .on('hide.wdesk.alert', function (e) {
                    equal(that.getAlertElem().length, 1,
                        'alert element should still be present in dom'
                    );
                    setTimeout(function() {
                        ok(!that.getAlertElem().hasClass('in'),
                            'alert element should be hidden'
                        );
                    }, 10);
                })
                .on('hidden.wdesk.alert', function (e) {
                    setTimeout(function () {
                        equal(that.getAlertElem().length, 0,
                            'alert element should be removed from dom'
                        );

                        start();
                    }, 10);
                })
                .alert('show');
        });


});