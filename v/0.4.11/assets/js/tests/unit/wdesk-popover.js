$(function () {

    /* global Popover */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------

        var mockDefaults = {
            template:           '<div class="popover" role="tooltip"><div class="arrow" aria-hidden="true"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>'
          , backdropTemplate:   '<div class="popover-backdrop backdrop" role="presentation"></div>'
        };

        var mockOpts = {
            basic: { container: '#qunit-fixture' }
        };

        var cleanupPopoverDom = function () {
            $('#qunit-fixture').empty();
            $('.popover').remove();
            $('.popover-backdrop').remove();
            $(window).off('resize.wdesk.popover');
            $(window).off('orientationchange.wdesk.popover');
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

        var getKeydownEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').keydown;

            return getNamespaceList(events);
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
        module('popover-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.$testDiv = $('<div />');
            },
            teardown: function() {
                // clean up after each test
                cleanupPopoverDom();

                this.$testDiv = null;
            }
        });

        test('should provide no conflict', function () {
            var popover = $.fn.popover.noConflict();
            ok(!$.fn.popover,
                'popover was not set back to undefined (org value)'
            );
            $.fn.popover = popover;
        });

        test('should be defined on jQuery object', function () {
            ok(this.$testDiv.popover,
                'popover method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.$testDiv.popover(), this.$testDiv,
                'element bound to popover method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok(!!$.fn.popover.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var tooltipDefaults = $.fn.tooltip.Constructor.DEFAULTS;
            var popoverDefaults = $.fn.popover.Constructor.DEFAULTS;
            var DEFAULTS = $.extend({}, tooltipDefaults, popoverDefaults);

            equal(DEFAULTS.html, true, 'Popover.DEFAULTS.html');
            equal(DEFAULTS.placement, 'bottom', 'Popover.DEFAULTS.placement');
            equal(DEFAULTS.content, '', 'Popover.DEFAULTS.content');
            equal(DEFAULTS.angularContent, tooltipDefaults.angularContent, 'Popover.DEFAULTS.angularContent');
            equal(DEFAULTS.container, false, 'Popover.DEFAULTS.container');
            equal(DEFAULTS.modal, true, 'Popover.DEFAULTS.modal');
            equal(DEFAULTS.template, mockDefaults.template, 'Popover.DEFAULTS.template');
            equal(DEFAULTS.backdrop, mockDefaults.backdropTemplate, 'Popover.DEFAULTS.backdrop');
        });

        test('should store popover instance in popover data object', function () {
            this.$testDiv.popover();

            ok(this.$testDiv.data('wdesk.popover'),
                'popover instance should exist within data object'
            );
        });


    // EVENTS
    // -------------------------
        module('popover-events', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.popTitle = 'Workiva';
                this.popContent = 'http://www.workiva.com';
                this.$popTrigger = $('<a href="#" title="' + this.popTitle + '" data-content="' + this.popContent + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupPopoverDom();

                this.popTitle = null;
                this.popContent = null;
                this.$popTrigger = null;
            }
        });

        test('should bind popover to default trigger elem events', function () {
            this.$popTrigger.popover('show');

            ok( $._data(this.$popTrigger[0], 'events').click,
                'popover should be bound to popover trigger event(s)'
            );
        });

        test('should bind popover to non-default trigger elem events', function () {
            this.$popTrigger
                .popover({ trigger: 'hover focus' })
                .popover('show');

            ok( $._data(this.$popTrigger[0], 'events').focusin &&
                $._data(this.$popTrigger[0], 'events').focusout &&
                $._data(this.$popTrigger[0], 'events').mouseover &&
                $._data(this.$popTrigger[0], 'events').mouseout &&
                !$._data(this.$popTrigger[0], 'events').click,
                'popover should be bound to popover trigger event(s)'
            );
        });

        test('should not fire shown event when show is prevented', function () {
            var that = this,
                showFired = 0,
                shownFired = 0;

            this.$popTrigger
                .on('show.wdesk.popover', function (e) {
                    e.preventDefault();
                    showFired++;
                })
                .on('shown.wdesk.popover', function (e) {
                    shownFired++;
                })
                .popover({ trigger: 'click' });

            this.$popTrigger.click();

            equal(showFired, 1, 'show.wdesk.popover should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.popover should have been prevented by default');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = 0,
                shownFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.$popTrigger
                .on('show.wdesk.popover', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.popover fired before shown.wdesk.popover did');
                })
                .on('shown.wdesk.popover', function () {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.popover fired after show.wdesk.popover did');

                    start();
                })
                .popover({ trigger: 'click' });

            this.$popTrigger.click();
        });

        test('should not fire hidden event when hide is prevented', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.$popTrigger
                .on('shown.wdesk.popover', function (e) {
                    that.$popTrigger.popover('hide');
                })
                .on('hide.wdesk.popover', function (e) {
                    e.preventDefault();
                    hideFired++;
                })
                .on('hidden.wdesk.popover', function (e) {
                    hiddenFired++;
                })
                .popover({ trigger: 'click' });

            this.$popTrigger.click();

            equal(hideFired, 1, 'hide.wdesk.popover should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.popover should have been prevented by default');
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.$popTrigger
                .on('shown.wdesk.popover', function (e) {
                    that.$popTrigger.popover('hide');
                })
                .on('hide.wdesk.popover', function (e) {
                    hideFired++;

                    equal(hiddenFired, 0, 'hide.wdesk.popover fired before hidden.wdesk.popover did');
                })
                .on('hidden.wdesk.popover', function () {
                    hiddenFired++;

                    equal(hideFired, 1, 'hidden.wdesk.popover fired after hide.wdesk.popover did');

                    start();
                })
                .popover({ trigger: 'click' });

            this.$popTrigger.click();
        });

        test('should register window `resize` and `orientationchange` event listeners when popover is shown', function () {
            stop();

            expect(3); // 1 + setup test

            this.$popTrigger
                .on('shown.wdesk.popover', function (e) {
                    // timeout used to mock debounce
                    setTimeout(function () {
                        ok(existsInArray('popover.wdesk', getResizeEventNamespaceList(window)),
                            'resize event listener should be registered on window object'
                        );
                        ok(existsInArray('popover.wdesk', getOrientationchangeEventNamespaceList(window)),
                            'orientationchange event listener should be registered on window object'
                        );

                        start();
                    }, 50);
                })
                .popover('show');
        });

        test('should de-register window `resize` and `orientationchange` event listeners when popover is shown', function () {
            var that = this;

            stop();

            expect(3); // 1 + setup test

            this.$popTrigger
                .on('shown.wdesk.popover', function (e) {
                    that.$popTrigger.popover('hide');
                })
                .on('hidden.wdesk.popover', function (e) {
                    ok(!existsInArray('popover.wdesk', getResizeEventNamespaceList(window)),
                        'resize event listener should no longer be registered on window object'
                    );
                    ok(!existsInArray('popover.wdesk', getOrientationchangeEventNamespaceList(window)),
                        'orientationchange event listener should no longer be registered on window object'
                    );

                    start();
                })
                .popover('show');
        });

        test('should register/de-register document keydown event listeners so that popovers are dismissed when `ESC` key is pressed', 3, function () {
            var that = this;

            stop();

            this.$popTrigger
                .on('shown.wdesk.popover', function(event) {
                    ok(existsInArray('data-api.popover.wdesk', getKeydownEventNamespaceList(document)),
                        'document should be bound to namespaced keydown event'
                    );

                    that.$popTrigger.popover('hide');
                })
                .on('hidden.wdesk.popover', function(event) {
                    ok(! existsInArray('data-api.popover.wdesk', getKeydownEventNamespaceList(document)),
                        'document should no longer be bound to namespaced keydown event'
                    );

                    start();
                })
                .popover('show');
        });


    // METHODS
    // -------------------------
        module('popover-methods', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.popTitle = 'Workiva';
                this.popContent = 'http://www.workiva.com';
                this.$popTrigger = $('<a href="#" title="' + this.popTitle + '" data-content="' + this.popContent + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupPopoverDom();

                this.popTitle = null;
                this.popContent = null;
                this.$popTrigger = null;
            }
        });

        test('should extend methods provided by tooltip plugin', function () {
            var popoverPrototypeObjects = $.fn.popover.Constructor.prototype;
            var tooltipPrototypeObjects = $.fn.tooltip.Constructor.prototype;

            var popoverMethods = [];
            $.each(popoverPrototypeObjects, function (key, element) {
                typeof this === 'function' && key !== 'constructor' && popoverMethods.push(key);
            });

            var tooltipMethods = [];
            $.each(tooltipPrototypeObjects, function (key, element) {
                typeof this === 'function' && key !== 'constructor' && tooltipMethods.push(key);
            });

            expect(tooltipMethods.length + 1); // add setup test to number of tests expected

            $.each(tooltipMethods, function (index, element) {
                var tooltipMethod = this.toString();

                ok(existsInArray(tooltipMethod, popoverMethods),
                    'tooltip prototype method `' + tooltipMethod + '` should be extended to popover prototype'
                );
            });
        });


    // DOM MANIPULATION
    // -------------------------
        module('popover-dom', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.popTitle = 'Workiva';
                this.popContent = 'http://www.workiva.com';
                this.$popTrigger = $('<a href="#" title="' + this.popTitle + '" data-content="' + this.popContent + '"></a>').appendTo('#qunit-fixture');
                this.popoverContentContainerId = 'popover-content-container';
                this.$popoverContentContainer = $('<div id="' + this.popoverContentContainerId + '">I am content already on this page</div>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupPopoverDom();

                this.popTitle = null;
                this.popContent = null;
                this.$popTrigger = null;
                this.$popoverContentContainer.remove();
            }
        });

        test('should re-focus the element that triggered it when the popover closes', 3, function () {
            var that = this;

            stop();

            this.$popTrigger
                .on('shown.wdesk.popover', function(event) {
                    ok(true);

                    that.$popTrigger.popover('hide');
                })
                .on('hidden.wdesk.popover', function(event) {
                    equal($(document.activeElement)[0], that.$popTrigger[0],
                        'triggering element should be focused again when the popover closes'
                    );

                    start();
                })
                .popover('show');
        });

        test('should hide popover title if it is :empty', function () {
            this.$popTrigger.removeAttr('title');
            this.$popTrigger.popover('show');

            equal($('.popover').length, 1,
                'a single popover should be present in DOM'
            );
            ok(!$('.popover .title').is(':visible'),
                'empty title elem within DOM should be hidden'
            );
        });

        test('should respect custom classes', function () {
            var customClass = 'foobar';
            var customTemplate = '<div class="popover ' + customClass +'"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>';
            this.$popTrigger
                .popover({
                    title: 'Test',
                    content: 'Test',
                    template: customTemplate
                })
                .popover('show');

            ok($('.popover').hasClass(customClass),
                'custom css class should be present'
            );
        });

        test('should get content from element on the page if data-content attr starts with #', function () {
            var popoverContentContainerHTML = this.$popoverContentContainer.html();

            this.$popTrigger.attr('data-content', '#' + this.popoverContentContainerId);
            this.$popTrigger.popover('show');

            equal($('.popover .content').length, 1,
                'a .content wrapping element should be injected'
            );
            equal($('.popover .content').html(), this.$popoverContentContainer.html(),
                'content from existing page elem should be injected into popover content elem'
            );
            equal(this.$popTrigger.data('stored-content'), $('.popover .content').text(),
                'content should be stored in popover trigger elem\'s data()'
            );
        });

        test('should remove temporary content element from page when data-content-container=temporary', function () {
            var popoverContentContainerHTML = this.$popoverContentContainer.html();

            this.$popTrigger
                .attr('data-content', '#' + this.popoverContentContainerId)
                .attr('data-content-container', 'temporary')
                .popover('show');

            equal(this.$popTrigger.data('stored-content'), $('.popover .content').text(),
                'content should be stored in popover trigger elem\'s data()'
            );
            equal($('#' + this.popoverContentContainerId).length, 0,
                'popover content container should no longer exist in DOM'
            );
        });

        test('should generate popover DOM when no container is specified', function () {
            this.$popTrigger
                .popover({ trigger: 'manual', modal: true })
                .popover('show');

            equal($('.popover').length, 1,
                'only one popover should be present in DOM'
            );
            equal($('.popover-backdrop').length, 1,
                'only one popover backdrop should be present in DOM'
            );
            equal(this.$popTrigger.find('+ .popover').length, 1,
                'popover DOM should be directly adjacent after triggering elem'
            );
            equal($(document.body).find('> .popover-backdrop').length, 1,
                'popover backdrop DOM should be an immediate child of document.body'
            );
        });

        test('should generate popover DOM when a container is specified', function () {
            this.$popTrigger
                .popover({ trigger: 'manual', modal: true, container: '#qunit-fixture' })
                .popover('show');

            equal($('.popover').length, 1,
                'only one popover should be present in DOM'
            );
            equal($('.popover-backdrop').length, 1,
                'only one popover backdrop should be present in DOM'
            );
            equal($('#qunit-fixture').find('> .popover').length, 1,
                'popover DOM should be within specified container'
            );
            equal($('#qunit-fixture').find('> .popover-backdrop').length, 1,
                'popover backdrop DOM should be within specified container'
            );
        });


    // OPTIONS
    // -------------------------
        module('popover-options', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.popTitle = 'Workiva';
                this.popContent = 'http://www.workiva.com';
                this.$popTrigger = $('<a href="#" title="' + this.popTitle + '" data-content="' + this.popContent + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupPopoverDom();

                this.popTitle = null;
                this.popContent = null;
                this.$popTrigger = null;
            }
        });

        test('should use popover data-content attr when no content option is set via js-api', function () {
            this.$popTrigger.popover('show');

            equal($('.popover .content').text(), this.popContent,
                'content of popover should match data attribute'
            );
        });

        test('should use popover data-content attr even if content option is set via js-api', function () {
            var jsOptContent = 'this content was set by the js-api';
            this.$popTrigger
                .popover({ content: jsOptContent })
                .popover('show');

            notEqual($('.popover .content').text(), jsOptContent,
                'content of popover should not match js-api content option'
            );
        });

        test('should use popover js-api content option when no data-content attribute is present', function () {
            var jsOptContent = 'this content was set by the js-api';
            this.$popTrigger.removeAttr('data-content');
            this.$popTrigger
                .popover({ content: jsOptContent })
                .popover('show');

            equal($('.popover .content').text(), jsOptContent,
                'content of popover should match js-api content option'
            );
        });


    // ANGULAR JS INTEGRATION
    // -------------------------
        module('popover-angularjs', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.popTitle = 'Workiva';
                this.popContent = 'http://www.workiva.com';
                this.popTriggerId = 'pop-trigger';
                this.$popTrigger = $('<a id="' + this.popTriggerId + '" href="#" title="' + this.popTitle + '" data-content="' + this.popContent + '"></a>').appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                cleanupPopoverDom();

                this.popTitle = null;
                this.popContent = null;
                this.popTriggerId = null;
                this.$popTrigger = null;
            }
        });

        test('should inject angular content within .inner instead of .content', function () {
            var angularTitle = 'Angular Title';
            var angularContent = 'Angular Content';

            this.$popTrigger
                .removeAttr('data-content')
                .popover({
                    angularContent: true,
                    content: '<h3 class="title">' + angularTitle + '</h3><div class="content">' + angularContent + '</div>'
                })
                .popover('show');

            var $popTitle = $('.popover .title');
            var $popContent = $('.popover .content');

            equal($popTitle.length, 1,
                'template title should be overwritten via injection of angular title within .inner'
            );
            equal($popContent.length, 1,
                'template content should be overwritten via injection of angular content within .inner'
            );
            equal($popTitle.text(), angularTitle,
                'title text should match title option'
            );
            equal($popContent.text(), angularContent,
                'content text should match content option'
            );
        });

        test('should destroy triggering element\'s wdesk data if trigger method is `manual` and `angularContent` is true', function () {
            var popoverContent1 = '<div id="popover-content-1">Foo</div>';
            var popoverContent2 = '<div id="popover-content-2">Bar</div>';

            this.$popTrigger
                .removeAttr('data-content')
                .popover({
                    trigger: 'manual',
                    angularContent: true,
                    content: popoverContent1
                })
                .popover('show');

            ok($('#' + this.popTriggerId).data('wdesk.popover'),
                'popover trigger elem should have wdesk.popover data'
            );
            equal($('.popover .inner').html(), popoverContent1,
                'popover should have the first set of content'
            );

            this.$popTrigger.popover('hide');

            equal($('#' + this.popTriggerId).length, 1,
                'popover trigger elem should still exist within the DOM'
            );
            ok(!$('#' + this.popTriggerId).data('wdesk.popover'),
                'popover trigger elem should no longer have wdesk.popover data'
            );

            this.$popTrigger
                .popover({
                    trigger: 'manual',
                    angularContent: true,
                    content: popoverContent2
                })
                .popover('show');

            equal($('#' + this.popTriggerId).length, 1,
                'popover trigger elem should still exist within the DOM'
            );
            ok($('#' + this.popTriggerId).data('wdesk.popover'),
                'popover trigger elem should have wdesk.popover data once again'
            );
            equal($('.popover .inner').html(), popoverContent2,
                'popover should have the second set of content'
            );
        });
});