$(function () {

    /* global Transition */
    /* jshint phantom: true, indent: false */

    // BASE
    // -------------------------
        module('transition-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should be defined on jQuery support object', function () {
            notEqual($.support.transition, undefined, 'transition object is not defined');
        });

        test('should provide an end object', function () {
            ok($.support.transition ? $.support.transition.end : true, 'end string is not defined');
        });


    // emulateTransitionEnd
    // -------------------------
        module('transition-emulateTransition', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should return element', function () {
            equal($(document.body).emulateTransitionEnd(0)[0], document.body,
                'element bound to emulateTransitionEnd method was not returned'
            );
        });


    // getTransitionDuration
    // -------------------------
        module('transition-getDuration', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should return transition duration when explicitly defined', function () {
            var $div = $('<div style="-webkit-transition-duration: 300ms;" />').appendTo('#qunit-fixture');

            equal($div.getTransitionDuration(), 300);
        });

        test('should return transition duration when defined using shorthand', function () {
            var $div = $('<div style="-webkit-transition: width 300ms;" />').appendTo('#qunit-fixture');

            equal($div.getTransitionDuration(), 300);
        });

        test('should return transition duration for specified property', function () {
            var $div = $('<div style="-webkit-transition: width 300ms, height 150ms;" />').appendTo('#qunit-fixture');

            equal($div.getTransitionDuration('width'), 300);
            equal($div.getTransitionDuration('height'), 150);
        });

        test('should always return duration in milliseconds', function () {
            var $div = $('<div style="-webkit-transition: width 3s, height .15s;" />').appendTo('#qunit-fixture');

            equal($div.getTransitionDuration('width'), 3000);
            equal($div.getTransitionDuration('height'), 150);
        });
});
