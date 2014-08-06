$(function () {

    /* global Dropdown */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------
        var buildDropdownHTML = function (target, id) {
            var defaultTarget = '<button type="button" class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';

            target = target || defaultTarget;
            id = id || 'ddmenu';

            var html =
                '<li class="dropdown" id="' + id + '">' +
                    target +
                    '<ul role="menu" class="dropdown-menu">' +
                        '<li role="presentation"><a class="hitarea" href="#" tabindex="-1">First menu link</a></li>' +
                        '<li role="presentation"><a class="hitarea" href="#" tabindex="-1">Second menu link</a></li>' +
                        '<li role="separator" class="divider"></li>' +
                        '<li role="presentation"><a class="hitarea" href="#" tabindex="-1">Last menu link</a></li>' +
                    '</ul>' +
                '</li>';

            return html;
        }; // END buildDropdownHTML

        var openDropdownCount = function () {
            return $('#qunit-fixture').find('.dropdown.open').length;
        };

        var setTouchMockOpt = function (elems, touch) {
            $.each(elems, function () {
                var data = $(this).data('wdesk.dropdown');
                data.isTouch = touch;
            });
        };

        var getClickEventNamespaceList = function (obj) {
            var events = $._data($(obj)[0], 'events') && $._data($(obj)[0], 'events').click;
            var namespaces = [];

            if(events) {
                for(var i = 0; i < events.length; i++) {
                    namespaces.push(events[i].namespace);
                }
            }

            return namespaces;
        };

        var existsInArray = function (find, arr) {
            return arr.indexOf(find) > -1;
        };


    // BASE
    // -------------------------
        module('dropdown-base', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.dropdownMenuBtn = '<button class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>';
                this.dropdownMenu = $(buildDropdownHTML(this.dropdownMenuBtn));
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.dropdownMenuBtn = null;
                this.dropdownMenu = null;

                $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('should provide no conflict', function () {
            var dropdown = $.fn.dropdown.noConflict();
            ok(!$.fn.dropdown,
                'dropdown was not set back to undefined (org value)'
            );
            $.fn.dropdown = dropdown;
        });

        test('should be defined on jQuery object', function () {
            ok(this.dropdownMenu.dropdown,
                'dropdown method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.dropdownMenu.dropdown()[0], this.dropdownMenu[0],
                'element bound to dropdown method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.dropdown.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.dropdown.Constructor.DEFAULTS;

            equal(DEFAULTS.persistent, false, 'Dropdown.DEFAULTS.persistent');
            equal(DEFAULTS.autoWidth, false, 'Dropdown.DEFAULTS.autoWidth');
        });


    // EVENTS
    // -------------------------
        module('dropdown-events', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu2')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu3')).appendTo('.tabs');

                this.dd  = $('#ddMenu1');
                this.dd2 = $('#ddMenu2');
                this.dd3 = $('#ddMenu3');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenu2 = this.dd2.find('> .dropdown-menu');
                this.ddMenu3 = this.dd3.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn2 = this.dd2.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn3 = this.dd3.find('> [data-toggle="dropdown"]');

                $('[data-toggle=dropdown]', document).dropdown(); // for some reason this doesn't run by default in our unit tests

                setTouchMockOpt($('[data-toggle=dropdown]'), false);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenu2 = null;
                this.ddMenu3 = null;
                this.dd = null;
                this.dd2 = null;
                this.dd3 = null;
                this.ddMenuBtn = null;
                this.ddMenuBtn2 = null;
                this.ddMenuBtn3 = null;

                 $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('should bind document click to dropdown toggle when opening dropdown', function () {
            stop();

            expect(2); // 1 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    ok(existsInArray('data-api.dropdown.wdesk', getClickEventNamespaceList(document)),
                        'click event should not be registered on document');

                    start();
                });

            this.ddMenuBtn.click();
        });

        test('`relatedTarget` should be available on the show/shown and hide/hidden event objects via data-api', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.dd
                .on('hide.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );

                    start();
                })
                .on('show.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );
                })
                .on('shown.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );

                    that.ddMenuBtn.click();
                });

            this.ddMenuBtn.click();
        });

        test('`relatedTarget` should be available on the show/shown and hide/hidden event objects via js-api', function () {
            var that = this;

            stop();

            expect(5); // 4 + setup test

            this.dd
                .on('hide.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );

                    start();
                })
                .on('show.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );
                })
                .on('shown.wdesk.dropdown', function (e) {
                    deepEqual(e.relatedTarget, that.ddMenuBtn.data('wdesk.dropdown'),
                        '`e.relatedTarget` should equal Dropdown prototype instance'
                    );

                    that.ddMenuBtn.dropdown('toggle');
                });

            this.ddMenuBtn.dropdown('toggle');
        });

        test('should not fire hidden when hide is prevented', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            this.dd
                .on('shown.wdesk.dropdown', function () {
                    that.ddMenuBtn.click();
                })
                .on('hide.wdesk.dropdown', function (e) {
                    e.preventDefault();
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function () {
                    hiddenFired++;
                });

            this.ddMenuBtn.click();

            equal(hideFired, 1, 'hide.wdesk.dropdown should have been emitted once');
            equal(hiddenFired, 0, 'hidden.wdesk.dropdown should have been prevented by default');
        });

        test('should fire show/shown events in the correct sequence', function () {
            var showFired = 0,
                shownFired = 0;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.dd
                .on('show.wdesk.dropdown', function (e) {
                    showFired++;

                    equal(shownFired, 0, 'show.wdesk.dropdown fired before shown.wdesk.dropdown did');
                })
                .on('shown.wdesk.dropdown', function () {
                    shownFired++;

                    equal(showFired, 1, 'shown.wdesk.dropdown fired after show.wdesk.dropdown did');

                    start();
                });

            this.ddMenuBtn.click();
        });

        test('should fire hide/hidden events in the correct sequence', function () {
            var that = this,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    that.ddMenuBtn.click();
                })
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;

                    equal(hiddenFired, 0, 'hide.wdesk.dropdown fired before hidden.wdesk.dropdown did');
                })
                .on('hidden.wdesk.dropdown', function () {
                    hiddenFired++;

                    equal(hideFired, 1, 'hidden.wdesk.dropdown fired after hide.wdesk.dropdown did');

                    start();
                });

            this.ddMenuBtn.click();
        });

        test('should only fire hide/hidden on first dropdown when another is opened', function () {
            var that = this,
                showFired = 0,
                shownFired = 0,
                hideFired = 0,
                hiddenFired = 0;

            stop();

            // must assert the expected number of tests when testing pub/sub functionality
            expect(5); // 4 + setup test

            this.dd
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function () {
                    hiddenFired++;
                })
                .on('show.wdesk.dropdown', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.dropdown', function () {
                    shownFired++;

                    that.ddMenuBtn2.click(); // open another dropdown
                });

            this.dd2
                .on('shown.wdesk.dropdown', function (e) {
                    equal(showFired, 1,
                        'show.wdesk.dropdown should be emitted once'
                    );
                    equal(shownFired, 1,
                        'shown.wdesk.dropdown should be emitted once'
                    );
                    equal(hideFired, 1,
                        'hide.wdesk.dropdown should be emitted once'
                    );
                    equal(hiddenFired, 1,
                        'hidden.wdesk.dropdown should be emitted once'
                    );

                    start();
                });

            this.ddMenuBtn.click();
        });


    // EVENTS - PERSISTENCE
    // -------------------------
        module('dropdown-events-persistent', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';
                var targetPersist = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-persistent="true">Dropdown</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(targetPersist, 'ddMenu2')).appendTo('.tabs');

                this.dd  = $('#ddMenu1');
                this.ddPersist = $('#ddMenu2');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenuPersist = this.ddPersist.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> [data-toggle="dropdown"]');
                this.ddMenuBtnPersist = this.ddPersist.find('> [data-toggle="dropdown"]');

                $('[data-persistent=true]', document).dropdown(); // only instantiate the data-persistent example on init
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenuPersist = null;
                this.dd = null;
                this.ddPersist = null;
                this.ddMenuBtn = null;
                this.ddMenuBtnPersist = null;
            }
        });

        test('should not bind document click to dropdown toggle when opening persistent dropdown', function () {
            stop();

            expect(2); // 1 + setup test

            this.ddPersist
                .on('shown.wdesk.dropdown', function (e) {
                    ok(!existsInArray('data-api.dropdown.wdesk', getClickEventNamespaceList(document)),
                        'click event should not be registered on document');

                    start();
                });

            this.ddMenuBtnPersist.click();
        });

        test('should fire show/shown and hide/hidden when persistent dropdown is toggled', function() {
            var that = this,
                showFired = 0,
                shownFired = 0,
                hideFired = 0,
                hiddenFired = 0;

            this.ddPersist
                .on('show.wdesk.dropdown', function (e)  {
                    showFired++;
                })
                .on('shown.wdesk.dropdown', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    hiddenFired++;
                });

            this.ddMenuBtnPersist.click(); // open dropdown
            this.ddMenuBtnPersist.click(); // close dropdown

            equal(showFired, 1, 'show.wdesk.dropdown should be emitted once');
            equal(shownFired, 1, 'shown.wdesk.dropdown should be emitted once');
            equal(hideFired, 1, 'hide.wdesk.dropdown should be emitted once');
            equal(hiddenFired, 1, 'hidden.wdesk.dropdown should be emitted once');
        });

        test('should not fire hide/hidden events on persistent dropdown when document is clicked', function() {
            var that = this,
                showFired = 0,
                shownFired = 0,
                hideFired = 0,
                hiddenFired = 0;

            this.ddPersist
                .on('show.wdesk.dropdown', function (e)  {
                    showFired++;
                })
                .on('shown.wdesk.dropdown', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    hiddenFired++;
                });

            this.ddMenuBtnPersist.click(); // open dropdown
            $(document).click();

            equal(showFired, 1, 'show.wdesk.dropdown should be emitted once');
            equal(shownFired, 1, 'shown.wdesk.dropdown should be emitted once');
            equal(hideFired, 0, 'hide.wdesk.dropdown should not be emitted');
            equal(hiddenFired, 0, 'hidden.wdesk.dropdown should not be emitted');
        });

        test('should not fire hide/hidden events on persistent dropdown when another dropdown is opened', function() {
            this.ddMenuBtn.dropdown(); // add another non-persistent dropdown to the test

            var that = this,
                showFired = 0,
                shownFired = 0,
                hideFired = 0,
                hiddenFired = 0;

            this.ddPersist
                .on('show.wdesk.dropdown', function (e)  {
                    showFired++;
                })
                .on('shown.wdesk.dropdown', function (e) {
                    shownFired++;
                })
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    hiddenFired++;
                });

            this.ddMenuBtnPersist.click(); // open dropdown
            this.ddMenuBtn.click();

            equal(showFired, 1, 'show.wdesk.dropdown should be emitted once');
            equal(shownFired, 1, 'shown.wdesk.dropdown should be emitted once');
            equal(hideFired, 0, 'hide.wdesk.dropdown should not be emitted');
            equal(hiddenFired, 0, 'hidden.wdesk.dropdown should not be emitted');
        });


    // METHODS
    // -------------------------
        module('dropdown-methods', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle">Dropdown</button>';
                var autoWidthTarget = '<button class="btn dropdown-toggle">Dropdown that should be really really really wide in the DOM</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu2')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu3')).appendTo('.tabs');

                $('<ul style="width: 100px">' + buildDropdownHTML(autoWidthTarget, 'ddMenu4') + '</ul>').appendTo('#qunit-fixture');

                this.dd  = $('#ddMenu1');
                this.dd2 = $('#ddMenu2');
                this.dd3 = $('#ddMenu3');
                this.dd4 = $('#ddMenu4');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenu2 = this.dd2.find('> .dropdown-menu');
                this.ddMenu3 = this.dd3.find('> .dropdown-menu');
                this.ddMenu4 = this.dd4.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> .dropdown-toggle');
                this.ddMenuBtn2 = this.dd2.find('> .dropdown-toggle');
                this.ddMenuBtn3 = this.dd3.find('> .dropdown-toggle');
                this.ddMenuBtn4 = this.dd4.find('> .dropdown-toggle');

                setTouchMockOpt($('[data-toggle=dropdown]'), false);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenu2 = null;
                this.ddMenu3 = null;
                this.ddMenu4 = null;
                this.dd = null;
                this.dd2 = null;
                this.dd3 = null;
                this.dd4 = null;
                this.ddMenuBtn = null;
                this.ddMenuBtn2 = null;
                this.ddMenuBtn3 = null;
                this.ddMenuBtn4 = null;

                $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('should show/hide a dropdown menu via plugin js-api toggle() method', function () {
            this.ddMenuBtn.dropdown('toggle');
            equal(this.dd.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );

            this.ddMenuBtn.dropdown('toggle');
            equal(this.dd.attr('class'), 'dropdown',
                'open class should be removed from parent .dropdown elem'
            );
        });

        test('should be able to pass options object via js-api', function () {
            this.ddMenuBtn.dropdown({ persistent: true });

            var options = this.ddMenuBtn.data('wdesk.dropdown').options;
            equal(options.persistent, true,
                'persistent option should be true'
            );
        });

        test('menu width should adapt to the width of the triggering elem if `autoWidth` is set to true via js-api', function () {
            // this test is only valid if the width of the dropdown menu
            // is naturally less than the width of the button.
            this.dd4.css('width', '100px');
            this.ddMenu4.css('width', '50px');
            var menuBtnWidth = this.dd4.outerWidth();
            ok(menuBtnWidth > this.ddMenu4.outerWidth(),
                'dropdown button is wider than the dropdown menu (' + menuBtnWidth + ' > ' + this.ddMenu4.outerWidth() + ')'
            );

            this.ddMenuBtn4
                .dropdown({ autoWidth: true })
                .dropdown('toggle');
            equal(this.ddMenu4.css('min-width'), menuBtnWidth + 10 + 'px',
                'menu should have a width equal to the width of it\'s triggering button + 10'
            );
        });

        test('should be able to directly toggle a persistent dropdown menu via js-api', function () {
            this.ddMenuBtn.dropdown({ persistent: true }).dropdown('toggle');

            var options = this.ddMenuBtn.data('wdesk.dropdown').options;
            equal(options.persistent, true,
                'persistent option should be true'
            );
            equal(this.dd.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );

            this.ddMenuBtn.dropdown('toggle');
            equal(this.dd.attr('class'), 'dropdown',
                'open class should be removed from persistent parent .dropdown elem'
            );
        });

        test('should add `data-toggle=dropdown` to elem that is invoked via js-api toggle() method', function () {
            equal(this.ddMenuBtn.attr('data-toggle'), undefined,
                'elem should not have `data-toggle` attribute to begin this test'
            );
            this.ddMenuBtn.dropdown('toggle');
            equal(this.ddMenuBtn.attr('data-toggle'), 'dropdown',
                'elem should have `data-toggle` attribute added to it'
            );
        });

        test('should only allow one dropdown menu to be open at a time via js-api', function () {
            this.ddMenuBtn.dropdown('toggle');
            equal(this.dd.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );

            this.ddMenuBtn2.dropdown('toggle');
            equal(this.dd2.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );
        });

        test('should only allow one dropdown menu to be open at a time via js-api', function () {
            this.ddMenuBtn.dropdown('toggle');
            equal(this.dd.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );

            this.ddMenuBtn2.dropdown('toggle');
            equal(this.dd2.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );
        });

        test('should close dropdown opened via js-api when document is clicked', function () {
            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal(openDropdownCount(), 1,
                        'a dropdown menu should be open'
                    );

                    $(document).click(); // close dropdown
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    equal(openDropdownCount(), 0,
                        'all dropdown menus should be closed'
                    );

                    start();
                });

            this.ddMenuBtn.dropdown('toggle'); // open dropdown
        });

        test('should not open dropdown via js-api if target is disabled', function () {
            // disabled attribute
            var $disabledAttrBtn = this.ddMenuBtn.prop('disabled', true);
            $disabledAttrBtn.dropdown('toggle');
            equal(openDropdownCount(), 0,
                'no dropdown menus should be open'
            );

            // .disabled css class
            var $disabledClassBtn = this.ddMenuBtn2.addClass('disabled');
            $disabledClassBtn.dropdown('toggle');
            equal(openDropdownCount(), 0,
                'no dropdown menus should be open'
            );
        });

        test('should test if js-api element has a #name before assuming it\'s a selector', function () {
            var fooTarget = '<a href="/foo/" class="dropdown-toggle">Dropdown</a>';
            var hashTarget = '<a href="#" class="dropdown-toggle">Dropdown</a>';

            var $ddFoo = $(buildDropdownHTML(fooTarget, 'ddFoo')).appendTo('.tabs').find('.dropdown-toggle');
            $ddFoo.dropdown('toggle');
            equal($ddFoo.parent('.dropdown').attr('class'), 'dropdown open',
                'open class should be added on /foo/ click'
            );

            var $ddHash = $(buildDropdownHTML(hashTarget, 'ddHash')).appendTo('.tabs').find('.dropdown-toggle');
            $ddHash.dropdown('toggle');
            equal($ddHash.parent('.dropdown').attr('class'), 'dropdown open',
                'open class should be added on # click'
            );
        });


    // WCAG ACCESSIBILITY / KEYBOARD NAV
    // -------------------------
        module('dropdown-accessibility', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';
                var autoWidthTarget = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-auto-width="true">Dropdown that should be really really really wide in the DOM</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu2')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu3')).appendTo('.tabs');

                $('<ul style="width: 100px">' + buildDropdownHTML(autoWidthTarget, 'ddMenu4') + '</ul>').appendTo('#qunit-fixture');

                this.dd  = $('#ddMenu1');
                this.dd2 = $('#ddMenu2');
                this.dd3 = $('#ddMenu3');
                this.dd4 = $('#ddMenu4');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenu2 = this.dd2.find('> .dropdown-menu');
                this.ddMenu3 = this.dd3.find('> .dropdown-menu');
                this.ddMenu4 = this.dd4.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn2 = this.dd2.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn3 = this.dd3.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn4 = this.dd4.find('> [data-toggle="dropdown"]');

                $('[data-toggle=dropdown]', document).dropdown(); // for some reason this doesn't run by default in our unit tests

                setTouchMockOpt($('[data-toggle=dropdown]'), false);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenu2 = null;
                this.ddMenu3 = null;
                this.ddMenu4 = null;
                this.dd = null;
                this.dd2 = null;
                this.dd3 = null;
                this.dd4 = null;
                this.ddMenuBtn = null;
                this.ddMenuBtn2 = null;
                this.ddMenuBtn3 = null;
                this.ddMenuBtn4 = null;

                $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('should focus first elem in a dropdown menu when opened for WCAG compliance via focusIn method', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal($('.hitarea:visible', that.ddMenu)[0], $(document.activeElement)[0],
                        'first item in the dropdown menu should be focused'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });

        test('should focus triggering elem when dropdown menu is closed for WCAG compliance via focusOut method', function () {
            var that = this;

            stop();

            expect(2); // 1 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    that.ddMenuBtn.click(); // close dropdown
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    equal(that.ddMenuBtn[0], $(document.activeElement)[0],
                        'triggering button should be focused when dropdown menu is closed'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });

        test('Should navigate the items in a dropdown menu via the up/down keys for WCAG compliance', function() {
            var that = this;
            var i = 0;
            var ddMenuItems = this.ddMenu.find('li:not(.divider):visible .hitarea');
            var lastItemIndex = ddMenuItems.length - 1;

            stop();

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    // prerequisite test - rest of tests are invalid if this is not a true assertion
                    equal(ddMenuItems[0], $(document.activeElement)[0],
                        'First `.hitarea` in the dropdown menu should start out focused'
                    );

                    //
                    // traverse down the menu items
                    //
                    for (i = 1; i < ddMenuItems.length; i++) {
                        that.ddMenu.trigger({
                            type: 'keydown',
                            keyCode: 40
                        });

                        equal(ddMenuItems[i], $(document.activeElement)[0],
                            'Pressing the down key should focus `.hitarea:eq[' + i + ']` in the dropdown menu'
                        );
                    }

                    // pressing down again should do nothing
                    that.ddMenu.trigger({
                        type: 'keydown',
                        keyCode: 40
                    });
                    equal(ddMenuItems[lastItemIndex], $(document.activeElement)[0],
                        'The last `.hitarea` in the dropdown menu should still be focused'
                    );

                    //
                    // traverse up the menu items
                    //
                    for (i = lastItemIndex; i > 0; i--) {
                        that.ddMenu.trigger({
                            type: 'keydown',
                            keyCode: 38
                        });

                        equal(ddMenuItems[i - 1], $(document.activeElement)[0],
                            'Pressing the up key should focus `.hitarea:eq[' + (i - 1) + ']` in the dropdown menu'
                        );
                    }

                    // pressing up again should do nothing
                    that.ddMenu.trigger({
                        type: 'keydown',
                        keyCode: 38
                    });
                    equal(ddMenuItems[0], $(document.activeElement)[0],
                        'The first `.hitarea` in the dropdown menu should still be focused'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });

        test('should open/close the dropdown menu via keyboard spacebar for WCAG compliance', function() {
            var that = this;

            stop();

            expect(4); // 3 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    ok(true, 'Dropdown menu should have opened when the spacebar key was pressed');

                    // no matter what element is focused within the menu,
                    // pressing the spacebar again should close the menu.
                    $(document.activeElement).trigger({
                        type: 'keydown',
                        keyCode: 32
                    }); // close dropdown menu
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    ok(true, 'Dropdown menu should have closed when the spacebar key was pressed');
                    equal(that.ddMenuBtn[0], $(document.activeElement)[0],
                        'triggering button should be focused when dropdown menu is closed'
                    );

                    start();
                });

            this.ddMenuBtn
                .focus()
                .trigger({
                    type: 'keydown',
                    keyCode: 32
                }); // open dropdown menu
        });

        test('should close the dropdown menu via keyboard `tab` key for WCAG compliance', function() {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    // no matter what element is focused within the menu,
                    // pressing the `tab` key should close the menu.
                    $(document.activeElement).trigger({
                        type: 'keydown',
                        keyCode: 9
                    }); // close dropdown menu
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    ok(true, 'Dropdown menu should have closed when the `tab` key was pressed');
                    equal(that.ddMenuBtn[0], $(document.activeElement)[0],
                        'triggering button should be focused when dropdown menu is closed'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown menu
        });

        test('should close the dropdown menu via keyboard `esc` key for WCAG compliance', function() {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    // no matter what element is focused within the menu,
                    // pressing the `esc` key should close the menu.
                    $(document.activeElement).trigger({
                        type: 'keydown',
                        keyCode: 27
                    }); // close dropdown menu
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    ok(true, 'Dropdown menu should have closed when the `esc` key was pressed');
                    equal(that.ddMenuBtn[0], $(document.activeElement)[0],
                        'triggering button should be focused when dropdown menu is closed'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown menu
        });

        test('should not open the dropdown menu via keyboard `esc`', function() {
            var that        = this,
                shownFired  = 0,
                showFired   = 0;

            stop();

            expect(2); // 1 + setup test

            this.dd
                .on('show.wdesk.dropdown', function (e) {
                    showFired++;
                })
                .on('shown.wdesk.dropdown', function (e) {
                    shownFired++;
                });

            this.ddMenuBtn
                .focus()
                .trigger({
                    type: 'keydown',
                    keyCode: 27
                }); // trigger `esc` key when dropdown menu is hidden

            setTimeout(function() {
                equal(shownFired + showFired, 0, 'Pressing `esc` key on a dropdown-toggle when the dropdown menu is hidden should not open the menu.');

                start();
            }, 100);
        });

        test('should toggle `aria-expanded` attribute according to dropdown menu visibility for WCAG compliance', function () {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal(that.ddMenuBtn.attr('aria-expanded'), 'true',
                        'triggering button should have `aria-expanded` attribute set to true'
                    );

                    that.ddMenuBtn.click(); // close dropdown
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    equal(that.ddMenuBtn.attr('aria-expanded'), 'false',
                        'triggering button should have `aria-expanded` attribute set to false'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });

        test('triggering element id should be used to link visible dropdown-menu to element using `aria-labelledby` for WCAG compliance', function() {
            var that = this;

            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal(that.ddMenuBtn.attr('id'), that.ddMenu.attr('aria-labelledby'),
                        'Visible menu\'s `aria-labelledby` attribute should match triggering element ID'
                    );

                    that.ddMenuBtn.click(); // close dropdown
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    ok(! that.ddMenu.attr('aria-labelledby'), 'Menu should not have `aria-labelledby` attribute when it is hidden');

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });


    // DOM MANIPULATION
    // -------------------------
        module('dropdown-dom', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';
                var autoWidthTarget = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-auto-width="true">Dropdown that should be really really really wide in the DOM</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu2')).appendTo('.tabs');
                $(buildDropdownHTML(target, 'ddMenu3')).appendTo('.tabs');

                $('<ul style="width: 100px">' + buildDropdownHTML(autoWidthTarget, 'ddMenu4') + '</ul>').appendTo('#qunit-fixture');

                this.dd  = $('#ddMenu1');
                this.dd2 = $('#ddMenu2');
                this.dd3 = $('#ddMenu3');
                this.dd4 = $('#ddMenu4');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenu2 = this.dd2.find('> .dropdown-menu');
                this.ddMenu3 = this.dd3.find('> .dropdown-menu');
                this.ddMenu4 = this.dd4.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn2 = this.dd2.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn3 = this.dd3.find('> [data-toggle="dropdown"]');
                this.ddMenuBtn4 = this.dd4.find('> [data-toggle="dropdown"]');

                $('[data-toggle=dropdown]', document).dropdown(); // for some reason this doesn't run by default in our unit tests

                setTouchMockOpt($('[data-toggle=dropdown]'), false);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenu2 = null;
                this.ddMenu3 = null;
                this.ddMenu4 = null;
                this.dd = null;
                this.dd2 = null;
                this.dd3 = null;
                this.dd4 = null;
                this.ddMenuBtn = null;
                this.ddMenuBtn2 = null;
                this.ddMenuBtn3 = null;
                this.ddMenuBtn4 = null;

                $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('menu width should adapt to the width of the triggering elem if `autoWidth` is set to true via data-api', function () {
            // this test is only valid if the width of the dropdown menu
            // is naturally less than the width of the button.
            this.dd4.css('width', '100px');
            this.ddMenu4.css('width', '50px');
            var menuBtnWidth = this.dd4.outerWidth();
            ok(menuBtnWidth > this.ddMenu4.outerWidth(),
                'dropdown button is wider than the dropdown menu (' + menuBtnWidth + ' > ' + this.ddMenu4.outerWidth() + ')'
            );

            this.ddMenuBtn4.click();
            equal(this.ddMenu4.css('min-width'), menuBtnWidth + 10 + 'px',
                'menu should have a width equal to the width of it\'s triggering button + 10'
            );
        });

        test('should only allow one dropdown menu to be open at a time via data-api', function () {
            this.ddMenuBtn.click();
            equal(this.dd.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );

            this.ddMenuBtn2.click();
            equal(this.dd2.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );
            equal(openDropdownCount(), 1,
                'one dropdown menu should be open'
            );
        });

        test('should close dropdown opened via data-api when document is clicked', function () {
            stop();

            expect(3); // 2 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal(openDropdownCount(), 1,
                        'a dropdown menu should be open'
                    );

                    $(document).trigger({ type: 'click', button: 1 }); // close dropdown
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    equal(openDropdownCount(), 0,
                        'all dropdown menus should be closed'
                    );

                    start();
                });

            this.ddMenuBtn.click(); // open dropdown
        });

        test('should not close dropdown opened via data-api when document is right-clicked', function () {
            var hiddenFired = 0,
                hideFired = 0;

            stop();

            expect(5); // 4 + setup test

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    equal(openDropdownCount(), 1,
                        'a dropdown menu should be open'
                    );

                    $(document).trigger({ type: 'click', button: 2 }); // don't close dropdown

                    start();
                })
                .on('hide.wdesk.dropdown', function (e) {
                    hideFired++;
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    hiddenFired++;
                });

            this.ddMenuBtn.click(); // open dropdown

            equal(openDropdownCount(), 1,
                'dropdown menu should still be open'
            );
            equal(hideFired, 0, 'hide.wdesk.dropdown should not have fired');
            equal(hiddenFired, 0, 'hidden.wdesk.dropdown should not have fired');
        });

        test('should use .dropdown-backdrop elem on touch devices', function () {
            stop();

            expect(8); // 7 + setup test

            setTouchMockOpt($('[data-toggle=dropdown]'), true);

            this.dd
                .on('shown.wdesk.dropdown', function (e) {
                    var $backdrop = $('#qunit-fixture').find('.dropdown-backdrop');

                    equal(openDropdownCount(), 1,
                        'a dropdown menu should be open'
                    );
                    equal($backdrop.length, 1,
                        '.dropdown-backdrop elem should be added to the dom'
                    );
                    equal($._data($backdrop[0], 'events').click[0].namespace, 'data-api.dropdown.wdesk',
                        'click event should be registered on .dropdown.backdrop');
                    ok(existsInArray('data-api.dropdown.wdesk', getClickEventNamespaceList(document)),
                        'click event should be registered on document');

                    $backdrop.click();
                })
                .on('hidden.wdesk.dropdown', function (e) {
                    var $backdrop = $('#qunit-fixture').find('.dropdown-backdrop');

                    equal(openDropdownCount(), 0,
                        'all dropdown menus should be closed'
                    );
                    equal($backdrop.length, 0,
                        '.dropdown-backdrop elem should be removed from the dom');
                    ok(!existsInArray('data-api.dropdown.wdesk', getClickEventNamespaceList(document)),
                        'click event should be registered on document');

                    start();
                });

            this.ddMenuBtn.click();
        });

        test('should not add a dropdown-backdrop elem to DOM on non-touch devices', function () {
            var that = this;

            that.ddMenuBtn.click();
            var $backdrop = $('#qunit-fixture').find('.dropdown-backdrop');

            equal(openDropdownCount(), 1,
                'a dropdown menu should be open'
            );
            equal($backdrop.length, 0,
                '.dropdown-backdrop elem should not be present in non-touch device dom'
            );
        });

        test('should not open dropdown via data-api if target is disabled', function () {
            // disabled attribute
            var $disabledAttrBtn = this.ddMenuBtn.prop('disabled', true);
            $disabledAttrBtn.click();
            equal(openDropdownCount(), 0,
                'no dropdown menus should be open'
            );

            // .disabled css class
            var $disabledClassBtn = this.ddMenuBtn2.addClass('disabled');
            $disabledClassBtn.click();
            equal(openDropdownCount(), 0,
                'no dropdown menus should be open'
            );
        });

        test('should test if data-api element has a #name before assuming it\'s a selector', function () {
            var fooTarget = '<a href="/foo/" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</a>';
            var hashTarget = '<a href="#" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</a>';

            var $ddFoo = $(buildDropdownHTML(fooTarget, 'ddFoo')).appendTo('.tabs')
                .find('[data-toggle=dropdown]').dropdown().click();
            equal($ddFoo.parent('.dropdown').attr('class'), 'dropdown open',
                'open class should be added on /foo/ click'
            );

            var $ddHash = $(buildDropdownHTML(hashTarget, 'ddHash')).appendTo('.tabs')
                .find('[data-toggle=dropdown]').dropdown().click();
            equal($ddHash.parent('.dropdown').attr('class'), 'dropdown open',
                'open class should be added on # click'
            );
        });


    // DOM - PERSISTENCE
    // -------------------------
        module('dropdown-dom-persistent', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                $('<ul class="tabs"></ul>').appendTo('#qunit-fixture');

                var target = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown">Dropdown</button>';
                var targetPersist = '<button class="btn dropdown-toggle" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-persistent="true">Dropdown</button>';
                $(buildDropdownHTML(target, 'ddMenu1')).appendTo('.tabs');
                $(buildDropdownHTML(targetPersist, 'ddMenu2')).appendTo('.tabs');

                this.dd  = $('#ddMenu1');
                this.ddPersist = $('#ddMenu2');

                this.ddMenu  = this.dd.find('> .dropdown-menu');
                this.ddMenuPersist = this.ddPersist.find('> .dropdown-menu');

                this.ddMenuBtn  = this.dd.find('> [data-toggle="dropdown"]');
                this.ddMenuBtnPersist = this.ddPersist.find('> [data-toggle="dropdown"]');

                $('[data-persistent=true]', document).dropdown(); // only instantiate the data-persistent example on init
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
                this.ddMenu = null;
                this.ddMenuPersist = null;
                this.dd = null;
                this.ddPersist = null;
                this.ddMenuBtn = null;
                this.ddMenuBtnPersist = null;

                $(document).off('click.wdesk.dropdown.data-api');
            }
        });

        test('should be able to create a persistent dropdown via data-api and js api', function() {
            equal(this.ddMenuBtnPersist.data('wdesk.dropdown').options.persistent, true,
                'dropdown can be made persistent via data-api');

            this.ddMenuBtn.dropdown({ persistent: true });
            equal(this.ddMenuBtn.data('wdesk.dropdown').options.persistent, true,
                'dropdown can be made persistent via js api');
        });

        test('should add and remove open class to persistent dropdown when toggled', function() {
            this.ddMenuBtnPersist.click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );

            this.ddMenuBtnPersist.click();
            equal(this.ddPersist.attr('class'), 'dropdown',
                'open class should be removed from parent .dropdown elem'
            );
        });

        test('should not close persistent dropdown when document is clicked', function() {
            this.ddMenuBtnPersist.click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );

            $(document).click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should remain on parent .dropdown elem when document is clicked'
            );
        });

        test('should not close persistent dropdown when another dropdown is opened', function() {
            this.ddMenuBtn.dropdown(); // add another non-persistent dropdown to the test

            this.ddMenuBtnPersist.click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should be added to parent .dropdown elem'
            );

            this.ddMenuBtn.click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should remain on parent .dropdown elem when another dropdown is opened'
            );
            equal(openDropdownCount(), 2,
                'two dropdowns should be open'
            );

            $(document).click();
            equal(this.ddPersist.attr('class'), 'dropdown open',
                'open class should remain on parent .dropdown elem when document is clicked'
            );
            equal(openDropdownCount(), 1,
                'only the persistent dropdown should be open'
            );
        });

        test('should close all open dropdowns when persistent dropdown is toggled', function() {
            this.ddMenuBtn.dropdown(); // add another non-persistent dropdown to the test

            // get two dropdowns open at the same time
            this.ddMenuBtnPersist.click();
            this.ddMenuBtn.click();
            equal(openDropdownCount(), 2,
                'two dropdowns should be open'
            );


            this.ddMenuBtnPersist.click();
            equal(this.ddPersist.attr('class'), 'dropdown',
                'open class should be removed from persistent dropdown parent elem'
            );
            equal(this.dd.attr('class'), 'dropdown',
                'open class should be removed from non-persistent dropdown parent elem'
            );
            equal(openDropdownCount(), 0,
                'all dropdowns should be closed'
            );
        });
});