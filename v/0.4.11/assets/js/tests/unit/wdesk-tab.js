$(function () {

    /* global Tab */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------

        var tabsHTML =
            '<ul class="tabs" role="tablist">' +
                '<li role="presentation"><button class="hitarea" data-target="#home" role="tab" id="home-tab" tabindex="0" aria-selected="false" aria-controls="home">Home</button></li>' +
                '<li role="presentation"><a class="hitarea" data-target="#profile" role="tab" id="profile-tab" tabindex="0" aria-selected="false" aria-controls="profile">Profile</a></li>' +
                '<li role="presentation"><a class="hitarea" data-target="#logout" role="tab" id="logout-tab" tabindex="0" aria-selected="false" aria-controls="logout">Log out</a></li>' +
            '</ul>' +
            '<ul class="tab-content">' +
                '<div class="tab-pane fade" id="home" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="home-tab"></div>' +
                '<div class="tab-pane fade" id="profile" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="profile-tab"></div>' +
                '<div class="tab-pane fade" id="logout" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="logout-tab"></div>' +
            '</ul>';

        var tabsDataApiHTML =
            '<ul class="tabs" role="tablist">' +
                '<li role="presentation"><button class="hitarea" data-toggle="tab" data-target="#home" role="tab" id="home-tab" tabindex="0" aria-selected="false" aria-controls="home">Home</button></li>' +
                '<li role="presentation"><a class="hitarea" data-toggle="tab" data-target="#profile" role="tab" id="profile-tab" tabindex="0" aria-selected="false" aria-controls="profile">Profile</a></li>' +
                '<li role="presentation"><a class="hitarea" data-toggle="tab" data-target="#logout" role="tab" id="logout-tab" tabindex="0" aria-selected="false" aria-controls="logout">Log out</a></li>' +
            '</ul>' +
            '<ul class="tab-content">' +
                '<div class="tab-pane fade" id="home" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="home-tab"></div>' +
                '<div class="tab-pane fade" id="profile" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="profile-tab"></div>' +
                '<div class="tab-pane fade" id="logout" role="tabpanel" tabindex="-1" aria-hidden="true" aria-labelledby="logout-tab"></div>' +
            '</ul>';

        var tabsDataApiInaccessibleHTML =
            '<ul class="tabs">' +
                '<li><button class="hitarea" data-toggle="tab" data-target="#home">Home</button></li>' +
                '<li><a class="hitarea" data-toggle="tab" data-target="#profile">Profile</a></li>' +
                '<li><a class="hitarea" data-toggle="tab" data-target="#logout">Log out</a></li>' +
            '</ul>' +
            '<ul class="tab-content">' +
                '<div class="tab-pane fade" id="home"></div>' +
                '<div class="tab-pane fade" id="profile"></div>' +
                '<div class="tab-pane fade" id="logout"></div>' +
            '</ul>';


    // BASE
    // -------------------------
        module('tab-base', {
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
            var tab = $.fn.tab.noConflict();
            ok(!$.fn.tab,
                'tab was not set back to undefined (org value)'
            );
            $.fn.tab = tab;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).tab,
                'tab method is not defined on the jQuery object'
            );
        });

        test('should return element', function () {
            equal($(document.body).tab()[0], document.body,
                'element bound to tab method was not returned'
            );
        });

        test('should provide helper method to make tab DOM WCAG compliant', function () {
            equal(typeof $.fn.accessibleTabs, 'function',
                '$.fn.accessibleTabs helper method should be defined on `$`'
            );
        });


    // EVENTS
    // -------------------------
        module('tab-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = { end: 'webkitTransitionEnd' };

                $(tabsHTML).appendTo('#qunit-fixture');

                this.tabs = $('.tabs');
                this.homeTabTrigger = this.tabs.find('[data-target=#home]');
                this.profileTabTrigger = this.tabs.find('[data-target=#profile]');

                this.tabContent = $('.tab-content');
                this.homeTab = this.tabContent.find('#home');
                this.profileTab = this.tabContent.find('#profile');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.tabs = null;
                this.homeTabTrigger = null;
                this.profileTabTrigger = null;
                this.tabContent = null;
                this.homeTab = null;
                this.profileTab = null;
            }
        });

        test('should not fire shown when show is prevented', function () {
            var showFired = 0,
                shownFired = 0;

            this.homeTabTrigger
                .on('show.wdesk.tab', function (e) {
                    e.preventDefault();
                    showFired++;
                })
                .on('shown.wdesk.tab', function (e) {
                    shownFired++;
                })
                .tab('show');

            equal(showFired, 1, 'show.wdesk.tab should have been emitted once');
            equal(shownFired, 0, 'shown.wdesk.tab should have been prevented by default');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = 0,
                shownFired = 0;

            stop();

            expect(3); // 2 + setup test

            this.homeTabTrigger
                .on('show.wdesk.tab', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.tab fired before shown.wdesk.tab did');
                })
                .on('shown.wdesk.tab', function (e) {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.tab fired after show.wdesk.tab did');

                    start();
                })
                .tab('show');
        });

        test('should wait until CSS transition completes before firing past-participle `shown` event', function () {
            /* MOCK TRANSITIONS */
            // $.support.transition = { end: 'webkitTransitionEnd' };
            var mockTransDuration = $.fn.tab.Constructor.DEFAULTS.duration;
            $.fn.getTransitionDuration = function () {
                return mockTransDuration;
            };
            /* END MOCK TRANSITIONS */

            var that = this,
                showFired   = 0,
                shownFired  = 0;

            stop();

            expect(5); // 4 + setup test

            this.homeTabTrigger.tab('show');
            this.profileTabTrigger
                .on('show.wdesk.tab', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.tab', function (e) {
                    shownFired++;
                })
                .tab('show');

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
                        (mockTransDuration + 50) + 'ms: shown event should have fired.'
                    );

                    start();
                }, mockTransDuration + 50);
            }, 0);
        });

        test('should reference correct `relatedTarget` on show/shown events', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.homeTabTrigger.tab('show');
            this.profileTabTrigger
                .on('show.wdesk.tab', function (e) {
                    ok(e.relatedTarget, 'e.relatedTarget should be defined');
                    equal($(e.relatedTarget).data('target'), '#' + that.homeTab.attr('id'),
                        '$(e.relatedTarget).data(\'target\') should equal the id of the tab that just closed'
                    );
                })
                .on('shown.wdesk.tab', function (e) {
                    ok(e.relatedTarget, 'e.relatedTarget should be defined');
                    equal($(e.relatedTarget).data('target'), '#' + that.homeTab.attr('id'),
                        '$(e.relatedTarget).data(\'target\') should equal the id of the tab that just closed'
                    );

                    start();
                })
                .tab('show');
        });


    // METHODS
    // -------------------------
        module('tab-methods', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                $(tabsHTML).appendTo('#qunit-fixture');

                this.tabs = $('.tabs');
                this.homeTabTrigger = this.tabs.find('[data-target=#home]');
                this.profileTabTrigger = this.tabs.find('[data-target=#profile]');

                this.tabContent = $('.tab-content');
                this.homeTab = this.tabContent.find('#home');
                this.profileTab = this.tabContent.find('#profile');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.tabs = null;
                this.homeTabTrigger = null;
                this.profileTabTrigger = null;
                this.tabContent = null;
                this.homeTab = null;
                this.profileTab = null;
            }
        });

        test('should activate element by tab id', function () {
            this.homeTabTrigger.tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'home');

            this.profileTabTrigger.tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'profile');
        });

        test('should activate element by pill id', function () {
            this.tabs.removeClass('tabs').addClass('pills');

            this.homeTabTrigger.tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'home');

            this.profileTabTrigger.tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'profile');
        });


    // DATA-API
    // -------------------------
        module('tab-data-api', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                $(tabsDataApiHTML).appendTo('#qunit-fixture');

                this.tabs = $('.tabs');
                this.homeTabTrigger = this.tabs.find('[data-target=#home]');
                this.profileTabTrigger = this.tabs.find('[data-target=#profile]');

                this.tabContent = $('.tab-content');
                this.homeTab = this.tabContent.find('#home');
                this.profileTab = this.tabContent.find('#profile');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.tabs = null;
                this.homeTabTrigger = null;
                this.profileTabTrigger = null;
                this.tabContent = null;
                this.homeTab = null;
                this.profileTab = null;
            }
        });

        test('should activate element via href', function () {
            var href = this.profileTabTrigger.attr('data-target');
            this.profileTabTrigger
                .removeAttr('data-target')
                .attr('href', href)
                .tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'profile');
        });

        test('should activate element via data-target', function () {
            this.homeTabTrigger.tab('show');
            equal(this.tabContent.find('.active').attr('id'), 'home');
        });


    // ACCESSIBILITY
    // -------------------------
        module('tab-accessibility', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $.support.transition = false;

                $(tabsDataApiInaccessibleHTML).appendTo('#qunit-fixture');

                this.tabs = $('.tabs');
                this.homeTabTrigger = this.tabs.find('[data-target=#home]');
                this.profileTabTrigger = this.tabs.find('[data-target=#profile]');
                this.logoutTabTrigger = this.tabs.find('[data-target=#logout]');

                this.tabContent = $('.tab-content');
                this.homeTab = this.tabContent.find('#home');
                this.profileTab = this.tabContent.find('#profile');
                this.logoutTab = this.tabContent.find('#logout');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.tabs = null;
                this.homeTabTrigger = null;
                this.profileTabTrigger = null;
                this.logoutTabTrigger = null;
                this.tabContent = null;
                this.homeTab = null;
                this.profileTab = null;
                this.logoutTab = null;
            }
        });

        test('`$.fn.accessibleTabs` helper function should add required aria-roles to make tab markup WCAG compliant', function() {
            this.tabs.accessibleTabs();

            equal(this.tabs.attr('role'), 'tablist', 'tablist role should have been added to tabs container');

            $.each(this.tabs.find('> li'), function() {
                equal($(this).attr('role'), 'presentation', 'presentation role should have been added to this `<li>`');
                equal($(this).find('> .hitarea').attr('role'), 'tab', 'presentation role should have been added to this `.hitarea`');
            });
        });

        test('`$.fn.accessibleTabs` helper function should add required `tabindex` / aria attributes to make tab markup WCAG compliant', function() {
            this.tabs.accessibleTabs();

            $.each(this.tabs.find('> li'), function() {
                var isActive = $(this).hasClass('active');

                var $tab = $(this).find('> .hitarea');
                var targetPaneSelector = $tab.attr('href') || $tab.attr('data-target');
                var targetPaneId = targetPaneSelector.substr(1);
                var $targetPane = $(targetPaneSelector);

                equal($tab.attr('id'), $targetPane.attr('aria-labelledby'),
                    'Active tab panel\'s `aria-labelledby` attribute should match triggering tab ID'
                );
                equal($tab.attr('aria-controls'), $targetPane.attr('id'),
                    'Active tab panel\'s `aria-labelledby` attribute should match triggering tab ID'
                );

                if (isActive) {
                    equal($tab.attr('tabindex'), '0', 'Active tab should have a `tabindex` of 0');
                    equal($tab.attr('aria-selected'), 'true', 'Active tab should have a `aria-selected` value of true');

                    equal($targetPane.attr('tabindex'), '0', 'Active tab pane should have a `tabindex` of 0');
                    equal($targetPane.attr('aria-hidden'), 'false', 'Active tab pane should have a `aria-hidden` value of false');
                } else {
                    equal($tab.attr('tabindex'), '0', 'Inactive tab should have a `tabindex` of 0');
                    equal($tab.attr('aria-selected'), 'false', 'Inactive tab should have a `aria-selected` value of false');

                    equal($targetPane.attr('tabindex'), '-1', 'Inactive tab pane should have a `tabindex` of -1');
                    equal($targetPane.attr('aria-hidden'), 'true', 'Inactive tab pane should have a `aria-hidden` value of true');
                }
            });
        });

        test('activated tab / tab panel should have required aria-roles / attributes to make tab markup WCAG compliant', function () {
            this.tabs.accessibleTabs();

            // all other assertions are invalid if this tab doesn't start out inactive
            equal(this.profileTabTrigger.attr('tabindex'), '0', 'Inactive tab trigger should have a `tabindex` of 0');
            equal(this.profileTabTrigger.attr('aria-selected'), 'false', 'Inactive tab trigger should have a `aria-selected` value of false');
            equal(this.profileTab.attr('tabindex'), '-1', 'Inactive tab pane should have a `tabindex` of -1');
            equal(this.profileTab.attr('aria-hidden'), 'true', 'Inactive tab pane should have a `aria-hidden` value of true');

            this.profileTabTrigger.click();

            equal(this.profileTabTrigger.attr('tabindex'), '0', 'Active tab trigger should have a `tabindex` of 0');
            equal(this.profileTabTrigger.attr('aria-selected'), 'true', 'Active tab trigger should have a `aria-selected` value of true');
            equal(this.profileTab.attr('tabindex'), '0', 'Active tab pane should have a `tabindex` of 0');
            equal(this.profileTab.attr('aria-hidden'), 'false', 'Active tab pane should have a `aria-hidden` value of false');

            this.homeTabTrigger.click();

            equal(this.profileTabTrigger.attr('tabindex'), '0', 'Inactive tab trigger should have a `tabindex` of 0');
            equal(this.profileTabTrigger.attr('aria-selected'), 'false', 'Inactive tab trigger should have a `aria-selected` value of false');
            equal(this.profileTab.attr('tabindex'), '-1', 'Inactive tab pane should have a `tabindex` of -1');
            equal(this.profileTab.attr('aria-hidden'), 'true', 'Inactive tab pane should have a `aria-hidden` value of true');

            equal(this.homeTabTrigger.attr('tabindex'), '0', 'Active tab trigger should have a `tabindex` of 0');
            equal(this.homeTabTrigger.attr('aria-selected'), 'true', 'Active tab trigger should have a `aria-selected` value of true');
            equal(this.homeTab.attr('tabindex'), '0', 'Active tab pane should have a `tabindex` of 0');
            equal(this.homeTab.attr('aria-hidden'), 'false', 'Active tab pane should have a `aria-hidden` value of false');
        });

        test('Should navigate tabs via the up/down/left/right keys for WCAG compliance', function() {
            this.tabs.accessibleTabs();

            var that = this;
            var tabTriggers = $('[data-toggle=tab]');
            var i = 0;

            expect(7); // 6 + setup test

            stop();

            this.homeTabTrigger
                .one('shown.wdesk.tab', function (e) {
                    // prerequisite test - rest of tests are invalid if this is not a true assertion
                    equal(tabTriggers[0], $(document.activeElement)[0],
                        'First tab should start out focused'
                    );

                    $(tabTriggers[0]).trigger({
                        type: 'keydown',
                        keyCode: 40 // down
                    });

                    equal(tabTriggers[1], $(document.activeElement)[0],
                        'Second tab should be focused now'
                    );

                    $(tabTriggers[1]).trigger({
                        type: 'keydown',
                        keyCode: 39 // right
                    });

                    equal(tabTriggers[2], $(document.activeElement)[0],
                        'Last tab should be focused now'
                    );

                    $(tabTriggers[2]).trigger({
                        type: 'keydown',
                        keyCode: 40 // down
                    });

                    // should "wrap" at the end of a list of tabbable elements
                    equal(tabTriggers[0], $(document.activeElement)[0],
                        'First tab should be focused now'
                    );

                    $(tabTriggers[0]).trigger({
                        type: 'keydown',
                        keyCode: 38 // up
                    });

                    // should "wrap" at the beginning of a list of tabbable elements
                    equal(tabTriggers[2], $(document.activeElement)[0],
                        'Last tab should be focused now'
                    );

                    $(tabTriggers[2]).trigger({
                        type: 'keydown',
                        keyCode: 37 // left
                    });

                    equal(tabTriggers[1], $(document.activeElement)[0],
                        'Second tab should be focused now'
                    );

                    start();
                });

            this.homeTabTrigger.tab('show');
        });

        test('Should exclude disabled tabs from keyboard navigation index for WCAG compliance', function() {
            this.profileTabTrigger.addClass('disabled');
            this.logoutTabTrigger.prop('disabled', true);
            this.tabs.accessibleTabs();

            var that = this;
            var tabTriggers = $('[data-toggle=tab]');
            var i = 0;

            expect(5); // 4 + setup test

            stop();

            this.homeTabTrigger
                .one('shown.wdesk.tab', function (e) {
                    // prerequisite test - rest of tests are invalid if this is not a true assertion
                    equal(that.homeTabTrigger[0], $(document.activeElement)[0],
                        'First tab should start out focused'
                    );

                    $(that.homeTabTrigger[0]).trigger({
                        type: 'keydown',
                        keyCode: 40 // down
                    });

                    equal(that.homeTabTrigger[0], $(document.activeElement)[0],
                        'First tab should still be focused'
                    );

                    ok(!that.profileTabTrigger.parent('li').hasClass('active'), 'Disabled tab parent `li` should not have active class');
                    equal(that.profileTabTrigger.attr('aria-selected'), 'false', 'Disabled tab `aria-selected` value should be false');

                    start();
                });

            this.homeTabTrigger.tab('show');
        });

});