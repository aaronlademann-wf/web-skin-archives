$(function () {

    /* global Affix */
    /* jshint phantom: true, indent: false */

    var affixTemplateDOM =
        '<div id="affixTarget">' +
            '<ul>' +
                '<li>Please affix</li>' +
                '<li>And unaffix</li>' +
            '</ul>' +
        '</div>' +
        '<div id="affixAfter" style="height: 20000px; display:block;">' +
        '</div>';

    // BASE
    // -------------------------
        module('affix-base', {
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
            }
        });

        test('should provide no conflict', function () {
            var affix = $.fn.affix.noConflict();
            ok(!$.fn.affix, 'affix was not set back to undefined (org value)');
            $.fn.affix = affix;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).affix, 'affix method is not defined on the jQuery object');
        });

        test('should return element', function () {
            equal($(document.body).affix()[0], document.body,
                'element bound to affix method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.affix.Constructor.DEFAULTS, 'defaults var object not exposed');
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.affix.Constructor.DEFAULTS;

            equal(DEFAULTS.offset, 0, 'Affix.DEFAULTS.offset');
        });


    // EVENTS
    // -------------------------
        module('affix-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.template = $(affixTemplateDOM);
                this.template.appendTo('body');

                this.affixer = $('#affixTarget').affix({
                    offset: $('#affixTarget ul').position()
                });
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.template.remove();
            }
        });

        test('should fire affix event before affix and affixed event after affix', function () {
            var affixFired = false,
                affixedFired = false;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(5); // 4 + setup test

            this.affixer
                .on('affix.wdesk.affix', function (e) {
                    ok(true, 'affix event did not trigger');

                    affixFired = true;
                    equal(affixedFired, false,
                        'affix.wdesk.affix did not fire before affixed.wdesk.affix did'
                    );
                })
                .on('affixed.wdesk.affix', function (e) {
                    ok(true, 'affixed event did not trigger');

                    affixedFired = true;
                    equal(affixFired, true,
                        'affixed.wdesk.affix did not fire after affix.wdesk.affix did'
                    );
                });

            setTimeout(function () {
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(function () {
                    window.scroll(0, 0);

                    start();
                }, 0);
            }, 0);
        });


    // DOM MANIPULATION
    // -------------------------
        module('affix-dom', {
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
            }
        });

        test('should exit early if element is not visible', function () {
            var $affix = $('<div style="display: none"></div>').affix();

            $affix.data('wdesk.affix').checkPosition();

            ok(!$affix.hasClass('affix'),
                'affix class was added despite element not being visible'
            );
        });
});
