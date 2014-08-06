$(function () {

    // Basic "existence" tests for promised resources within libs_ie.js

    /* jshint phantom: true, indent: false */

    // number-polyfill.js
    // full test suite found here: http://bit.ly/1fhUwGH
    // -------------------------
        module('libs: number-polyfill', {
            setup: function() {
                // prepare something for all following tests
                this.numberInput = $('<input id="number" name="number" type="number" />').appendTo('#qunit-fixture');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                
                this.numberInput = null;
            }
        });

        test('should be defined on jQuery object', function () {
            ok(this.numberInput.inputNumber(), 
                'inputNumber method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.numberInput.inputNumber()[0], this.numberInput[0], 
                'element bound to inputNumber method was not returned'
            );
        });


    // Modernizr.js
    // -------------------------
        module('libs: modernizr', {
            setup: function() {
                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should be globally defined', function () {
            ok(Modernizr, 
                'Modernizr is not globally defined'
            );
        });
        
        test('should allow custom tests to be added', function () {
            equal(typeof Modernizr.addTest, 'function',
                'Modernizr.addTest() is not a function'
            );
        });
        
        
    // Respond.js
    // -------------------------
        module('libs: respond', {
            setup: function() {
                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should be globally defined', function () {
            ok(window.respond, 
                'respond is not globally defined'
            );
        });
        
        test('should have mediaQueriesSupported defined within itself', function () {
            var mockMediaQueriesSupported = window.matchMedia && window.matchMedia('only all').matches;
            equal(window.respond.mediaQueriesSupported, mockMediaQueriesSupported,
                'respond.mediaQueriesSupported should be set correctly'
            );
        });


    // jquery-placeholder.js
    // -------------------------
        module('libs: jquery.placeholder', {
            setup: function() {
                // prepare something for all following tests
                this.$input = $('<input />').appendTo('#qunit-fixture');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                
                this.$input = null;
            }
        });

        test('should be defined on jQuery object', function () {
            ok(this.$input.placeholder(), 
                'placeholder is not defined on jQuery object'
            );
        });
        
        test('should return element', function () {
            equal(this.$input.placeholder()[0], this.$input[0], 
                'element bound to placeholder method was not returned'
            );
        });


    // ua-sniffer.js
    // -------------------------
        module('libs: ua-sniffer', {
            setup: function() {
                // prepare something for all following tests
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should be defined on the jQuery object', function () {
            ok($.client, 
                '$.client is not defined on jQuery object'
            );
        });
        
        test('should provide machine and user-agent information in object', function () {
            ok($.client.os, '$.client.os should be defined');
            ok($.client.platform, '$.client.platform should be defined');
            ok($.client.userAgent, '$.client.userAgent should be defined');
            ok($.client.browser, '$.client.browser should be defined');
            ok($.client.vendor, '$.client.vendor should be defined');
            ok($.client.version, '$.client.version should be defined');
            ok($.client.device, '$.client.device should be defined');
        });
        
        test('should provide "range" version that is one greater than current version', function () {
            equal(parseInt($.client.versionRange) - parseInt($.client.version), 1, 
                '$.client.version should be one less than $.client.versionRange'
            );
        });
        
        test('should add corresponding classes to HTML elem', function () {
            ok($('html').hasClass('os-' + $.client.os.toLowerCase()), 
                '$.client.os should be a class on HTML elem'
            );
            ok($('html').hasClass('ua-' + $.client.browser.toLowerCase()), 
                '$.client.browser should be a class on HTML elem'
            );
            ok($('html').hasClass('ua-' + $.client.browser.toLowerCase() + $.client.version), 
                '$.client.version should be a class on HTML elem'
            );
            ok($('html').hasClass('ua-lt-' + $.client.browser.toLowerCase() + $.client.versionRange), 
                '$.client.versionRange should be a class on HTML elem'
            );
            ok($('html').hasClass($.client.device.toLowerCase()), 
                '$.client.device should be a class on HTML elem'
            );
        });
});