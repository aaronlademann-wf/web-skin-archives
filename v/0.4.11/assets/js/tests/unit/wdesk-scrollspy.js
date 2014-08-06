$(function () {

    /* global Scrollspy */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------
        var topbarHTML =
            '<div class="topbar">' +
                '<div class="topbar-inner">' +
                    '<div class="container" id="scrollspyContainer">' +
                        '<h3><a href="#">Wdesk</a></h3>' +
                        '<ul class="nav">' +
                            '<li><a class="hitarea" href="#masthead">Mashthead</a></li>' +
                            '<li><a class="hitarea" href="#anotherSection">Another Section</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>';
        var mastheadHTML = '<div id="masthead" style="height: 2000px; width: 100%;"></div>';
        var anotherSectionHTML = '<div id="anotherSection" style="height: 2000px; width: 100%;"></div>';

        var scrollSpyDOM = topbarHTML + mastheadHTML + anotherSectionHTML;


    // BASE
    // -------------------------
        module('scrollspy-base', {
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
            var scrollspy = $.fn.scrollspy.noConflict();
            ok(!$.fn.scrollspy,
                'scrollspy was not set back to undefined (org value)'
            );
            $.fn.scrollspy = scrollspy;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).scrollspy,
                'scrollspy method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal($('html').scrollspy()[0], $('html')[0],
                'element bound to scrollspy method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.scrollspy.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.scrollspy.Constructor.DEFAULTS;

            equal(DEFAULTS.offset, 10, 'ScrollSpy.DEFAULTS.offset');
        });


    // DATA
    // -------------------------
        module('scrollspy-data', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $(scrollSpyDOM).appendTo(document.body);

                this.masthead = $('#masthead');
                this.anotherSection = $('#anotherSection');
                this.topbar = $('.topbar');

                $(document.body).scrollspy({ target: '#scrollspyContainer' });

                this.mastheadBtn = $('[href=#masthead]');
                this.anotherSectionBtn = $('[href=#anotherSection]');

                this.ssData = $(document.body).data('wdesk.scrollspy');
            },
            teardown: function() {
                // clean up after each test
                this.masthead.remove();
                this.anotherSection.remove();
                this.topbar.remove();
                this.mastheadBtn = null;
                this.anotherSectionBtn = null;
                this.ssData = null;

                window.scrollTo(0);
                document.body.scrollTop = 0;
            }
        });

        test('should store offsets and targets in arrays', function () {
            equal(this.ssData.offsets.length, 2,
                'two offsets should be defined'
            );
            equal(this.ssData.targets.length, 2,
                'two targets should be defined'
            );
        });


    // DOM MANIPULATION
    // -------------------------
        module('scrollspy-dom', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $(scrollSpyDOM).appendTo(document.body);

                this.masthead = $('#masthead');
                this.anotherSection = $('#anotherSection');
                this.topbar = $('.topbar');

                $(document.body).scrollspy({ target: '#scrollspyContainer' });

                this.mastheadBtn = $('[href=#masthead]');
                this.anotherSectionBtn = $('[href=#anotherSection]');

                this.ssData = $(document.body).data('wdesk.scrollspy');
            },
            teardown: function() {
                // clean up after each test
                this.masthead.remove();
                this.anotherSection.remove();
                this.topbar.remove();
                this.mastheadBtn = null;
                this.anotherSectionBtn = null;
                this.ssData = null;

                window.scrollTo(0);
                document.body.scrollTop = 0;
            }
        });
        test('should switch active class on scroll', function () {
            ok(this.topbar.find('.active'), true);
        });
});