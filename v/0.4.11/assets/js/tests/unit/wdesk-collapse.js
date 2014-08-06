$(function () {

    /* global Collapse */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------
        var collapseNavId = 'targetNav';
        var collapseNavDOM =
            '<ul role="tree" id="' + collapseNavId + '" data-collapse-container>' +
                '<li role="presentation">' +
                    '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test1_btn" class="collapsed" data-toggle="collapse" data-activate="true" href="#test1" aria-controls="test1">' +
                        '<span class="caret" data-activate="false"></span>' +
                    '</a>' +
                    '<ul role="group" aria-hidden="true" tabindex="-1" id="test1">' +
                        '<li role="presentation">' +
                            '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test1_1_btn" data-activate="true" data-toggle="collapse" data-target="#test1_1" aria-controls="test1_1">' +
                                '<span class="caret" data-activate="false"></span>' +
                            '</a>' +
                            '<ul role="group" aria-hidden="true" tabindex="-1" id="test1_1">' +
                                '<li role="presentation">' +
                                    '<a role="treeitem" aria-expanded="false" aria-selected="false" data-activate="true" data-toggle="collapse" data-target="#test1_1" aria-controls="test1_1"></a>' +
                                '</li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                '</li>' +
                '<li role="presentation">' +
                    '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test2_btn" class="collapsed" data-toggle="collapse" data-activate="true" data-test-nest-option="true" data-target="#test2" aria-controls="test2">' +
                        '<span class="caret" data-activate="false"></span>' +
                    '</a>' +
                    '<ul role="group" aria-hidden="true" tabindex="-1" id="test2">' +
                        '<li role="presentation">' +
                            '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test2_1_btn" data-activate="true" data-toggle="collapse" data-target="#test2_1" aria-controls="test2_1">' +
                                '<span class="caret" data-activate="false"></span>' +
                            '</a>' +
                            '<ul role="group" aria-hidden="true" tabindex="-1" id="test2_1">' +
                                '<li role="presentation">' +
                                    '<a role="treeitem" aria-expanded="false" aria-selected="false" data-activate="true" data-toggle="collapse" data-target="#test2_1" aria-controls="test2_1"></a>' +
                                '</li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                '</li>' +
                '<li role="presentation">' +
                    '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test3_btn" class="collapsed" data-toggle="collapse" data-activate="true" data-test-nest-option="true" aria-controls="test3">' +
                        '<span class="caret" data-activate="false"></span>' +
                    '</a>' +
                    '<ul role="group" aria-hidden="true" tabindex="-1" id="test3">' +
                        '<li role="presentation">' +
                            '<a role="treeitem" aria-expanded="false" aria-selected="false" id="test3_1_btn" data-activate="true" data-toggle="collapse" data-target="#test3_1" aria-controls="test3_1">' +
                                '<span class="caret" data-activate="false"></span>' +
                            '</a>' +
                            '<ul role="group" aria-hidden="true" tabindex="-1" id="test3_1">' +
                                '<li role="presentation">' +
                                    '<a role="treeitem" aria-expanded="false" aria-selected="false" data-activate="true" data-toggle="collapse" data-target="#test3_1" aria-controls="test3_1"></a>' +
                                '</li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                '</li>' +
            '</ul>';

        var nestingDOM =
            '<li role="presentation">' +
                '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_1" class="collapsed" data-target="#1" aria-controls="1" data-activate="true" data-toggle="collapse">' +
                   '<span class="caret hide show" data-activate="false"></span>' +
                '</div>' +
                '<ul role="group" aria-hidden="true" tabindex="-1" id="1" class="collapse" aria-labelledby="btn_1">' +
                    '<li role="presentation">' +
                        '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_2" class="collapsed" data-target="#2" aria-controls="2" data-activate="true" data-toggle="collapse">' +
                           '<span class="caret hide show" data-activate="false"></span>' +
                        '</div>' +
                        '<ul role="group" aria-hidden="true" tabindex="-1" id="2" class="collapse" aria-labelledby="btn_2">' +
                            '<li role="presentation">' +
                                '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_3" class="collapsed" data-target="#3" aria-controls="3" data-activate="true" data-toggle="collapse">' +
                                   '<span class="caret hide show" data-activate="false"></span>' +
                                '</div>' +
                                '<ul role="group" aria-hidden="true" tabindex="-1" id="3" class="collapse" aria-labelledby="btn_3">' +
                                    '<li role="presentation">' +
                                        '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_4" class="collapsed" data-target="#4" aria-controls="4" data-activate="true" data-toggle="collapse">' +
                                           '<span class="caret hide show" data-activate="false"></span>' +
                                        '</div>' +
                                        '<ul role="group" aria-hidden="true" tabindex="-1" id="4" class="collapse" aria-labelledby="btn_4">' +
                                            '<li role="presentation">' +
                                                '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_5" class="collapsed" data-target="#5" aria-controls="5" data-activate="true" data-toggle="collapse">' +
                                                   '<span class="caret hide show" data-activate="false"></span>' +
                                                '</div>' +
                                                '<ul id="5" class="collapse" aria-labelledby="btn_5">' +
                                                    'LEAF' +
                                                '</ul>' +
                                            '</li>' +
                                            '<li role="presentation">' +
                                                '<div role="treeitem" aria-expanded="false" aria-selected="false" id="btn_sibling" class="collapsed" data-target="#sibling" aria-controls="sibling" data-activate="true" data-toggle="collapse">' +
                                                   '<span class="caret hide show" data-activate="false"></span>' +
                                                '</div>' +
                                                '<ul id="sibling" class="collapse" aria-labelledby="btn_sibling">' +
                                                    'LEAF' +
                                                '</ul>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</li>' +
                                '</ul>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</li>';

        var buildPanelDOM = function (parent) {
            var panelIdPrefix = parent ? 'parent_panel' : 'panel';
            var dataParent = parent ? 'data-parent="' + parent + '">' : '>';

            return '<div role="tablist" id="' + panelIdPrefix + '-accordion"><div role="presentation" class="panel-group">' +
                    '<div role="presentation" class="panel panel-default">' +
                        '<div role="tab" class="panel-heading collapsed" data-toggle="collapse" aria-selected="false" aria-expanded="false" tabindex="-1" aria-controls="' + panelIdPrefix + '1" data-target="#' + panelIdPrefix + '1"' + dataParent + '</div>' +
                        '<div role="tabpanel" tabindex="-1" aria-hidden="true" id="' + panelIdPrefix + '1" class="panel-collapse collapse">foobar</div>' +
                    '</div>' +
                    '<div role="presentation" class="panel panel-default">' +
                        '<div role="tab" class="panel-heading collapsed" data-toggle="collapse" aria-selected="false" aria-expanded="false" tabindex="-1" aria-controls="' + panelIdPrefix + '2" data-target="#' + panelIdPrefix + '2"' + dataParent + '</div>' +
                        '<div role="tabpanel" tabindex="-1" aria-hidden="true" id="' + panelIdPrefix + '2" class="panel-collapse collapse">foobar</div>' +
                    '</div>' +
                    '<div role="presentation" class="panel panel-default">' +
                        '<div role="tab" class="panel-heading collapsed" data-toggle="collapse" aria-selected="false" aria-expanded="false" tabindex="-1" aria-controls="' + panelIdPrefix + '3" data-target="#' + panelIdPrefix + '3"' + dataParent + '</div>' +
                        '<div role="tabpanel" tabindex="-1" aria-hidden="true" id="' + panelIdPrefix + '3" class="panel-collapse collapse">foobar</div>' +
                    '</div>' +
                '</div></div>';
        };

        var addParentRefsToNav = function () {
            var $nav = $('#' + collapseNavId);
            var $collapseBtns = $nav.find('[data-toggle="collapse"]');
            $.each($collapseBtns, function () {
                $(this).attr('data-parent', '#' + collapseNavId);
            });
        };

        //
        // REUSABLE/COMMON COLLAPSE ASSERTIONS
        //
            var activeClass = 'active';
            var activeParentClass = 'active-parent';
            var assertTriggerIsCollapsed = function(trigger) {
                ok(!trigger.hasClass('open'),
                    '.open css class should not be present on the trigger element'
                );
                ok(trigger.hasClass('collapsed'),
                    '.collapsed css class should have been added to the trigger element'
                );
                equal(trigger.attr('aria-expanded'), 'false',
                    'aria-expanded should equal false on the trigger element for WCAG compliance'
                );
            };
            var assertTriggerIsExpanded = function(trigger) {
                ok(trigger.hasClass('open'),
                    '.open css class should be present on the trigger element'
                );
                ok(!trigger.hasClass('collapsed'),
                    '.collapsed css class should have been removed from the trigger element'
                );
                equal(trigger.attr('aria-expanded'), 'true',
                    'aria-expanded should equal true on the trigger element for WCAG compliance'
                );
            };
            var assertTriggerParentIsDeactivated = function(triggerParent) {
                var trigger = triggerParent.find('> [data-toggle=collapse]');

                ok(!triggerParent.hasClass(activeClass),
                    '.' + activeClass + ' css class should have been removed from the parent <li>'
                );
                equal(trigger.attr('aria-selected'), 'false',
                    'aria-selected should equal false on the trigger element for WCAG compliance'
                );
            };
            var assertTriggerParentIsActivated = function(triggerParent) {
                var trigger = triggerParent.find('> [data-toggle=collapse]');

                ok(triggerParent.hasClass(activeClass),
                    '.' + activeClass + ' css class should have been added to the parent <li>'
                );
                equal(trigger.attr('aria-selected'), 'true',
                    'aria-selected should equal true on the trigger element for WCAG compliance'
                );
            };
            var assertElemIsCollapsing = function(elem, trigger) {
                ok(elem.hasClass('collapsing'),
                    '.collapsing css class should have been added'
                );
                ok(!elem.hasClass('collapse'),
                    '.collapse css class should have been removed'
                );
                ok(!elem.hasClass('in'),
                    '.in css class should have been added'
                );

                if (trigger) {
                   assertTriggerIsCollapsed(trigger);
                }
            };
            var assertElemIsCollapsed = function(elem, init) {
                var isInitialized = typeof init != 'undefined' ? init : true;

                ok(!elem.hasClass('in'),
                    '.in css class should have been removed'
                );
                ok(elem.hasClass('collapse'),
                    '.collapse css class should still be present'
                );
                equal(elem.attr('aria-hidden'), 'true',
                    'aria-hidden should equal true for WCAG compliance'
                );
                equal(elem.attr('tabindex'), '-1',
                    'tabindex should equal -1 for WCAG compliance'
                );
                if (isInitialized) {
                    ok(/height: 0px/.test(elem.attr('style')),
                        'collapsible element should have inline css height of zero, but instead has ' + elem.attr('style') + ' '
                    );
                }
            };
            var assertElemIsExpanding = function(elem, trigger) {
                ok(elem.hasClass('collapsing'),
                    '.collapsing css class should have been added'
                );
                ok(!elem.hasClass('collapse'),
                    '.collapse css class should have been removed'
                );
                ok(!elem.hasClass('in'),
                    '.in css class should not have been added yet'
                );

                if (trigger) {
                   assertTriggerIsExpanded(trigger);
                }
            };
            var assertElemIsExpanded = function(elem, init) {
                var isInitialized = typeof init != 'undefined' ? init : true;

                ok(elem.hasClass('in'),
                    '.in css class should have been added'
                );
                ok(elem.hasClass('collapse'),
                    '.collapse css class should still be present'
                );
                ok(!elem.hasClass('collapsing'),
                    '.collapsing css class should have been removed'
                );
                equal(elem.attr('aria-hidden'), 'false',
                    'aria-hidden should equal false for WCAG compliance'
                );
                equal(elem.attr('tabindex'), '0',
                    'tabindex should equal 0 for WCAG compliance'
                );
                if (isInitialized) {
                    ok(/height/.test(elem.attr('style')),
                        'collapsible element should have inline css height set'
                    );
                }
            };


    // BASE
    // -------------------------
        module('collapse-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.collapseElem = $('<div class="collapse"></div>');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.collapseElem = null;
            }
        });

        test('should provide no conflict', function () {
            var collapse = $.fn.collapse.noConflict();
            ok(!$.fn.collapse,
                'collapse was not set back to undefined (org value)'
            );
            $.fn.collapse = collapse;
        });

        test('should be defined on jQuery object', function () {
            ok(this.collapseElem.collapse,
                'collapse method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.collapseElem.collapse()[0], this.collapseElem[0],
                'element bound to collapse method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.collapse.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.collapse.Constructor.DEFAULTS;

            equal(DEFAULTS.toggle,          true,       'Collapse.DEFAULTS.toggle');
            equal(DEFAULTS.speed,           350,        'Collapse.DEFAULTS.speed');
            equal(DEFAULTS.parent,          false,      'Collapse.DEFAULTS.parent');
            equal(DEFAULTS.triggerElem,     null,       'Collapse.DEFAULTS.triggerElem');
            equal(DEFAULTS.activate,        false,      'Collapse.DEFAULTS.activate');
            equal(DEFAULTS.activateElem,    false,      'Collapse.DEFAULTS.activateElem');
            equal(DEFAULTS.activeClass,     'active',   'Collapse.DEFAULTS.activeClass');
        });


    // EVENTS
    // -------------------------
        module('collapse-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.collapseElem = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="test-collapse"></div>');
                this.triggerButton = $('<a aria-expanded="false" aria-selected="false" data-toggle="collapse" data-target="#test-collapse" aria-controls="test-collapse">toggle</a>');

                this.triggerButton.appendTo('#qunit-fixture');
                this.collapseElem.appendTo('#qunit-fixture');

                // collapsing nav
                this.nav = $(collapseNavDOM).appendTo('#qunit-fixture');
                this.navBtnActiveInit = $('#test1_btn');
                this.navBtnActiveNew = $('#test2_btn');
                this.navBtnChildActiveNew = $('#test1_1_btn');
                this.navMenuActiveInit = $('#test1');
                this.navMenuActiveNew = $('#test2');
                this.navMenuChildActiveNew = $('#test1_1');

                this.activeClass = 'active';
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.collapseElem = null;
                this.triggerButton = null;
                this.nav = null;
            }
        });

        test('`relatedTarget` should be available on the show/shown and hide/hidden event objects', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.collapseElem
                .on('hide.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.triggerButton[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );
                })
                .on('hidden.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.triggerButton[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );

                    start();
                })
                .on('show.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.triggerButton[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );
                })
                .on('shown.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.triggerButton[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );

                    that.triggerButton.click();
                });

            this.triggerButton.click();
        });

        test('`relatedTarget` and `activeElem` should be available on the activate/deactivate event objects', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.navMenuActiveInit
                .on('shown.wdesk.collapse', function (e) {
                    setTimeout(function() {
                        that.navBtnActiveNew.click();
                    }, 100);
                });

            this.navMenuActiveNew
                .on('deactivate.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.navBtnActiveNew[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );
                    deepEqual(e.activeElem,
                        that.navBtnActiveNew.parent('li')[0],
                        '`e.activeElem` should equal elem that .active class was just removed from'
                    );
                })
                .on('activate.wdesk.collapse', function (e) {
                    deepEqual(e.relatedTarget, that.navBtnActiveNew[0],
                        '`e.relatedTarget` should equal button that controls the collapse elem'
                    );
                    deepEqual(e.activeElem,
                        that.navBtnActiveNew.parent('li')[0],
                        '`e.activeElem` should equal elem that .active class was just removed from'
                    );
                })
                .on('shown.wdesk.collapse', function (e) {
                    setTimeout(function() {
                        that.navBtnActiveInit.click();
                    }, 100);
                });

            // the second time that.navBtnActiveInit is clicked... start the test
            var initBtnClicked = 0;
            this.navBtnActiveInit.on('click', function () {
                if(initBtnClicked > 0) {
                    setTimeout(function() {
                        start();
                    }, 100);
                }

                initBtnClicked++;
            });

            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should not fire shown when show is prevented', function () {
            var showFired = 0,
                shownFired = 0;

            this.collapseElem
                .on('show.wdesk.collapse', function (e) {
                    e.preventDefault();
                    showFired++;
                })
                .on('shown.wdesk.collapse', function () {
                    shownFired++;
                })
                .collapse('show');

            equal(showFired, 1, 'show.wdesk.collapse should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.collapse should have been prevented by default');
        });

        test('should not fire hidden when hide is prevented', function () {
            var hideFired = 0,
                hiddenFired = 0;

            this.collapseElem
                .on('shown.wdesk.collapse', function () {
                    $(this).collapse('hide');
                })
                .on('hide.wdesk.collapse', function (e) {
                    e.preventDefault();
                    hideFired++;
                })
                .on('hidden.wdesk.collapse', function () {
                    hiddenFired++;
                })
                .collapse('show');

            equal(hideFired, 1, 'hide.wdesk.collapse should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.collapse should have been prevented by default');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = 0,
                shownFired = 0;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.collapseElem
                .on('show.wdesk.collapse', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.collapse fired before shown.wdesk.collapse did');
                })
                .on('shown.wdesk.collapse', function () {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.collapse fired after show.wdesk.collapse did');

                    start();
                })
                .collapse('show');
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var hideFired = 0,
                hiddenFired = 0;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.collapseElem
                .on('shown.wdesk.collapse', function (e) {
                    $(this).collapse('hide');
                })
                .on('hide.wdesk.collapse', function (e) {
                    hideFired++;

                    equal(hiddenFired, 0, 'hide.wdesk.collapse fired before hidden.wdesk.collapse did');
                })
                .on('hidden.wdesk.collapse', function () {
                    hiddenFired++;

                    equal(hideFired, 1, 'hidden.wdesk.collapse fired after hide.wdesk.collapse did');

                    start();
                })
                .collapse('show');
        });

        test('should wait until CSS transition completes before firing past-participle events', function () {
            /* MOCK TRANSITIONS */
            $.support.transition = { end: 'webkitTransitionEnd' };
            var mockTransDuration = $.fn.collapse.Constructor.DEFAULTS.speed;
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

            this.collapseElem
                .on('show.wdesk.collapse', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.collapse', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.collapse', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.collapse', function (e) {
                    hiddenFired++;

                    start();
                })
                .collapse('show');

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

                    that.collapseElem.collapse('hide');

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


    // METHODS
    // -------------------------
        module('collapse-methods', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.collapseElem = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="test-collapse"></div>');
                this.triggerButton = $('<a class="collapsed" aria-expanded="false" aria-selected="false" data-toggle="collapse" data-target="#test-collapse" aria-controls="test-collapse">toggle</a>');

                // collapsing nav
                this.nav = $(collapseNavDOM).appendTo('#qunit-fixture');
                this.navBtnActiveInit = $('#test1_btn');
                this.navBtnActiveNew = $('#test2_btn');
                this.navBtnChildActiveNew = $('#test1_1_btn');
                this.navMenuActiveInit = $('#test1');
                this.navMenuActiveNew = $('#test2');
                this.navMenuChildActiveNew = $('#test1_1');

                this.activeClass = 'active';
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.collapseElem = null;
                this.triggerButton = null;
                this.nav = null;
            }
        });

        test('should show/hide a collapsible element via plugin methods', function () {
            this.collapseElem.collapse('show');

            assertElemIsExpanded(this.collapseElem);

            this.collapseElem.collapse('hide');

            assertElemIsCollapsed(this.collapseElem);
        });

        test('should initialize and toggle a collapsible element via plugin method', function () {
            this.collapseElem.collapse('toggle');

            assertElemIsExpanded(this.collapseElem);

            this.collapseElem.collapse('toggle');

            assertElemIsCollapsed(this.collapseElem);
        });

        test('should toggle an element via plugin method that was instantiated via data-api', function () {
            this.triggerButton.appendTo('#qunit-fixture');
            this.collapseElem.appendTo('#qunit-fixture');

            assertElemIsCollapsed(this.collapseElem, false);
            assertTriggerIsCollapsed(this.triggerButton, false);

            this.triggerButton.click(); // instantiate via data-api
            assertElemIsExpanded(this.collapseElem);
            assertTriggerIsExpanded(this.triggerButton);

            this.collapseElem.collapse('toggle', this.triggerButton); // control via JS methods
            assertElemIsCollapsed(this.collapseElem);
            assertTriggerIsCollapsed(this.triggerButton);
        });

        test('should activate/deactivate a collapsible nav element via plugin methods', function () {
            var $initialActiveLi = this.navMenuActiveInit.parent('li');
            var $newActiveLi = this.navMenuActiveNew.parent('li');

            this.navMenuActiveInit.collapse('activate', this.navBtnActiveInit);
            assertTriggerParentIsActivated($initialActiveLi);

            this.navMenuActiveNew.collapse('activate', this.navBtnActiveNew);
            assertTriggerParentIsActivated($newActiveLi);
            assertTriggerParentIsDeactivated($initialActiveLi);
        });

        test('relatedTarget can be specified via JS show() method', function () {
            var that = this,
                showFired = 0;

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.collapseElem
                .on('show.wdesk.collapse', function (e) {
                    showFired++;

                    equal($(e.relatedTarget)[0], that.triggerButton[0],
                        'object that triggered collapse matches object in event'
                    );
                })
                .collapse('show', this.triggerButton);

            equal(showFired, 1, 'show.wdesk.collapse should be emitted once');
        });

        test('relatedTarget can be specified via JS hide() method', function () {
            var that = this,
                hideFired = 0;

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.collapseElem
                .on('shown.wdesk.collapse', function () {
                    $(this).collapse('hide', that.triggerButton);
                })
                .on('hide.wdesk.collapse', function (e) {
                    hideFired++;

                    equal($(e.relatedTarget)[0], that.triggerButton[0],
                        'object that triggered collapse matches object in event'
                    );
                })
                .collapse('show');

            equal(hideFired, 1, 'hide.wdesk.collapse should be emitted once');
        });

        // TODO: add more method testing for things like activate/deactivate - and other NAV specific methods


    // DATA-API
    // -------------------------
        module('collapse-data-api', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.collapseElem = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="test-collapse"></div>');
                this.triggerButton = $('<a aria-expanded="false" aria-selected="false" data-toggle="collapse" data-target="#test-collapse" aria-controls="test-collapse">toggle</a>');
                this.triggerButtonAriaControls = $('<a aria-expanded="false" aria-selected="false" data-toggle="collapse" aria-controls="test-collapse">toggle</a>');
                this.triggerButtonHref = $('<a aria-expanded="false" aria-selected="false" data-toggle="collapse" href="#test-collapse" aria-controls="test-collapse">toggle</a>');

                this.collapseElemAriaOnly = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="aria-collapse"></div>');
                this.collapseElemHrefOnly = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="href-collapse"></div>');
                this.triggerButtonHrefAndAria = $('<a id="test-collapse_btn" aria-expanded="false" aria-selected="false" data-toggle="collapse" href="#href-collapse" aria-controls="aria-collapse">toggle</a>');

                this.nav = $(collapseNavDOM).appendTo('#qunit-fixture');
                this.navBtnActiveNew = $('#test2_btn');
                this.navMenuActiveNew = $('#test2');

                this.triggerButton.appendTo('#qunit-fixture');
                this.triggerButtonHref.appendTo('#qunit-fixture');
                this.triggerButtonAriaControls.appendTo('#qunit-fixture');
                this.triggerButtonHrefAndAria.appendTo('#qunit-fixture');
                this.collapseElem.appendTo('#qunit-fixture');
                this.collapseElemAriaOnly.appendTo('#qunit-fixture');
                this.collapseElemHrefOnly.appendTo('#qunit-fixture');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.collapseElem = null;
                this.collapseElemAriaOnly = null;
                this.collapseElemHrefOnly = null;
                this.triggerButton = null;
                this.triggerButtonHref = null;
                this.triggerButtonAriaControls = null;
                this.triggerButtonHrefAndAria = null;
                this.navBtnActiveNew = null;
                this.navMenuActiveNew = null;
            }
        });

        test('should initialize the collapse instance with options from the [data-toggle=collapse] element, not from any nested element', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.navMenuActiveNew
                .on('shown.wdesk.collapse', function (e) {
                    var collapse = $.data(e.target, 'wdesk.collapse');
                    ok(collapse.options.testNestOption,
                        'data attribute options were not transferred from the [data-toggle=collapse] element'
                    );
                    start();
                });

            // instantiate the collapse instance via the data-api with a nested element
            this.navBtnActiveNew.find(' > [data-activate=false]').click();
        });

        test('should expand/collapse the target element via data-target attribute', function () {
            var that = this;

            stop();

            expect(19);

            this.collapseElem
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.triggerButton.attr('href'),
                        'no href attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.collapseElem);
                    assertTriggerIsExpanded(that.triggerButton);

                    that.triggerButton.click();
                })
                .on('hidden.wdesk.collapse', function (e) {
                    assertElemIsCollapsed(that.collapseElem);
                    assertTriggerIsCollapsed(that.triggerButton);

                    start();
                });

            // activate the menu via data-target attribute
            this.triggerButton.click();
        });

        test('should expand/collapse the target element via href attribute', function () {
            var that = this;

            stop();

            expect(19);

            this.collapseElem
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.triggerButtonHref.data('target'),
                        'no data-target attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.collapseElem);
                    assertTriggerIsExpanded(that.triggerButtonHref);

                    that.triggerButtonHref.click();
                })
                .on('hidden.wdesk.collapse', function (e) {
                    assertElemIsCollapsed(that.collapseElem);
                    assertTriggerIsCollapsed(that.triggerButtonHref);

                    start();
                });

            // activate the menu via href attribute
            this.triggerButtonHref.click();
        });

        test('should expand/collapse the target element via aria-controls attribute', function () {
            var that = this;

            stop();

            expect(19);

            this.collapseElem
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.triggerButtonAriaControls.data('target'),
                        'no data-target attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.collapseElem);
                    assertTriggerIsExpanded(that.triggerButtonAriaControls);

                    that.triggerButtonAriaControls.click();
                })
                .on('hidden.wdesk.collapse', function (e) {
                    assertElemIsCollapsed(that.collapseElem);
                    assertTriggerIsCollapsed(that.triggerButtonAriaControls);

                    start();
                });

            // activate the menu via data-target attribute
            this.triggerButtonAriaControls.click();
        });

        test('should expand/collapse the target element via href attribute if it exists in-addition to aria-controls attribute', function () {
            var that = this,
                ariaElemExpanded = 0,
                ariaElemCollapsed = 0,
                hrefElemExpanded = 0,
                hrefElemCollapsed = 0;

            this.collapseElemAriaOnly
                .on('shown.wdesk.collapse', function (e) {
                    ariaElemExpanded++;
                })
                .on('hidden.wdesk.collapse', function (e) {
                    ariaElemCollapsed++;
                });

            this.collapseElemHrefOnly
                .on('shown.wdesk.collapse', function (e) {
                    hrefElemExpanded++;
                })
                .on('hidden.wdesk.collapse', function (e) {
                    hrefElemCollapsed++;
                });

            this.triggerButtonHrefAndAria.click();

            equal(ariaElemExpanded, 0, 'href should have taken precedence over aria-controls');
            equal(hrefElemExpanded, 1, 'href should have taken precedence over aria-controls');

            this.triggerButtonHrefAndAria.click();

            equal(ariaElemCollapsed, 0, 'href should have taken precedence over aria-controls');
            equal(hrefElemCollapsed, 1, 'href should have taken precedence over aria-controls');
        });


    // KEYBOARD NAVIGATION
    // -------------------------
        module('collapse-keyboard-nav', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                // true accordion (only one panel visible at a time)
                this.panelAcc = $(buildPanelDOM('#parent_panel-accordion')).appendTo('#qunit-fixture');
                this.panelAccHd1 = this.panelAcc.find('[data-toggle=collapse]').eq(0);
                this.panelAccHd2 = this.panelAcc.find('[data-toggle=collapse]').eq(1);
                this.panelAccHd3 = this.panelAcc.find('[data-toggle=collapse]').eq(2);
                this.panelAccCollapse1 = $(this.panelAccHd1.attr('data-target'));
                this.panelAccCollapse2 = $(this.panelAccHd2.attr('data-target'));
                this.panelAccCollapse3 = $(this.panelAccHd3.attr('data-target'));

                // collapsing panels (more than one panel visible at a time)
                this.panel = $(buildPanelDOM(false)).appendTo('#qunit-fixture');
                this.panelHd1 = this.panel.find('[data-toggle=collapse]').eq(0);
                this.panelHd2 = this.panel.find('[data-toggle=collapse]').eq(1);
                this.panelHd3 = this.panel.find('[data-toggle=collapse]').eq(2);
                this.panelCollapse1 = $(this.panelHd1.attr('data-target'));
                this.panelCollapse2 = $(this.panelHd2.attr('data-target'));
                this.panelCollapse3 = $(this.panelHd3.attr('data-target'));
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.panelAcc = null;
                this.panelAccHd1 = null;
                this.panelAccHd2 = null;
                this.panelAccHd3 = null;
                this.panelAccCollapse1 = null;
                this.panelAccCollapse2 = null;
                this.panelAccCollapse3 = null;

                this.panel = null;
                this.panelHd1 = null;
                this.panelHd2 = null;
                this.panelHd3 = null;
                this.panelCollapse1 = null;
                this.panelCollapse2 = null;
                this.panelCollapse3 = null;
            }
        });

        test('Should navigate collapsible items via the up/down/left/right keys for WCAG compliance', function() {
            var that = this;
            var collapseTriggers = $('[data-toggle=collapse]');
            var i = 0;

            stop();

            this.panelAccCollapse1
                .one('shown.wdesk.collapse', function (e) {
                    // prerequisite test - rest of tests are invalid if this is not a true assertion
                    equal(collapseTriggers[0], $(document.activeElement)[0],
                        'First collapse trigger should start out focused'
                    );

                    $(collapseTriggers[0]).trigger({
                        type: 'keydown',
                        keyCode: 40 // down
                    });

                    equal(collapseTriggers[1], $(document.activeElement)[0],
                        'Second collapse trigger should be focused now'
                    );

                    $(collapseTriggers[1]).trigger({
                        type: 'keydown',
                        keyCode: 39 // right
                    });

                    equal(collapseTriggers[2], $(document.activeElement)[0],
                        'Last collapse trigger should be focused now'
                    );

                    $(collapseTriggers[2]).trigger({
                        type: 'keydown',
                        keyCode: 40 // down
                    });

                    // should "wrap" at the end of a list of collapsible elements
                    equal(collapseTriggers[0], $(document.activeElement)[0],
                        'First collapse trigger should be focused now'
                    );

                    $(collapseTriggers[0]).trigger({
                        type: 'keydown',
                        keyCode: 38 // up
                    });

                    // should "wrap" at the beginning of a list of collapsible elements
                    equal(collapseTriggers[2], $(document.activeElement)[0],
                        'Last collapse trigger should be focused now'
                    );

                    $(collapseTriggers[2]).trigger({
                        type: 'keydown',
                        keyCode: 37 // left
                    });

                    equal(collapseTriggers[1], $(document.activeElement)[0],
                        'Second collapse trigger should be focused now'
                    );

                    start();
                });

            this.panelAccHd1.click(); // expand
        });

        test('Should expand/collapse elems via keyboard spacebar for WCAG compliance', function() {
            var that = this;
            var i = 0;

            stop();

            this.panelAccCollapse1
                .on('shown.wdesk.collapse', function (e) {
                    // prerequisite test - rest of tests are invalid if this is not a true assertion
                    equal(that.panelAccHd1[0], $(document.activeElement)[0],
                        'First collapse trigger should start out focused'
                    );
                    ok(that.panelAccCollapse1.hasClass('in'),
                        'First collapse element should be expanded'
                    );

                    that.panelAccHd1.trigger({
                        type: 'keydown',
                        keyCode: 32 // spacebar
                    });

                    assertElemIsCollapsed(that.panelAccCollapse1, false);

                    that.panelAccHd2.focus().trigger({
                        type: 'keydown',
                        keyCode: 32 // spacebar
                    });

                    assertElemIsExpanded(that.panelAccCollapse2, false);

                    that.panelAccHd2.focus().trigger({
                        type: 'keydown',
                        keyCode: 32 // spacebar
                    });

                    assertElemIsCollapsed(that.panelAccCollapse2, false);

                    start();
                });

            this.panelAccHd1.click(); // expand
        });


    // DOM - BASIC
    // -------------------------
        module('collapse-dom', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                this.collapseElem = $('<div tabindex="-1" aria-hidden="true" class="collapse" id="test-collapse"></div>');
                this.triggerButton = $('<a aria-expanded="false" aria-selected="false" data-toggle="collapse" data-target="#test-collapse" aria-controls="test-collapse">toggle</a>');

                this.triggerButton.appendTo('#qunit-fixture');
                this.collapseElem.appendTo('#qunit-fixture');

                // Override getTransDuration to use 0, which will cause the 'shown' event to fire after a
                // 0ms setTimeout, which doesn't get kicked off until after the 'show' event propagates.
                // So, we can set a 0ms setTimeout here, which will get executed before the complete method
                // that propagates the 'shown' event.
                // </hax>
                this.mockGetTransDuration = function() {return this.transDuration = 0;};
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.collapseElem = null;
                this.triggerButton = null;
            }
        });

        test('should toggle css classes when collapse shown', function () {
            var that = this;

            // Enable transitions so we can use the overridden behavior of Collapse.getTransDuration
            $.support.transition = { end: 'webkitTransitionEnd' };

            stop();

            expect(13);

            this.collapseElem
                .on('show.wdesk.collapse', function (e) {
                    var collapse = $.data(e.target, 'wdesk.collapse');
                    collapse.getTransDuration = that.mockGetTransDuration;

                    setTimeout(function() {
                        assertElemIsExpanding(that.collapseElem, that.triggerButton);
                    }, 10);
                })
                .on('shown.wdesk.collapse', function (e) {
                    assertElemIsExpanded(that.collapseElem);

                    start();
                });

            this.triggerButton.click();
        });

        test('should toggle css classes when collapse hidden', function () {
            var that = this;

            // Enable transitions so we can use the overridden behavior of Collapse.getTransDuration
            $.support.transition = { end: 'webkitTransitionEnd' };

            stop();

            expect(15);

            this.collapseElem
                .on('shown.wdesk.collapse', function () {
                    that.triggerButton.click();
                })
                .on('hide.wdesk.collapse', function (e) {
                    var collapse = $.data(e.target, 'wdesk.collapse');
                    collapse.getTransDuration = that.mockGetTransDuration;

                    setTimeout(function() {
                        assertElemIsCollapsing(that.collapseElem, that.triggerButton);
                    }, 10);
                })
                .on('hidden.wdesk.collapse', function (e) {
                    // since the dimension portion of the method
                    // executes before the callback, we need to
                    // give phantomjs enough time to perform that
                    // action before we assume the complete()
                    // callback is finished.
                    setTimeout(function () {
                        assertElemIsCollapsed(that.collapseElem);
                        assertTriggerIsCollapsed(that.triggerButton);

                        start();
                    }, 50);
                });

            this.triggerButton.click();
        });

        test('should reset style to auto after finishing opening collapse', function () {
            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            var initHeight = '0px';
            this.collapseElem.css('height', initHeight);

            this.collapseElem
                .on('show.wdesk.collapse', function () {
                    ok(this.style.height == initHeight);
                })
                .on('shown.wdesk.collapse', function () {
                    ok(this.style.height == 'auto');

                    start();
                })
                .collapse('show');
        });


    // DOM - ACCORDION
    // -------------------------
        module('collapse-dom-accordion', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                // true accordion (only one panel visible at a time)
                this.panelAcc = $(buildPanelDOM('#parent_panel-accordion')).appendTo('#qunit-fixture');
                this.panelAccHd1 = this.panelAcc.find('[data-toggle=collapse]').eq(0);
                this.panelAccHd2 = this.panelAcc.find('[data-toggle=collapse]').eq(1);
                this.panelAccHd3 = this.panelAcc.find('[data-toggle=collapse]').eq(2);
                this.panelAccCollapse1 = $(this.panelAccHd1.attr('data-target'));
                this.panelAccCollapse2 = $(this.panelAccHd2.attr('data-target'));
                this.panelAccCollapse3 = $(this.panelAccHd3.attr('data-target'));

                // collapsing panels (more than one panel visible at a time)
                this.panel = $(buildPanelDOM(false)).appendTo('#qunit-fixture');
                this.panelHd1 = this.panel.find('[data-toggle=collapse]').eq(0);
                this.panelHd2 = this.panel.find('[data-toggle=collapse]').eq(1);
                this.panelHd3 = this.panel.find('[data-toggle=collapse]').eq(2);
                this.panelCollapse1 = $(this.panelHd1.attr('data-target'));
                this.panelCollapse2 = $(this.panelHd2.attr('data-target'));
                this.panelCollapse3 = $(this.panelHd3.attr('data-target'));
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.panelAcc = null;
                this.panelAccHd1 = null;
                this.panelAccHd2 = null;
                this.panelAccHd3 = null;
                this.panelAccCollapse1 = null;
                this.panelAccCollapse2 = null;
                this.panelAccCollapse3 = null;

                this.panel = null;
                this.panelHd1 = null;
                this.panelHd2 = null;
                this.panelHd3 = null;
                this.panelCollapse1 = null;
                this.panelCollapse2 = null;
                this.panelCollapse3 = null;
            }
        });

        test('should collapse all other panels in an accordion when another is activated if parent is specified', function () {
            var that = this;

            stop();

            expect(45);

            this.panelAccCollapse3
                .on('shown.wdesk.collapse', function () {
                    assertTriggerIsCollapsed(that.panelAccHd1, false);
                    assertElemIsCollapsed(that.panelAccCollapse1, false);
                    assertTriggerIsCollapsed(that.panelAccHd2, false);
                    assertElemIsCollapsed(that.panelAccCollapse2, false);

                    assertTriggerIsExpanded(that.panelAccHd3, false);
                    assertElemIsExpanded(that.panelAccCollapse3, false);

                    start();
                });

            this.panelAccCollapse1
                .on('shown.wdesk.collapse', function () {
                    assertTriggerIsCollapsed(that.panelAccHd3, false);
                    assertElemIsCollapsed(that.panelAccCollapse3, false);
                    assertTriggerIsCollapsed(that.panelAccHd2, false);
                    assertElemIsCollapsed(that.panelAccCollapse2, false);

                    assertTriggerIsExpanded(that.panelAccHd1, false);
                    assertElemIsExpanded(that.panelAccCollapse1, false);

                    that.panelAccHd3.click(); // open panel 3
                });

            this.panelAccHd1.click(); // open panel 1
        });

        test('should allow multiple panels to be expanded in a panel-group if parent isn\'t specified', function () {
            var that = this;

            stop();

            expect(17);

            this.panelCollapse3
                .on('shown.wdesk.collapse', function () {
                    assertTriggerIsExpanded(that.panelHd3, false);
                    assertElemIsExpanded(that.panelCollapse3, false);
                    assertTriggerIsExpanded(that.panelHd1, false);
                    assertElemIsExpanded(that.panelCollapse1, false);

                    start();
                });

            this.panelCollapse1
                .on('shown.wdesk.collapse', function () {
                    that.panelHd3.click(); // open panel 3
                });

            this.panelHd1.click(); // open panel 1
        });


    // DOM - NAV
    // -------------------------
        module('collapse-dom-nav', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                // collapsing nav
                this.nav = $(collapseNavDOM).appendTo('#qunit-fixture');
                this.navBtnActiveInit = $('#test1_btn');
                this.navBtnActiveNew = $('#test2_btn');
                this.navBtnChildActiveNew = $('#test1_1_btn');
                this.navMenuActiveInit = $('#test1');
                this.navMenuActiveNew = $('#test2');
                this.navMenuChildActiveNew = $('#test1_1');

                this.navBtnHrefAttr = this.navBtnActiveInit;
                this.navMenuHrefAttr = this.navMenuActiveInit;

                this.navBtnDataTargetAttr = this.navBtnActiveNew;
                this.navMenuDataTargetAttr = this.navMenuActiveNew;

                this.navBtnAriaControlsAttr = $('#test3_btn');
                this.navMenuAriaControlsAttr = $('#test3');

                this.activeClass = activeClass;
                this.activeParentClass = activeParentClass;
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.nav = null;
            }
        });

        test('should activate / expand the target element via data-target attribute', function () {
            var that = this;

            stop();

            expect(13);

            this.navMenuDataTargetAttr
                .on('activate.wdesk.collapse', function (e) {
                    assertTriggerParentIsActivated(that.navBtnDataTargetAttr.parent('li'));
                })
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.navBtnDataTargetAttr.attr('href'),
                        'no href attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.navMenuDataTargetAttr);
                    assertTriggerIsExpanded(that.navBtnDataTargetAttr);

                    start();
                });

            // activate the menu via data-target attribute
            this.navBtnDataTargetAttr.click();
        });

        test('should activate / expand the target element via href attribute', function () {
            var that = this;

            stop();

            expect(13);

            this.navMenuHrefAttr
                .on('activate.wdesk.collapse', function (e) {
                    assertTriggerParentIsActivated(that.navBtnHrefAttr.parent('li'));
                })
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.navBtnHrefAttr.data('target'),
                        'no data-target attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.navMenuHrefAttr);
                    assertTriggerIsExpanded(that.navBtnHrefAttr);

                    start();
                });

            // activate the menu via href attribute
            this.navBtnHrefAttr.click();
        });

        test('should activate / expand the target element via data-target attribute', function () {
            var that = this;

            stop();

            expect(13);

            this.navMenuAriaControlsAttr
                .on('activate.wdesk.collapse', function (e) {
                    assertTriggerParentIsActivated(that.navBtnAriaControlsAttr.parent('li'));
                })
                .on('shown.wdesk.collapse', function (e) {
                    ok(!that.navBtnAriaControlsAttr.attr('data-target') && !that.navBtnAriaControlsAttr.data('target'),
                        'no data-target attribute should be present for this test'
                    );
                    assertElemIsExpanded(that.navMenuAriaControlsAttr);
                    assertTriggerIsExpanded(that.navBtnAriaControlsAttr);

                    start();
                });

            // activate the menu via data-target attribute
            that.navBtnAriaControlsAttr.click();
        });

        test('should "activate" an element\'s activateElem with activeClass', function () {
            var that = this;

            stop();

            expect(3);

            this.navMenuActiveInit
                .on('activate.wdesk.collapse', function (e) {
                    assertTriggerParentIsActivated(that.navBtnActiveInit.parent('li'));
                })
                .on('shown.wdesk.collapse', function (e) {
                    start();
                });

            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should "de-activate" the current active element before activating a new one', function () {
            var that = this,
                deactivateFired = 0,
                activateFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.navMenuActiveInit
                .on('deactivate.wdesk.collapse', function (e) {
                    deactivateFired++;
                    equal(activateFired, 0,
                        'old menu should be deactivated before new menu is activated'
                    );
                })
                .on('shown.wdesk.collapse', function (e) {
                    that.navBtnActiveNew.click();
                });

            this.navMenuActiveNew
                .on('activate.wdesk.collapse', function (e) {
                    activateFired++;
                    equal(deactivateFired, 1,
                        'old menu should be deactivated before new menu is activated'
                    );
                })
                .on('shown.wdesk.collapse', function (e) {
                    start();
                });

            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should expand collapsed panel after the trigger elem is "activated"', function () {
            var that = this,
                shownFired = 0,
                activateFired = 0;

            stop();

            expect(12);

            this.navMenuActiveInit
                .on('activate.wdesk.collapse', function (e) {
                    activateFired++;
                    equal(shownFired, 0,
                        'activate.wdesk.collapse should fire before shown.wdesk.collapse'
                    );
                })
                .on('shown.wdesk.collapse', function (e) {
                    shownFired++;
                    equal(activateFired, 1,
                        'shown.wdesk.collapse should fire after activate.wdesk.collapse'
                    );
                    assertElemIsExpanded(that.navMenuActiveInit);
                    assertTriggerIsExpanded(that.navBtnActiveInit);

                    start();
                });

            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should "de-activate" an element\'s activateElem when its child element is activated', function () {
            var that = this;

            stop();

            expect(5);

            this.navMenuActiveInit
                .on('shown.wdesk.collapse', function (e) {
                    // Prevent duplicate calls on events bubbled from navBtnChildActiveNew
                    // In other words, ensure that only events originating from the collapse instance on the
                    // element this.navMenuActiveInit[0] are used, and all other ones are ignored.
                    if (e.target !== e.currentTarget) {
                        return;
                    }
                    // activate the child menu
                    that.navBtnChildActiveNew.click();
                });

            this.navMenuChildActiveNew
                .on('activate.wdesk.collapse', function (e) {
                    assertTriggerParentIsDeactivated(that.navBtnActiveInit.parent('li'));
                    assertTriggerParentIsActivated(that.navBtnChildActiveNew.parent('li'));
                })
                .on('shown.wdesk.collapse', function (e) {
                    start();
                });


            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should leave deactivated elem expanded if new active elem is its child', function () {
            var that = this;

            // assign a data-parent so that we can test the assertion
            // in a situation where all open accordion panels should otherwise close.
            // TODO: should data-parent be able to be used in combination with data-collapse-container?
            // addParentRefsToNav();

            stop();

            expect(10);

            this.navMenuActiveInit
                .on('shown.wdesk.collapse', function (e) {
                    // activate the child menu
                    that.navBtnChildActiveNew.click();
                });

            this.navMenuChildActiveNew
                .on('shown.wdesk.collapse', function (e) {
                    ok(that.navBtnActiveInit.parent('li').hasClass(activeParentClass),
                        'parent <li> elem should have .active-parent CSS class if one of its children is active'
                    );
                    ok(that.navBtnActiveInit.hasClass('open'),
                        'trigger elem should have .open CSS class if one of its children is active'
                    );

                    assertElemIsExpanded(that.navMenuChildActiveNew, false);
                    assertTriggerParentIsActivated(that.navBtnChildActiveNew.parent('li'));

                    start();
                });


            // activate the first menu
            this.navBtnActiveInit.click();
        });

        test('should not collapse an element if the triggering element specifies that a click "activates" that button', function () {
            var that = this;

            stop();

            expect(11);

            this.navMenuActiveInit
                .on('activate.wdesk.collapse', function (e) {
                    assertElemIsExpanded(that.navMenuActiveInit, false);
                })
                .on('shown.wdesk.collapse', function (e) {
                    assertElemIsExpanded(that.navMenuActiveInit, false);

                    that.navBtnActiveInit.click(); // activate it after its menu is already expanded

                    start();
                });

            // expand the menu without activating it
            this.navBtnActiveInit.find(' > [data-activate=false]').click();
        });

        test('should collapse an expanded, active element if the triggering element doesn\'t specify that a click "activates" that button', function () {
            var that = this;

            stop();

            expect(10); // 3 + setup test

            this.navMenuActiveInit
                .on('shown.wdesk.collapse', function (e) {
                    assertElemIsExpanded(that.navMenuActiveInit, false);
                    assertTriggerParentIsActivated(that.navBtnActiveInit.parent('li'));

                    that.navBtnActiveInit.find('> [data-activate=false]').click(); // collapse an activated menu without deactivating it
                })
                .on('hidden.wdesk.collapse', function (e) {
                    assertTriggerParentIsActivated(that.navBtnActiveInit.parent('li'));

                    start();
                });

            // expand and activate the menu
            this.navBtnActiveInit.click();
        });


    // NESTING
    // -------------------------
        module('collapse-nesting', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                // collapsing nav
                this.$nesting = $(nestingDOM).appendTo('#qunit-fixture');

                this.nestingDepth = 5;
                this.$collapsibles = new Array(this.nestingDepth);
                this.$buttons = new Array(this.nestingDepth);
                for (var i=0; i<this.nestingDepth; i++) {
                    this.$collapsibles[i] = this.$nesting.find('#' + (i + 1));
                    this.$buttons[i] = this.$nesting.find('#btn_' + (i + 1));
                }
                this.$sibling = this.$nesting.find('#sibling');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.$nesting = null;
                this.nestingDepth = null;
                this.$collapsibles = null;
                this.$buttons = null;
                this.$sibling = null;
            }
        });

        test('should initialize ancestor collapses on programmatic initialization, with appropriate initial _relatedTargets', function () {
            var that = this;

            expect(3); // 1 + setup test

            // Initialize the most deeply nested collapsible element
            this.$collapsibles[this.$collapsibles.length - 1].collapse({});

            var collapse = this.$collapsibles[0].data('wdesk.collapse');

            ok(collapse,
                'rootmost collapsible should have been initialized'
            );

            strictEqual(collapse.options.initialRelatedTarget,
                this.$buttons[0][0],
                'intial _relatedTarget should be that specified by aria-labelledby'
            );
        });

        test('should initialize ancestor collapses on data-api initialization', function () {
            var that = this;

            expect(3); // 1 + setup test

            // Initialize the most deeply nested collapsible element
            this.$buttons[this.$buttons.length - 1].click();

            var collapse = this.$collapsibles[0].data('wdesk.collapse');

            ok(collapse,
                'rootmost collapsible should have been initialized'
            );

            strictEqual(collapse.options.initialRelatedTarget,
                this.$buttons[0][0],
                'intial _relatedTarget should be that specified by the aria-labelledby'
            );
        });

        test('should auto expand ancestors on "show"', function () {
            var that = this;

            expect(2); // 1 + setup test

            // Add an event listener to the rootmost collapsible element
            this.$collapsibles[0]
                .on('shown.wdesk.collapse', function (e) {
                    // Prevent duplicate calls on bubbled events
                    if (e.target !== e.currentTarget) {
                        return;
                    }
                    ok(true,
                        'the root collapsible should have been expanded'
                    );
                });

            // Trigger a 'show' on the most deeply nested collapsible element
            this.$collapsibles[this.$collapsibles.length - 1].collapse('show');
        });

        test('should cancel auto ancestor exapansion when a "show" doesn\'t complete', function () {
            var that = this;

            expect(2); // 1 + setup test

            // Add an event listener to the rootmost collapsible element
            this.$collapsibles[0]
                .on('shown.wdesk.collapse', function (e) {
                    // Prevent duplicate calls on bubbled events
                    if (e.target !== e.currentTarget) {
                        return;
                    }
                    ok(false,
                        'the root collapsible should not have been expanded'
                    );
                });

            // Add an event listener to an intermediary collapsible element that cancels the show
            this.$collapsibles[2]
                .on('show.wdesk.collapse', function (e) {
                    // Prevent duplicate calls on bubbled events
                    if (e.target !== e.currentTarget) {
                        return;
                    }
                    ok(true,
                        'the intermediary collapsible should have received a "show" event'
                    );
                    e.preventDefault();
                });

            // Trigger a 'show' on the most deeply nested collapsible element
            this.$collapsibles[this.$collapsibles.length - 1].collapse('show');
        });

        test('should auto collapse descendents on "hide"', function () {
            var that = this;

            expect(3); // 2 + setup test

            // Trigger a 'show' on the most deeply nested collapsible element
            this.$collapsibles[this.$collapsibles.length - 1].collapse('show');

            strictEqual(this.$nesting.find('.collapse.in').length,
                this.nestingDepth,
                'All nested collapsible elements should be expanded'
            );

            // Trigger a 'hide' on the most deeply nested collapsible element
            this.$collapsibles[0].collapse('hide');

            strictEqual(this.$nesting.find('.collapse.in').length,
                0,
                'All nested collapsible elements should be collapsed'
            );
        });

        test('should work properly when a descendant cancels collapse on auto collapse', function () {
            var that = this;

            expect(4); // 3 + setup test

            var $intermediaryCollapsible = this.$collapsibles[3];

            // Add an event listener to an intermediary collapsible element that cancels the hide
            $intermediaryCollapsible
                .on('hide.wdesk.collapse', function (e) {
                    // Prevent duplicate calls on bubbled events
                    if (e.target !== e.currentTarget) {
                        return;
                    }
                    e.preventDefault();
                });

            // Trigger a 'show' on the most deeply nested collapsible element
            this.$collapsibles[this.$collapsibles.length - 1].collapse('show');

            strictEqual(this.$nesting.find('.collapse.in').length,
                this.nestingDepth,
                'All nested collapsible elements should be expanded'
            );

            // Trigger a 'hide' on the rootmost collapsible element
            this.$collapsibles[0].collapse('hide');

            var $open = this.$nesting.find('.collapse.in');

            strictEqual($open.length,
                1,
                'Only one collapsible should remain open'
            );

            strictEqual($open[0],
                $intermediaryCollapsible[0],
                'The only open collapsible should be the one we prevented default on'
            );
        });

        test('should auto collapse siblings on "hide"', function () {
            var that = this;

            expect(2); // 1 + setup test

            // On the most deeply nested collapsible element...
            this.$collapsibles[this.$collapsibles.length - 1]
                // ...add an event listener
                .on('hide.wdesk.collapse', function (e) {
                    ok(true,
                        'the leaf should be hidden when its sibling is expanded'
                    );
                })
                // ...trigger a 'show'
                .collapse('show');

            // Trigger a show on the leaf's sibling
            this.$sibling.collapse('show');
        });
});