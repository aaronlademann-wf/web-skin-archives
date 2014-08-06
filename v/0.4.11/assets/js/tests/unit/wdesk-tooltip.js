$(function () {

    /* global Tooltip */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------

        var mockDefaults = {
            template:           '<div class="tooltip" role="tooltip"><div class="arrow" aria-hidden="true"></div><div class="inner"></div></div>'
          , backdropTemplate:   '<div class="tooltip-backdrop backdrop" role="presentation"></div>'
        };

        var mockOpts = {
            basic: { container: '#qunit-fixture' }
        };

        var cleanupTooltipDom = function () {
            $('#qunit-fixture').empty();
            $('.tooltip').remove();
            $('.tooltip-backdrop').remove();
            $('#dynamic-tt-test').remove();
            $(window).off('resize.wdesk.tooltip');
            $(window).off('orientationchange.wdesk.tooltip');
        };

        var getNamespaceList = function (events) {
            var namespaces = [];

            if(events) {
                for(var i = 0; i < events.length; i++) {
                    namespaces.push(events[i].namespace);
                }
            }

            return namespaces;
        };

        var getClickEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').click;

            return getNamespaceList(events);
        };

        var getResizeEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').resize;

            return getNamespaceList(events);
        };

        var getOrientationchangeEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').orientationchange;

            return getNamespaceList(events);
        };

        var existsInArray = function (find, arr) {
            return arr.indexOf(find) > -1;
        };


    // BASE
    // -------------------------
        module('tooltip-base', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.$testDiv = $('<div />');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.$testDiv = null;
            }
        });

        test('should provide no conflict', function () {
            var tooltip = $.fn.tooltip.noConflict();
            ok(!$.fn.tooltip,
                'tooltip was not set back to undefined (org value)'
            );
            $.fn.tooltip = tooltip;
        });

        test('should be defined on jQuery object', function () {
            ok(this.$testDiv.tooltip,
                'tooltip method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.$testDiv.tooltip(), this.$testDiv,
                'element bound to tooltip method was not returned'
            );
        });

        test('should have lodash defined globally if not using require', function () {
            this.$testDiv.tooltip();
            equal(typeof window._, 'function',
                'window._ should be globally available'
            );
        });

        test('should expose defaults var for settings', function () {
            ok(!!$.fn.tooltip.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.tooltip.Constructor.DEFAULTS;

            equal(DEFAULTS.animation, true, 'Tooltip.DEFAULTS.animation');
            equal(DEFAULTS.html, false, 'Tooltip.DEFAULTS.html');
            equal(DEFAULTS.placement, 'top', 'Tooltip.DEFAULTS.placement');
            equal(DEFAULTS.selector, false, 'Tooltip.DEFAULTS.selector');
            equal(DEFAULTS.template, mockDefaults.template, 'Tooltip.DEFAULTS.template');
            equal(DEFAULTS.trigger, 'hover focus', 'Tooltip.DEFAULTS.trigger');
            equal(DEFAULTS.title, '', 'Tooltip.DEFAULTS.title');
            equal(DEFAULTS.delay, 0, 'Tooltip.DEFAULTS.delay');
            equal(DEFAULTS.container, false, 'Tooltip.DEFAULTS.container');
            equal(DEFAULTS.persist, false, 'Tooltip.DEFAULTS.persist');
            equal(DEFAULTS.modal, false, 'Tooltip.DEFAULTS.modal');
            equal(DEFAULTS.backdrop, mockDefaults.backdropTemplate, 'Tooltip.DEFAULTS.backdrop');
            equal(DEFAULTS.angularContent, false, 'Tooltip.DEFAULTS.angularContent');
        });

        test('should store tooltip instance in tooltip data object', function () {
            this.$testDiv.tooltip();

            ok(this.$testDiv.data('wdesk.tooltip'),
                'tooltip instance should exist within data object'
            );
        });

        test('should allow different tooltip types to be initialized (e.g. Popovers)', function () {
            var fnInit = $.fn.tooltip.Constructor.prototype.init.toString();
            var params = fnInit.substring(fnInit.indexOf('function (') + 10, fnInit.indexOf(') {'));
                params = params.split(',');

            equal(params[0], 'type',
                'tooltip init method should allow type to be set'
            );
        });


    // EVENTS
    // -------------------------
        module('tooltip-events', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.$tip = null;
            }
        });

        test('should bind tooltip to default trigger elem events', function () {
            this.$tip.tooltip('show');

            ok( $._data(this.$tip[0], 'events').mouseover &&
                $._data(this.$tip[0], 'events').mouseout,
                'tooltip should be bound to tooltip trigger event(s)'
            );
        });

        test('should bind tooltip to non-default trigger elem events', function () {
            this.$tip
                .tooltip({ trigger: 'click' })
                .tooltip('show');

            ok( $._data(this.$tip[0], 'events').click &&
                !$._data(this.$tip[0], 'events').mouseover &&
                !$._data(this.$tip[0], 'events').mouseout,
                'tooltip should be bound to tooltip trigger event(s)'
            );
        });

        test('should not fire shown event when show is prevented', function () {
            var that = this,
                showFired = 0,
                shownFired = 0;

            this.$tip
                .on('show.wdesk.tooltip', function (e) {
                    e.preventDefault();
                    showFired++;
                })
                .on('shown.wdesk.tooltip', function (e) {
                    shownFired++;
                })
                .tooltip({ trigger: 'click' });

            this.$tip.click();

            equal(showFired, 1, 'show.wdesk.tooltip should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.tooltip should have been prevented by default');
            ok(! $('.tooltip').hasClass('in'));
        });

        test('should fire show/shown events in the correct sequence', function () {
            var that = this,
                showFired = 0,
                shownFired = 0;

            stop();

            expect(4); // 3 + setup test

            this.$tip
                .on('show.wdesk.tooltip', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.tooltip fired before shown.wdesk.tooltip did');
                })
                .on('shown.wdesk.tooltip', function () {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.tooltip fired after show.wdesk.tooltip did');
                    ok($('.tooltip').hasClass('in'));

                    start();
                })
                .tooltip({ trigger: 'click' });

            this.$tip.click();
        });

        test('should not fire hidden event when hide is prevented', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.$tip
                .on('shown.wdesk.tooltip', function (e) {
                    that.$tip.tooltip('hide');
                })
                .on('hide.wdesk.tooltip', function (e) {
                    e.preventDefault();
                    hideFired++;
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    hiddenFired++;
                })
                .tooltip({ trigger: 'click' });

            this.$tip.click();

            equal(hideFired, 1, 'hide.wdesk.tooltip should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.tooltip should have been prevented by default');
            ok($('.tooltip').hasClass('in'));
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            expect(4); // 3 + setup test

            this.$tip
                .on('shown.wdesk.tooltip', function (e) {
                    that.$tip.tooltip('hide');
                })
                .on('hide.wdesk.tooltip', function (e) {
                    hideFired++;

                    equal(hiddenFired, 0, 'hide.wdesk.tooltip fired before hidden.wdesk.tooltip did');
                })
                .on('hidden.wdesk.tooltip', function () {
                    hiddenFired++;

                    equal(hideFired, 1, 'hidden.wdesk.tooltip fired after hide.wdesk.tooltip did');
                    ok(! $('.tooltip').hasClass('in'));

                    start();
                })
                .tooltip({ trigger: 'click' });

            this.$tip.click();
        });

        test('should wait until CSS transition completes before firing past-participle events', function () {
            /* MOCK TRANSITIONS */
            $.support.transition = { end: 'webkitTransitionEnd' };
            var mockTransDuration = $.fn.tooltip.Constructor.DEFAULTS.duration;
            $.fn.getTransitionDuration = function () {
                return mockTransDuration;
            };
            /* END MOCK TRANSITIONS */

            var that = this,
                showFired   = 0,
                shownFired  = 0,
                hideFired   = 0,
                hiddenFired = 0;

            this.$tip.tooltip({ trigger: 'click' });

            stop();

            this.$tip
                .on('show.wdesk.tooltip', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.tooltip', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.tooltip', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    hiddenFired++;

                    // since this test is very touch / inconsistent.. we'll assert here instead of using `expect()`
                    ok(showFired + shownFired + hideFired + hiddenFired >= 4,
                        '`show`, `shown`, `hide` and `hidden` events should have all fired during this test'
                    );
                    start();
                })
                .click();

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

                    that.$tip.click();

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

        test('should register window `resize` and `orientationchange` event listeners when tooltip is shown', function () {
            stop();

            this.$tip
                .one('shown.wdesk.tooltip', function (e) {
                    // timeout used to mock debounce
                    setTimeout(function () {
                        ok(existsInArray('tooltip.wdesk', getResizeEventNamespaceList(window)),
                            'resize event listener should be registered on window object'
                        );
                        ok(existsInArray('tooltip.wdesk', getOrientationchangeEventNamespaceList(window)),
                            'orientationchange event listener should be registered on window object'
                        );

                        start();
                    }, 50);
                })
                .tooltip('show');
        });

        test('should de-register window `resize` and `orientationchange` event listeners when tooltip is shown', function () {
            var that = this;

            stop();

            expect(3); // 1 + setup test

            this.$tip
                .on('shown.wdesk.tooltip', function (e) {
                    that.$tip.tooltip('hide');
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    ok(!existsInArray('tooltip.wdesk', getResizeEventNamespaceList(window)),
                        'resize event listener should no longer be registered on window object'
                    );
                    ok(!existsInArray('tooltip.wdesk', getOrientationchangeEventNamespaceList(window)),
                        'orientationchange event listener should no longer be registered on window object'
                    );

                    start();
                })
                .tooltip('show');
        });


    // METHODS
    // -------------------------
        module('tooltip-methods', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.$tip = null;
            }
        });

        test('should show/hide tooltip when toggle method is called', function () {
            this.$tip
                .tooltip({ trigger: 'manual' })
                .tooltip('toggle');

            ok($('.tooltip').is('.fade.in'),
                'tooltip should be faded in'
            );

            this.$tip.tooltip('toggle');

            ok(!$('.tooltip').is('.fade.in'),
                'tooltip should be faded out'
            );
        });

        test('should show tooltip when show method is called', function () {
            this.$tip
                .tooltip({ trigger: 'manual' })
                .tooltip('show');

            ok($('.tooltip').is('.fade.in'),
                'tooltip should be faded in'
            );
        });

        test('should hide, then remove tooltip when hide method is called', function () {
            stop();

            expect(4); // 3 + setup test

            this.$tip
                .tooltip({ trigger: 'manual' })
                .tooltip('show');

            ok($('.tooltip').is('.fade.in'),
                'tooltip should be faded in'
            );

            this.$tip
                .on('hide.wdesk.tooltip', function (e) {
                    ok($('.tooltip').length > 0 && !$('.tooltip').hasClass('.in'),
                        'tooltip should be present in DOM, but faded completely out'
                    );
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    equal($('.tooltip').length, 0,
                        'tooltip should no longer be present in DOM'
                    );

                    start();
                })
                .tooltip('hide');
        });

        test('should remove all tooltip event / namespaced data when destroy method is called', function () {
            this.$tip.on('click.foo', function () {}); // add an event with another namespace
            this.$tip.tooltip('show');
            this.$tip.tooltip('destroy');

            equal($('.tooltip').length, 0,
                'tooltip should no longer exist in DOM'
            );
            ok(!$._data(this.$tip[0], 'wdesk.tooltip'),
                'tooltip should no longer have wdesk namespaced data'
            );
            ok(!$._data(this.$tip[0], 'events').mouseover && !$._data(this.$tip[0], 'events').mouseout,
                'tooltip should no longer have wdesk namespaced event handlers'
            );
            ok(existsInArray('foo', getClickEventNamespaceList(this.$tip[0])),
                'unrelated click event(s) should remain registered on tooltip'
            );
        });

        test('should register delegate selector for data-api control of tooltip', function () {
            var $div = $('<div id="tipWrapper" />');

            this.$tip.wrap($div);
            $('#tipWrapper').tooltip({ selector: 'a[rel=tooltip]', trigger: 'click' });
            $('#tipWrapper').find('a[rel=tooltip]').trigger('click');

            ok($('.tooltip').is('.fade.in'),
                'tooltip should be faded in'
            );
        });


    // DOM MANIPULATION
    // -------------------------
        module('tooltip-dom', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.$tip = null;
            }
        });

        test('should empty title attribute', function () {
            this.$tip.tooltip(mockOpts.basic);
            equal(this.$tip.attr('title'), '',
                'title attribute should be an empty string'
            );
        });

        test('should add data attribute for referencing original title', function () {
            this.$tip.tooltip(mockOpts.basic);
            equal(this.$tip.data('originalTitle'), this.tipTitle,
                'original title attr should be preserved in data attribute'
            );
        });

        test('should set aria-describedby to the element called on show', function() {
            this.$tip
                .tooltip(mockOpts.basic)
                .tooltip('show');

            ok(this.$tip.attr('aria-describedby'), 'has the right attributes');

            var id = $('.tooltip').attr('id');

            ok($('#' + id).length == 1, 'has a unique id');
            ok($('.tooltip').attr('aria-describedby') === this.$tip.attr('id'), 'they match!');
        });

        test('should remove the aria-describedby attributes on hide', function() {
            this.$tip
                .tooltip(mockOpts.basic)
                .tooltip('show');

            ok(this.$tip.attr('aria-describedby'), 'has the right attributes');

            this.$tip.tooltip('hide');

            ok(!this.$tip.attr('aria-describedby'), 'removed the attributes on hide');
        });

        test('should assign a unique id to tooltip element even if data-target is not defined', function() {
            this.$tip
                .tooltip(mockOpts.basic)
                .tooltip('show');

            var id = $('.tooltip').attr('id');

            ok($('#' + id).length == 1 && id.indexOf('tooltip') === 0, 'generated prefixed and unique tooltip id');
        });

        test('should add CSS ID to tooltip relative to data-target attribute', function() {
            var testID = 'tooltip-html-entity-test';
            this.$tip.attr('data-target', testID);
            this.$tip
                .tooltip($.extend({}, mockOpts.basic, { trigger: 'manual', modal: true }))
                .tooltip('show');

            var $testTip = $('#' + testID);
            var $testTipBackdrop = $('#' + testID + '_backdrop');

            equal($testTip.length, 1,
                'CSS ID added to tooltip from data-target of button that triggered it'
            );
            equal($testTipBackdrop.length, 1,
                'CSS ID added to tooltip backdrop from data-target of button that triggered it'
            );
        });

        test('should respect custom classes', function () {
            var customClass = 'foobar';
            var customTemplate = '<div class="tooltip ' + customClass +'"><div class="arrow"></div><div class="inner"></div></div>';
            this.$tip
                .tooltip({ template: customTemplate })
                .tooltip('show');

            ok($('.tooltip').hasClass(customClass),
                'custom css class should be present'
            );
        });

        test('should generate tooltip DOM when no container is specified', function () {
            this.$tip
                .tooltip({ trigger: 'manual', modal: true })
                .tooltip('show');

            equal($('.tooltip').length, 1,
                'only one tooltip should be present in DOM'
            );
            equal($('.tooltip-backdrop').length, 1,
                'only one tooltip backdrop should be present in DOM'
            );
            equal(this.$tip.find('+ .tooltip').length, 1,
                'tooltip DOM should be directly adjacent after rel=tooltip elem'
            );
            equal($(document.body).find('> .tooltip-backdrop').length, 1,
                'tooltip backdrop DOM should be an immediate child of document.body'
            );
        });


    // OPTIONS
    // -------------------------
        module('tooltip-options', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.tipTitleHtml = '<b>Another tooltip</b>';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.$tip = null;
            }
        });

        test('should use tooltip title attr when no title option is set via js-api', function () {
            this.$tip.tooltip('show');

            equal($('.tooltip').children('.inner').text(), this.tipTitle,
                'contents of title attribute should exist within .inner elem'
            );
        });

        test('should use tooltip title attr even if title option is set via js-api', function () {
            var titleOptContents = 'title option contents';
            this.$tip
                .tooltip({ title: titleOptContents })
                .tooltip('show');

            notEqual($('.tooltip').children('.inner').text(), titleOptContents,
                'contents of tooltip title option should not exist within .inner elem'
            );
        });

        test('should use tooltip js-api title option when no title attribute is present', function () {
            var titleOptContents = 'title option contents';
            this.$tip.removeAttr('title');
            this.$tip
                .tooltip({ title: titleOptContents })
                .tooltip('show');

            equal($('.tooltip').children('.inner').text(), titleOptContents,
                'contents of tooltip title option should exist within .inner elem'
            );
        });

        test('should place tooltips relative to placement option', function () {
            this.$tip
                .tooltip({ placement: 'bottom' })
                .tooltip('show');

            ok($('.tooltip').is('.fade.bottom.in'), 'placement classes incorrectly applied');
        });

        test('should allow html entities', function () {
            this.$tip.attr('title', this.tipTitleHtml);
            this.$tip
                .tooltip({ html: true })
                .tooltip('show');

            equal($('.tooltip b').length, 1,
                'html tag should have been inserted in tooltip'
            );
        });

        test('should generate / remove a backdrop element if modal option is true', function () {
            this.$tip
                .tooltip({ trigger: 'manual', modal: true })
                .tooltip('toggle');

            equal($('.tooltip-backdrop').length, 1,
                'tooltip backdrop should be added to DOM'
            );
            ok($('.tooltip-backdrop').is('.fade.in'),
                'tooltip backdrop should be faded in'
            );
            equal($._data($('.tooltip-backdrop')[0], 'events').click[0].namespace, 'tooltip.wdesk',
                'tooltip backdrop click event binding should be properly namespaced'
            );

            this.$tip.tooltip('toggle');

            equal($('.tooltip-backdrop').length, 0,
                'tooltip backdrop should be removed from DOM'
            );
        });

        test('should not generate a backdrop element if trigger is not click or manual', function () {
            this.$tip
                .tooltip({ modal: true })
                .tooltip('toggle');

            equal($('.tooltip-backdrop').length, 0,
                'tooltip backdrop should not be present in DOM'
            );
        });

        test('should hide tooltip when tooltip backdrop clicked if modal option is true', function () {
            this.$tip
                .tooltip({ trigger: 'manual', modal: true })
                .tooltip('toggle');

            $('.tooltip-backdrop').click();

            equal($('.tooltip').length + $('.tooltip-backdrop').length, 0,
                'tooltip and tooltip backdrop should no longer be present in DOM'
            );
        });

        test('should still show and hide the tooltip if animation option is false', function () {
            this.$tip
                .tooltip({ trigger: 'manual', animation: false, modal: true })
                .tooltip('toggle');

            // no "animation" classes
            ok(!$('.tooltip').hasClass('.fade'),
                'tooltip should not have .fade class'
            );
            ok(!$('.tooltip-backdrop').hasClass('.fade'),
                'tooltip backdrop should not have .fade class'
            );

            // but still visible
            equal($('.tooltip')[0].style.display, 'block',
                'tooltip should be visible'
            );
            equal($('.tooltip-backdrop')[0].style.display, 'block',
                'tooltip backdrop should be visible'
            );
        });

        test('should not remove tooltip elem from DOM if persist option is true', function () {
            stop();

            expect(3); // 2 + setup test

            this.$tip
                .tooltip({ trigger: 'manual', persist: 'true' })
                .tooltip('show');

            this.$tip
                .on('hide.wdesk.tooltip', function (e) {
                    ok($('.tooltip').length > 0 && !$('.tooltip').hasClass('.in'),
                        'tooltip should be present in DOM, but faded completely out'
                    );
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    equal($('.tooltip').length, 1,
                        'tooltip should still be present in DOM'
                    );

                    start();
                })
                .tooltip('hide');
        });

        test('should show existing persistent, hidden tooltip - not create a whole new one', function () {
            this.$tip.tooltip({ trigger: 'manual', persist: 'true' });

            this.$tip.tooltip('show');
            equal($('.tooltip').length, 1,
                'a single tooltip should be present in the DOM'
            );

            this.$tip.tooltip('hide');
            equal($('.tooltip').length, 1,
                'a single tooltip should be present in the DOM'
            );

            this.$tip.tooltip('show');
            equal($('.tooltip').length, 1,
                'a single tooltip should be present in the DOM'
            );
        });

        test('should generate tooltip DOM within specified container elem', function () {
            var $container = $('<div id="tooltip-container" />').appendTo('#qunit-fixture');
            this.$tip
                .tooltip({ container: '#tooltip-container', trigger: 'manual', modal: true })
                .tooltip('show');

            equal($('.tooltip').length, 1,
                'only one tooltip should be present in DOM'
            );
            equal($('.tooltip-backdrop').length, 1,
                'only one tooltip backdrop should be present in DOM'
            );
            equal($container.find('.tooltip').length, 1,
                'tooltip DOM should be present within specified container'
            );
            equal($('.tooltip').find('+ .tooltip-backdrop').length, 1,
                'tooltip backdrop DOM should be directly adjacent after tooltip within specified container'
            );
        });


    // TIMING
    // -------------------------
        module('tooltip-timing', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.$tip = null;
            }
        });

        test('should wait 200ms before hiding the tooltip', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.$tip.tooltip({ delay: { show: 0, hide: 200 } });

            stop();

            expect(6); // 5 + setup test

            this.$tip
                .on('hide.wdesk.tooltip', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    hiddenFired++;
                })
                .trigger('mouseenter');

            var $testTip = $('.tooltip');

            setTimeout(function () {
                ok($testTip.is('.fade.in'),
                    'tooltip should be faded in'
                );

                that.$tip.trigger('mouseout');

                setTimeout(function () {
                    ok($testTip.is('.fade.in'),
                        '100ms: tooltip should still be faded in'
                    );
                    equal(hideFired + hiddenFired, 0,
                        '100ms: tooltip hide/hidden events should not have fired.'
                    );

                    setTimeout(function () {
                        ok(!$testTip.is('.in'),
                            '250ms: tooltip should be hidden'
                        );
                        equal(hideFired + hiddenFired, 2,
                            '250ms: tooltip hide/hidden events should have fired.'
                        );

                        start();
                    }, 150);
                }, 100);
            }, 1);
        });

        test('should not hide tooltip if leave event occurs, then tooltip is shown immediately again', function () {
            var that = this,
                showFired = 0,
                shownFired = 0,
                hideFired = 0,
                hiddenFired = 0;

            this.$tip.tooltip({ delay: { show: 0, hide: 200 } });

            stop();

            expect(5); // 4 + setup test

            this.$tip
                .on('show.wdesk.tooltip', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.tooltip', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.tooltip', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    hiddenFired++;
                })
                .trigger('mouseenter');

            var $testTip = $('.tooltip');

            setTimeout(function () {
                ok($testTip.is('.fade.in'),
                    'tooltip should be faded in'
                );

                that.$tip.trigger('mouseout');

                setTimeout(function () {
                    ok($testTip.is('.fade.in'),
                        '100ms: tooltip should still be faded in'
                    );
                    equal(hideFired + hiddenFired, 0,
                        'hide / hidden events should not have fired because they cause flickering of the tip'
                    );

                    that.$tip.trigger('mouseenter');

                    setTimeout(function() {
                        ok($testTip.is('.in'),
                            '250ms: tooltip should not be hidden'
                        );

                        start();
                    }, 150);
                }, 100);
            }, 1);
        });

        test('should not show tooltip if leave event occurs before delay expires', function () {
            var that = this;

            this.$tip.tooltip({ delay: 100 });

            stop();

            expect(3); // 2 + setup test

            this.$tip.trigger('mouseenter');
            var $testTip = $('.tooltip');

            setTimeout(function () {
                ok(!$testTip.is('.fade.in'),
                    '50ms: tooltip should not be faded in yet'
                );

                that.$tip.trigger('mouseout');

                setTimeout(function () {
                    ok(!$testTip.is('.fade.in'),
                        '150ms: tooltip should not be faded in'
                    );

                    start();
                }, 100);
            }, 50);
        });

        test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function () {
            var that = this;

            this.$tip.tooltip({ delay: { show: 200, hide: 0 } });

            stop();

            expect(3); // 2 + setup test

            this.$tip.trigger('mouseenter');
            var $testTip = $('.tooltip');

            setTimeout(function () {
                ok(!$testTip.is('.fade.in'),
                    '100ms: tooltip should not be faded in yet'
                );

                that.$tip.trigger('mouseout');

                setTimeout(function () {
                    ok(!$testTip.is('.fade.in'),
                        '300ms: tooltip should not be faded in'
                    );

                    start();
                }, 200);
            }, 100);
        });

        test('should show tooltip if leave event hasn\'t occured before delay expires', function () {
            var that = this;

            this.$tip.tooltip({ delay: 150 });

            stop();

            expect(3); // 2 + setup test

            this.$tip.trigger('mouseenter');

            setTimeout(function () {
                ok(!$('.tooltip').is('.fade.in'),
                    '100ms: tooltip should not be faded in yet'
                );
            }, 100);
            setTimeout(function () {
                ok($('.tooltip').is('.fade.in'),
                    '200ms: tooltip should have faded in'
                );

                start();
            }, 200);
        });


    // POSITIONING
    // -------------------------
        module('tooltip-positioning', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();
            }
        });

        test('should place tooltip inside window', function() {
            var container = $('<div />').appendTo('body')
                .css({ position: 'absolute', width: 200, height: 200, bottom: 0, left: 0 });

            $('<a href="#" title="Very very very very very very very very long tooltip">Hover me</a>')
                .css({ position: 'absolute', top: 0, left: 0 })
                .appendTo(container)
                .tooltip({ placement: 'top', animate: false })
                .tooltip('show');

            stop();

            setTimeout(function() {
                ok($('.tooltip').offset().left >= 0);

                start();

                container.remove();
            }, 100);
        });

        test('should place tooltip on top of element', function() {
            var container = $('<div />').appendTo('body')
                .css({ position: 'absolute', bottom: 0, left: 0, textAlign: 'right', width: 300, height: 300 });
            var p = $('<p style="margin-top:200px" />').appendTo(container);
            var tooltiped = $('<a href="#" title="very very very very very very very long tooltip">Hover me</a>')
                .css({ marginTop: 200 })
                .appendTo(p)
                .tooltip({ placement: 'top', animate: false })
                .tooltip('show');

            stop();

            setTimeout(function() {
                var tooltip = container.find('.tooltip');

                start();

                ok(Math.round(tooltip.offset().top + tooltip.outerHeight()) <= Math.round(tooltiped.offset().top));
                container.remove();
            }, 100);
        });

        test('should add position class before positioning so that position-specific styles are taken into account', function() {
            $('head').append('<style id="test"> .tooltip.right { white-space: nowrap; } .tooltip.right .tooltip-inner { max-width: none; } </style>');

            var container = $('<div />').appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"></a>')
                .appendTo(container)
                .tooltip({ placement: 'right', viewport: null })
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            // this is some dumb hacky stuff because sub pixels in firefox
            var top = Math.round(target.offset().top + (target[0].offsetHeight / 2) - (tooltip[0].offsetHeight / 2));
            var top2 = Math.round(tooltip.offset().top);
            var topDiff = top - top2;

            ok(topDiff <= 1 && topDiff >= -1);
            target.tooltip('hide');

            $('head #test').remove();
            container.remove();
        });


    // FOLLOW MOUSEMOVE
    // -------------------------
        module('tooltip-follow-option', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.tipTitle = 'Another tooltip';
                this.tipTitleLong = 'Very very very very very very very very very long tooltip in one line';
                this.$tip = $('<a href="#" rel="tooltip" title="' + this.tipTitle + '"></a>');
                this.$tipLong = $('<a href="#" rel="tooltip" title="' + this.tipTitleLong + '"></a>');
                this.containerId = 'tooltip-container';
                this.$container = $('<div id="' + this.containerId + '" style="width: 400px; height: 400px; position: absolute; top: 0; left: 0;" />');

                this.$container.appendTo(document.body);

                $('head').append('<style id="tooltip-style">.tooltip { display: block; max-width: 200px; } .tooltip .inner { max-width: 200px; } .tooltip .arrow { position: absolute; height: 11px; width: 11px; }</style>');

                this.tipTriggerOffset = $.extend(this.$container.offset(), {
                    width: this.$container.outerWidth(),
                    height: this.$container.outerHeight()
                });
                this.mousePos = {
                    top:  this.tipTriggerOffset.top + Math.round(this.tipTriggerOffset.height / 2),
                    left: this.tipTriggerOffset.left + Math.round(this.tipTriggerOffset.width / 2)
                };
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.tipTitle = null;
                this.tipTitleLong = null;
                this.$tip = null;
                this.$tipLong = null;
                this.containerId = null;
                this.tipTriggerOffset = null;
                this.mousePos = null;
                this.$container.remove();

                $('#tooltip-style').remove();
            }
        });

        test('should set options necessary to make mousemove() api work better', function () {
            this.$tip
                .appendTo(this.$container)
                .tooltip({ placement: 'follow', trigger: 'hover focus', delay: 0, container: this.$container })
                .trigger('mouseenter');

            var options = this.$tip.data('wdesk.tooltip').options;

            equal(options.delay.hide, 200,
                'options.delay.hide should be 200ms even if explicity set to 0'
            );
            equal(options.container, 'body',
                'options.container should be \'body\' even if explicity set otherwise'
            );
        });

        test('should bind / unbind tooltip element to mousemove api', function () {
            stop();

            expect(3); // 2 + setup test

            var that = this;

            this.$tip
                .on('shown.wdesk.tooltip', function (e) {
                    ok($._data($(this)[0], 'events').mousemove,
                        'tooltip should be bound to mousemove api'
                    );
                })
                .on('hidden.wdesk.tooltip', function (e) {
                    deepEqual($._data($(this)[0], 'events').mousemove, undefined,
                        'tooltip should no longer be bound to mousemove api'
                    );

                    start();
                })
                .appendTo(this.$container)
                .tooltip({ placement: 'follow' })
                .trigger({
                    type: 'mouseenter',
                    clientX: this.mousePos.left,
                    clientY: this.mousePos.top
                });

            setTimeout(function() {
                that.$tip.trigger('mouseout');
            }, 200);
        });

        test('should place tooltip below mouse cursor', function () {
            this.$container
                .tooltip({ placement: 'follow', title: this.tipTitle })
                .trigger({
                    type: 'mouseenter',
                    clientX: this.mousePos.left,
                    clientY: this.mousePos.top
                });

            var $tooltip = $('.tooltip');
            var $arrow = $('.tooltip .arrow');
            var cursorOffset = this.$container.data('wdesk.tooltip').cursorOffset;

            ok(this.tipTriggerOffset.width > 0,
                'tooltip trigger elem width must be greater than zero for this test to be valid'
            );
            ok($tooltip.width() > 0 && $tooltip.width() < this.$container.width(),
                'tooltip width must be greater than zero and less than the width of the triggering elem for this test to be valid'
            );
            ok($tooltip.hasClass('bottom'),
                'tooltip should use bottom placement when following mouse cursor'
            );
            equal($tooltip.offset().top,  this.mousePos.top + cursorOffset,
                'tooltip top offset is incorrect'
            );
            equal($tooltip.offset().left, this.mousePos.left - ($tooltip.width() / 2),
                'tooltip left offset is incorrect'
            );
        });

        test('should ensure that tooltip follows position of mouse cursor when it changes', function () {
            var that = this;

            stop();

            expect(7); // 6 + setup test

            this.$container
                .on('shown.wdesk.tooltip', function (e) {
                    var $tooltip = $('.tooltip');
                    var $arrow = $('.tooltip .arrow');
                    var cursorOffset = $(this).data('wdesk.tooltip').cursorOffset;

                    ok(that.tipTriggerOffset.width > 0,
                        'tooltip trigger elem width must be greater than zero for this test to be valid'
                    );
                    ok($tooltip.width() > 0 && $tooltip.width() < that.$container.width(),
                        'tooltip width must be greater than zero and less than the width of the triggering elem for this test to be valid'
                    );

                    equal($tooltip.offset().top,  that.mousePos.top + cursorOffset,
                        'tooltip top offset is incorrect'
                    );
                    equal($tooltip.offset().left, that.mousePos.left - ($tooltip.width() / 2),
                        'tooltip left offset is incorrect'
                    );

                    // trigger a mouse move
                    var newMousePos = {
                        top: that.mousePos.top - 10,
                        left: that.mousePos.left - 3
                    };

                    that.$container
                        .on('mousemove', function (e) {
                            equal($tooltip.offset().top,  newMousePos.top + cursorOffset, // for some reason - this test needs $arrow.outerHeight() added twice.
                                'tooltip top offset is incorrect'
                            );
                            equal($tooltip.offset().left, newMousePos.left - ($tooltip.width() / 2),
                                'tooltip left offset is incorrect'
                            );

                            start();
                        })
                        .trigger({
                            type: 'mousemove',
                            pageX: newMousePos.left,
                            pageY: newMousePos.top
                        });
                })
                .tooltip({ placement: 'follow', title: this.tipTitle })
                .trigger({
                    type: 'mouseenter',
                    clientX: this.mousePos.left,
                    clientY: this.mousePos.top
                });
        });


    // VIEWPORT DETECTION
    // -------------------------
        module('tooltip-viewport-detect', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.containerId = 'dynamic-tt-test';
                this.$container =
                    $('<div id="' + this.containerId + '" />')
                        .css({
                            'height' : 400
                          , 'overflow' : 'hidden'
                          , 'position' : 'absolute'
                          , 'top' : 0
                          , 'left' : 0
                          , 'width' : $(document.body).width() + 200
                        })
                        .appendTo(document.body);

                this.tipTriggerWidth = 100;

                this.$tips = {
                    top:    $('<div style="display: inline-block; position: absolute; left: 0; top: 0; width: ' + this.tipTriggerWidth + 'px" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
                                .appendTo(this.$container)
                  , right:  $('<div style="display: inline-block; position: absolute; right: 0; width: ' + this.tipTriggerWidth + 'px" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
                                .appendTo(this.$container)
                  , bottom: $('<div style="display: inline-block; position: absolute; bottom: 0; width: ' + this.tipTriggerWidth + 'px" rel="tooltip" title="Bottom tooltip">Bottom Dynamic Tooltip</div>')
                                .appendTo(this.$container)
                  , left:   $('<div style="display: inline-block; position: absolute; left: 0; width: ' + this.tipTriggerWidth + 'px" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
                                .appendTo(this.$container)
                };

                this.arrowSize = 10; // default

                this.tipTemplate = '<div class="tooltip"><div class="arrow" style="position: absolute; height: ' + this.arrowSize + 'px; width: ' + this.arrowSize + 'px;"></div><div class="inner"></div></div>';

                $('head').append('<style id="test"> .tooltip .tooltip-inner { width: 200px; height: 200px; max-width: none; } </style>');
            },
            teardown: function () {
                // clean up after each test
                cleanupTooltipDom();

                this.containerId = null;
                this.$container.remove();
                this.$tips = null;
                this.arrowSize = null;
                this.tipTemplate = null;

                $('head #test').remove();
            }
        });

        test('tooltips should be placed dynamically, with the dynamic placement option', function() {
            this.$tips.top
                .tooltip({ placement: 'auto' })
                .tooltip('show');

            ok($('.tooltip').is('.bottom'), 'top positioned tooltip is dynamically positioned bottom');
            this.$tips.top.tooltip('hide');


            this.$tips.right
                .tooltip({ placement: 'right auto' })
                .tooltip('show');

            ok($('.tooltip').is('.left'), 'right positioned tooltip is dynamically positioned left');
            this.$tips.right.tooltip('hide');


            this.$tips.left
              .tooltip({ placement: 'auto left' })
              .tooltip('show');

            ok($('.tooltip').is('.right'), 'left positioned tooltip is dynamically positioned right');
            this.$tips.left.tooltip('hide');

            this.$container.remove();
        });

        test('should adjust the tip\'s top when up against the top of the viewport', function() {
            var container = $('<div />').appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; left: 0px;"></a>')
                .appendTo(container)
                .tooltip({ placement: 'right', viewport: { selector: 'body', padding: 12 }})
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            ok(Math.round(tooltip.offset().top) === 12);
            target.tooltip('hide');

            container.remove();
        });

        test('should adjust the tip\'s top when up against the bottom of the viewport', function() {
            var container = $('<div />').appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; bottom: 0px; left: 0px;"></a>')
                .appendTo(container)
                .tooltip({ placement: 'right', viewport: { selector: 'body', padding: 12 }})
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            ok(Math.round(tooltip.offset().top) === Math.round($(window).height() - 12 - tooltip[0].offsetHeight));
            target.tooltip('hide');

            container.remove();
        });

        test('should adjust the tip\'s left when up against the left of the viewport', function() {
            var container = $('<div />').appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; left: 0px;"></a>')
                .appendTo(container)
                .tooltip({ placement: 'bottom', viewport: { selector: 'body', padding: 12 }})
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            ok(Math.round(tooltip.offset().left) === 12);
            target.tooltip('hide');

            container.remove();
        });

        test('should adjust the tip\'s left when up against the right of the viewport', function() {
            var container = $('<div />').appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 0px; right: 0px;"></a>')
                .appendTo(container)
                .tooltip({ placement: 'bottom', viewport: { selector: 'body', padding: 12 }})
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            ok(Math.round(tooltip.offset().left) === Math.round($(window).width() - 12 - tooltip[0].offsetWidth));
            target.tooltip('hide');

            container.remove();
        });

        test('should adjust the tip when up against the right of an arbitrary viewport', function() {
            $('head').append('<style id="viewport-style"> .container-viewport { position: absolute; top: 50px; left: 60px; width: 300px; height: 300px; } </style>');

            var container = $('<div />', { 'class': 'container-viewport' }).appendTo('body');
            var target = $('<a href="#" rel="tooltip" title="tip" style="position: fixed; top: 50px; left: 350px;"></a>')
                .appendTo(container)
                .tooltip({ placement: 'bottom', viewport: '.container-viewport' })
                .tooltip('show');
            var tooltip = container.find('.tooltip');

            ok(Math.round(tooltip.offset().left) === Math.round(60 + container.width() - tooltip[0].offsetWidth));
            target.tooltip('hide');

            $('head #viewport-style').remove();
            container.remove();
        });

        test('should not error when trying to show an auto-placed tooltip that has been removed from the dom', function() {
            var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').appendTo('#qunit-fixture');

            tooltip
                .one('show.wdesk.tooltip', function() {
                    tooltip.remove();
                })
                .tooltip({ placement: 'auto' });

            var passed = true;
            try {
                tooltip.tooltip('show');
            } catch (err) {
                passed = false;
                console.log(err);
            }
            ok(passed, '.tooltip(\'show\') should not throw an error in this case');

            try {
                tooltip.remove();
            } catch (err) {
                // tooltip may have already been removed
            }
        });
});
