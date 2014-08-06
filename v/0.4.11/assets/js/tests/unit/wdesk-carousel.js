$(function () {

    /* global Carousel */
    /* jshint phantom: true, indent: false */

    // BASE
    // -------------------------

        module('carousel-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should provide no conflict', function () {
            var carousel = $.fn.carousel.noConflict();
            ok(!$.fn.carousel,
                'carousel was not set back to undefined (org value)'
            );
            $.fn.carousel = carousel;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).carousel,
                'carousel method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            ok($(document.body).carousel()[0] == document.body,
                'element bound to carousel method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.carousel.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.carousel.Constructor.DEFAULTS;

            equal(DEFAULTS.interval, false,    'Collapse.DEFAULTS.interval');
            equal(DEFAULTS.pause,    'hover', 'Collapse.DEFAULTS.pause');
            equal(DEFAULTS.wrap,     false,    'Collapse.DEFAULTS.wrap');
        });


    // EVENTS
    // -------------------------

        module('carousel-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.carouselElem = $('<div id="carousel-example-generic" class="carousel slide"><ol class="page-indicators" role="menu"><li data-target="#carousel-example-generic" data-slide-to="0" class="active" role="menuitemradio" aria-checked="true"></li><li data-target="#carousel-example-generic" data-slide-to="1" role="menuitemradio" aria-checked="false"></li><li data-target="#carousel-example-generic" data-slide-to="2" role="menuitemradio" aria-checked="false"></li></ol><div class="carousel-inner" role="listbox"><div class="item active" role="option" aria-selected="true" tabindex="0"><div class="carousel-caption"></div></div><div class="item" role="option" aria-selected="false" tabindex="-1"><div class="carousel-caption"></div></div><div class="item" role="option" aria-selected="false" tabindex="-1"><div class="carousel-caption"></div></div></div><a class="left carousel-control" role="button" href="#carousel-example-generic" data-slide="prev"></a><a class="right carousel-control" role="button" href="#carousel-example-generic" data-slide="next"></a></div>');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.carouselElem = null;
            }
        });

        test('should not fire slid when slide is prevented', function () {
            var slideFired = 0,
                slidFired = 0;

            this.carouselElem
                .on('slide.wdesk.carousel', function (e) {
                    e.preventDefault();
                    slideFired++;
                })
                .on('slid.wdesk.carousel', function (e) {
                    slidFired++;
                })
                .carousel('next');

            equal(slideFired, 1, 'slide.wdesk.carousel should have been emitted once');
            equal(slidFired, 0, 'slid.wdesk.carousel should have been prevented by default');
        });

        test('should reset when slide is prevented', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.carouselElem
                .one('slide.wdesk.carousel', function (e) {
                    e.preventDefault();
                    setTimeout(function () {
                        ok(that.carouselElem.find('.item:eq(0)').is('.active'));
                        ok(that.carouselElem.find('.page-indicators li:eq(0)').is('.active'));

                        that.carouselElem.carousel('next');
                    }, 1);
                })
                .one('slid.wdesk.carousel', function (e) {
                    setTimeout(function () {
                        ok(that.carouselElem.find('.item:eq(1)').is('.active'));
                        ok(that.carouselElem.find('.page-indicators li:eq(1)').is('.active'));

                        start();
                    }, 1);
                })
                .carousel('next');
        });

        test('should fire slide event with direction', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.carouselElem
                .on('slide.wdesk.carousel', function (e) {
                    e.preventDefault();

                    ok(e.direction);
                    ok(e.direction === 'right' || e.direction === 'left');

                    start();
                })
                .carousel('next');
        });

        test('should fire slide event with relatedTarget', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.carouselElem
                .on('slide.wdesk.carousel', function (e) {
                    e.preventDefault();

                    ok(e.relatedTarget);
                    ok($(e.relatedTarget).hasClass('item'));

                    start();
                })
                .carousel('next');
        });


    // OPTIONS
    // -------------------------

        module('carousel-options', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should set interval from data attribute', function () {
            var template = $('<div id="myCarousel" class="carousel slide"> <div class="carousel-inner" role="listbox"> <div class="item active" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" role="button" href="#myCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" role="button" href="#myCarousel" data-slide="next">&rsaquo;</a> </div>');
            template.attr('data-interval', 1814);

            expect(5); // 4 + setup test

            template.appendTo('body');
            $('[data-slide]').first().click();
            ok($('#myCarousel').data('wdesk.carousel').options.interval == 1814);
            $('#myCarousel').remove();

            template.appendTo('body').attr('data-modal', 'foobar');
            $('[data-slide]').first().click();
            ok($('#myCarousel').data('wdesk.carousel').options.interval == 1814, 'even if there is an data-modal attribute set');
            $('#myCarousel').remove();

            template.appendTo('body');
            $('[data-slide]').first().click();
            $('#myCarousel').attr('data-interval', 1860);
            $('[data-slide]').first().click();
            ok($('#myCarousel').data('wdesk.carousel').options.interval == 1814, 'attributes should be read only on intitialization');
            $('#myCarousel').remove();

            template.attr('data-interval', false);
            template.appendTo('body');
            $('#myCarousel').carousel(1);
            ok($('#myCarousel').data('wdesk.carousel').options.interval === false, 'data attribute has higher priority than default options');
            $('#myCarousel').remove();
        });


    // WRAP
    // -------------------------

        module('carousel-wrap', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                var template = $('<div id="myCarousel" class="carousel slide"> <div class="carousel-inner" role="listbox"> <div class="item active" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item" role="option"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" role="button" href="#myCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" role="button" href="#myCarousel" data-slide="next">&rsaquo;</a> </div>');
                template.appendTo(document.body);

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function() {
                // clean up after each test
                $('#myCarousel').remove();
                $('#qunit-fixture').empty();
            }
        });

        test('should apply at-right-edge and at-left-edge classes for carousels with the "wrap" option set to false', function () {
            var $carouselElem = $('#myCarousel');
            $carouselElem.carousel();
            var carousel = $carouselElem.data('wdesk.carousel');

            expect(4); // 4 + setup test

            carousel.to(0);
            ok($carouselElem.hasClass('at-left-edge'),
                'carousel elem should have "at-left-edge" class'
            );
            carousel.to(carousel.$items.length - 1);
            ok(! $carouselElem.hasClass('at-left-edge'),
                'carousel elem should not have "at-left-edge" class'
            );
            ok($carouselElem.hasClass('at-right-edge'),
                'carousel elem should have "at-right-edge" class'
            );
        });

        test('should not apply at-right-edge and at-left-edge classes for carousels with the "wrap" option set to true', function () {
            var $carouselElem = $('#myCarousel');
            $carouselElem.carousel({ wrap: true });
            var carousel = $carouselElem.data('wdesk.carousel');

            expect(4); // 4 + setup test

            carousel.to(0);
            ok(! $carouselElem.hasClass('at-left-edge'),
                'carousel elem should not have "at-left-edge" class'
            );
            carousel.to(carousel.$items.length - 1);
            ok(! $carouselElem.hasClass('at-left-edge'),
                'carousel elem should not have "at-left-edge" class'
            );
            ok(! $carouselElem.hasClass('at-right-edge'),
                'carousel elem should not have "at-right-edge" class'
            );
        });


    // DOM MANIPULATION
    // -------------------------

        module('carousel-dom-accessibility', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                this.customCaptionId = 'customCaptionId';
                this.carouselElem = $('<div id="carousel-example-generic" class="carousel slide"><ol class="page-indicators" role="menu"><li data-target="#carousel-example-generic" data-slide-to="0" class="active" role="menuitemradio" aria-checked="true"></li><li data-target="#carousel-example-generic" data-slide-to="1" role="menuitemradio" aria-checked="false"></li><li data-target="#carousel-example-generic" data-slide-to="2" role="menuitemradio" aria-checked="false"></li></ol><div class="carousel-inner" role="listbox"><div class="item active" role="option"><div class="carousel-caption" id="' + this.customCaptionId + '"></div></div><div class="item" role="option"><div class="carousel-caption"></div></div><div class="item" role="option"><div class="carousel-caption"></div></div></div><a class="left carousel-control" role="button" href="#carousel-example-generic" data-slide="prev"></a><a class="right carousel-control" role="button" href="#carousel-example-generic" data-slide="next"></a></div>');
                this.carouselElem.appendTo('#qunit-fixture');
                this.carouselElem.carousel();

                this.getUnique = function(inputArray) {
                    var outputArray = [];

                    for (var i = 0; i < inputArray.length; i++)
                    {
                        if (($.inArray(inputArray[i], outputArray)) == -1)
                        {
                            outputArray.push(inputArray[i]);
                        }
                    }

                    return outputArray;
                };

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function() {
                // clean up after each test
                $('#myCarousel').remove();
                $('#qunit-fixture').empty();

                this.customCaptionId = null;
                this.carouselElem = null;
                this.getUnique = null;
            }
        });

        test('caption id should be used to link caption to item using `aria-labelledby`', function() {
            var that = this;

            var $items = this.carouselElem.find('.item');
            var itemCaptionIds = [];

            $items.each(function (index) {
                var $caption = $(this).find('.carousel-caption');
                var captionId = $caption.attr('id');
                var ariaAttr = $(this).attr('aria-labelledby');

                itemCaptionIds.push(captionId);

                ok(captionId, 'All captions must have unique ID attribute');
                equal(captionId, ariaAttr, 'Item\'s `aria-labelledby` attribute should match caption ID');
            });

            equal($items.length, this.getUnique(itemCaptionIds).length, 'Every caption ID within a carousel must be unique');
        });

        test('Accessible active/inactive carousel item attributes', function() {
            var that = this;

            var $active = this.carouselElem.find('.item.active');
            var $next   = $active.find('+ .item');

            ok($active.hasClass('active'), 'Active item should have `active` CSS class');
            equal($active.attr('aria-selected'), 'true', 'Active item should have an `aria-selected` value of `true`');
            equal($active.attr('tabindex'), '0', 'Active item should have a `tabindex` of `0`');

            ok(!$next.hasClass('active'), 'Second item should not have `active` CSS class initially');
            equal($next.attr('aria-selected'), 'false', 'Second item should have an initial `aria-selected` value of `false`');
            equal($next.attr('tabindex'), '-1', 'Second item should have an initial `tabindex` of `-1`');

            this.carouselElem.carousel('next');

            ok(!$active.hasClass('active'), 'Originally active item should no longer have `active` CSS class');
            equal($active.attr('aria-selected'), 'false', 'Originally active item should now have an `aria-selected` value of `false`');
            equal($active.attr('tabindex'), '-1', 'Originally active item should now have a `tabindex` of `-1`');

            ok($next.hasClass('active'), 'Second item should now have `active` CSS class');
            equal($next.attr('aria-selected'), 'true', 'Second item should now have an `aria-selected` value of `true`');
            equal($next.attr('tabindex'), '0', 'Second item should now have a `tabindex` of `0`');
        });

        test('Accessible active/inactive page indicator item attributes', function() {
            var that = this;

            var $activeIndicator = this.carouselElem.find('[data-slide-to]').filter('.active');
            var $nextIndicator   = $activeIndicator.find('+ [data-slide-to]');

            ok($activeIndicator.hasClass('active'), 'Active indicator should have `active` CSS class');
            equal($activeIndicator.attr('aria-checked'), 'true', 'Active indicator should have an `aria-checked` value of `true`');

            ok(!$nextIndicator.hasClass('active'), 'Second indicator should not have `active` CSS class initially');
            equal($nextIndicator.attr('aria-checked'), 'false', 'Second indicator should have an initial `aria-checked` value of `false`');

            this.carouselElem.carousel('next');

            ok(!$activeIndicator.hasClass('active'), 'Originally active indicator should no longer have `active` CSS class');
            equal($activeIndicator.attr('aria-checked'), 'false', 'Originally active indicator should now have an `aria-checked` value of `false`');

            ok($nextIndicator.hasClass('active'), 'Second indicator should now have `active` CSS class');
            equal($nextIndicator.attr('aria-checked'), 'true', 'Second indicator should now have an `aria-checked` value of `true`');
        });


    // KEYBOARD NAVIGATION / ACCESSIBILITY
    // -------------------------

        module('carousel-keyboard-accessibility', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                this.carouselElem = $('<div id="carousel-example-generic" class="carousel slide"><ol class="page-indicators" role="menu"><li data-target="#carousel-example-generic" data-slide-to="0" class="active" role="menuitemradio" aria-checked="true"></li><li data-target="#carousel-example-generic" data-slide-to="1" role="menuitemradio" aria-checked="false"></li><li data-target="#carousel-example-generic" data-slide-to="2" role="menuitemradio" aria-checked="false"></li></ol><div class="carousel-inner" role="listbox"><div class="item active" role="option" aria-selected="true" tabindex="0"><div class="carousel-caption"></div></div><div class="item" role="option" aria-selected="false" tabindex="-1"><div class="carousel-caption"></div></div><div class="item" role="option" aria-selected="false" tabindex="-1"><div class="carousel-caption"></div></div></div><a class="left carousel-control" role="button" href="#carousel-example-generic" data-slide="prev"></a><a class="right carousel-control" role="button" href="#carousel-example-generic" data-slide="next"></a></div>');
                this.carouselElem.appendTo('#qunit-fixture');
                this.carouselElem.carousel();

                this.carouselElem.find('.item.active').focus();

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function() {
                // clean up after each test
                $('#myCarousel').remove();
                $('#qunit-fixture').empty();

                this.carouselElem = null;
            }
        });

        test('down key should trigger next()', function() {
            var $item = this.carouselElem.find('.item.active');
            var $nextItem = $item.find('+ .item');

            // test is invalid if this is not a true assertion
            ok(! $nextItem.hasClass('active'), 'active item should start as the first item');

            $item.trigger({
                type: 'keydown',
                keyCode: 40
            });

            ok(! $item.hasClass('active'), 'active item should not be the original active item');
            ok($nextItem.hasClass('active'), 'active item should be the next item');
        });

        test('down key should trigger prev()', function() {
            var $item = this.carouselElem.find('.item.active');
            var $nextItem = $item.find('+ .item');

            // advance to next slide so that we can attempt to trigger prev()
            $item.trigger({
                type: 'keydown',
                keyCode: 40
            });

            // test is invalid if this is not a true assertion
            ok($nextItem.hasClass('active'), 'active item should start as the second item');

            $item.trigger({
                type: 'keydown',
                keyCode: 38
            });

            ok($item.hasClass('active'), 'active item should be the original active item');
            ok(! $nextItem.hasClass('active'), 'active item should no longer be the second item');
        });
});