$(function () {

    /* global Chosen */
    /* jshint phantom: true, indent: false */


    // UTILITIES
    // -------------------------

        var chosenDom = {
            single: '<select class="chosen" data-placeholder="Select an Option"><option disabled selected>Custom Placeholder Text</option><option value="1">First</option><option value="2">Second</option><option value="3">Third</option></select>'
          , multi:  '<select multiple class="chosen" data-placeholder="Select Some Options"><option value="1">First</option><option value="2">Second</option><option value="3">Third</option></select>'
          , empty: {
                single: '<select class="chosen" data-placeholder="Select an Option"><option disabled selected>Custom Placeholder Text</option><option value="1"></option><option value="2"></option><option value="3"></option></select>'
              , multi:  '<select multiple class="chosen" data-placeholder="Select Some Options"><option value="1"></option><option value="2"></option><option value="3"></option></select>'
            }
          , disabled: {
                single: '<select disabled class="chosen" data-placeholder="Select an Option"><option disabled selected>Custom Placeholder Text</option><option value="1">First</option><option value="2">Second</option><option value="3">Third</option></select>'
              , multi:  '<select disabled multiple class="chosen" data-placeholder="Select Some Options"><option value="1">First</option><option value="2">Second</option><option value="3">Third</option></select>'
          }
        };

        var chosenTemplateDom = {
            single: '<a class="chosen-single chosen-default btn dropdown-toggle" tabindex="-1"><span>Custom Placeholder Text</span><b class="caret"></b></a><div class="chosen-drop dropdown-menu"><div class="chosen-search"><input type="text" autocomplete="off" class="form-control input-sm" readonly=""></div><ul class="chosen-results"></ul></div>'
          , multi: '<ul class="chosen-choices"><li class="search-field"><input type="text" value="Select Some Options" class="form-control default" autocomplete="off" style="width: 11px; "></li></ul><div class="chosen-drop dropdown-menu"><ul class="chosen-results"></ul></div>'
        };

        var cleanupChosenTest = function () {
            // clean up after each test
            $('#qunit-fixture').empty();

            var $chosenElems = $('[class*=chosen]');
            $.each($chosenElems, function () {
                $(this).remove();
            });
        };


    // BASE
    // -------------------------
        module('chosen-base', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.$chosen = {
                    single: $(chosenDom.single).appendTo('#qunit-fixture')
                  , multi: $(chosenDom.multi).appendTo('#qunit-fixture')
                  , empty: {
                        single: $(chosenDom.empty.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.empty.multi).appendTo('#qunit-fixture')
                    }
                  , disabled: {
                        single: $(chosenDom.disabled.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.disabled.multi).appendTo('#qunit-fixture')
                    }
                };
            },
            teardown: function () {
                cleanupChosenTest();

                this.$chosen = null;
            }
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).chosen,
                'chosen method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal(this.$chosen.single.chosen(), this.$chosen.single,
                'element bound to chosen method was not returned'
            );
        });

        test('should expose core prototype methods', function () {
            ok(!!$.fn.chosen.Constructor.prototype,
                'prototype methods should be defined'
            );
        });

        test('should set plugin defaults', function () {
            this.$chosen.single.chosen();

            var DEFAULTS = this.$chosen.single.data('chosen');

            equal(DEFAULTS.active_field,                false,      'Chosen.DEFAULTS.active_field');
            equal(DEFAULTS.mouse_on_container,          false,      'Chosen.DEFAULTS.mouse_on_container');
            equal(DEFAULTS.results_showing,             false,      'Chosen.DEFAULTS.results_showing');
            equal(DEFAULTS.result_highlighted,          null,       'Chosen.DEFAULTS.result_highlighted');
            equal(DEFAULTS.allow_single_deselect,       false,      'Chosen.DEFAULTS.allow_single_deselect');
            equal(DEFAULTS.disable_search_threshold,    5,          'Chosen.DEFAULTS.disable_search_threshold');
            equal(DEFAULTS.disable_search,              false,      'Chosen.DEFAULTS.disable_search');
            equal(DEFAULTS.enable_split_word_search,    true,       'Chosen.DEFAULTS.enable_split_word_search');
            equal(DEFAULTS.group_search,                true,       'Chosen.DEFAULTS.group_search');
            equal(DEFAULTS.search_contains,             false,      'Chosen.DEFAULTS.search_contains');
            equal(DEFAULTS.single_backstroke_delete,    true,       'Chosen.DEFAULTS.single_backstroke_delete');
            equal(DEFAULTS.max_selected_options,        Infinity,   'Chosen.DEFAULTS.max_selected_options');
            equal(DEFAULTS.inherit_select_classes,      false,      'Chosen.DEFAULTS.inherit_select_classes');
            equal(DEFAULTS.display_selected_options,    true,       'Chosen.DEFAULTS.display_selected_options');
            equal(DEFAULTS.display_disabled_options,    true,       'Chosen.DEFAULTS.display_disabled_options');
        });

        test('should convert select `<option>` elems into a matching data array', function () {
            this.$chosen.single.chosen();

            var options = [];

            $.each(this.$chosen.single.find('option'), function () {
                options.push($(this));
            });

            var optionsMarkup = {
                first: {
                    value: options[0].val().toString()
                  , text:  options[0].text()
                }
              , second: {
                    value: options[1].val().toString()
                  , text:  options[1].text()
                }
              , third: {
                    value: options[2].val().toString()
                  , text:  options[2].text()
                }
            };

            var data = this.$chosen.single.data('chosen');

            equal(data.results_count, data.results_data.length,
                'data.result_count should equal data.results_data.length'
            );
            equal(data.results_data.length, options.length,
                'data.results_data.length should equal the number of `<option>` elems within the converted `<select>` elem'
            );
            deepEqual(data.results_data[0].text,  optionsMarkup.first.text);
            deepEqual(data.results_data[0].value, optionsMarkup.first.value);
            deepEqual(data.results_data[1].text,  optionsMarkup.second.text);
            deepEqual(data.results_data[1].value, optionsMarkup.second.value);
            deepEqual(data.results_data[2].text,  optionsMarkup.third.text);
            deepEqual(data.results_data[2].value, optionsMarkup.third.value);
        });


    // ACCESSIBILITY
    // -------------------------
        module('chosen-accessibility', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.$chosen = {
                    single: $(chosenDom.single).appendTo('#qunit-fixture')
                };
            },
            teardown: function () {
                cleanupChosenTest();

                this.$chosen = null;
            }
        });

        test('should add `aria-hidden=true` to the chosen container for WCAG compliance', function () {
            this.$chosen.single.chosen();

            equal($('.chosen-container').attr('aria-hidden'), 'true',
                'Chosen container should be hidden from screen readers'
            );
        });

        test('should add/remove `sr-only` CSS class to the `select` elem for WCAG compliance', function () {
            this.$chosen.single.chosen();

            ok($('.chosen-container').length, 'Chosen container should be present');
            ok($('.chosen').hasClass('sr-only'), 'Select elem should have `sr-only` CSS class');

            this.$chosen.single.chosen('destroy');

            ok(! $('.chosen-container').length, 'Chosen container should be removed');
            ok(! $('.chosen').hasClass('sr-only'), 'Select elem should not have `sr-only` CSS class');
        });


    // DOM MANIPULATION
    // -------------------------
        module('chosen-dom', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.$chosen = {
                    single: $(chosenDom.single).appendTo('#qunit-fixture')
                  , multi: $(chosenDom.multi).appendTo('#qunit-fixture')
                  , empty: {
                        single: $(chosenDom.empty.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.empty.multi).appendTo('#qunit-fixture')
                    }
                  , disabled: {
                        single: $(chosenDom.disabled.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.disabled.multi).appendTo('#qunit-fixture')
                    }
                };
            },
            teardown: function () {
                cleanupChosenTest();

                this.$chosen = null;
            }
        });

        test('should have global `form-control` CSS class on the chosen container', function () {
            var $chosenSingle = this.$chosen.single,
                $chosenMulti  = this.$chosen.multi;

            $chosenSingle.chosen();
            $chosenMulti.chosen();

            ok($('.chosen-container-single').hasClass('form-control'),
                'Chosen single container does not have `form-control` class'
            );
            ok($('.chosen-container-multi').hasClass('form-control'),
                'Chosen multi container does not have `form-control` class'
            );
        });

        test('should inherit select CSS classes when `inherit_select_classes` option is true', function () {
            var $chosenSingle = this.$chosen.single,
                $chosenMulti  = this.$chosen.multi,
                customClass   = 'foobar';

            $chosenSingle.addClass(customClass).chosen({inherit_select_classes: true});
            $chosenMulti.addClass(customClass).chosen({inherit_select_classes: true});

            ok($('.chosen-container-single').hasClass(customClass),
                'Chosen single container did not inherit custom css class from select elem'
            );
            ok($('.chosen-container-multi').hasClass(customClass),
                'Chosen multi container did not inherit custom css class from select elem'
            );
        });

        test('should convert select to specified HTML markup with expected option data', function () {
            this.$chosen.empty.single.chosen();

            var data = this.$chosen.empty.single.data('chosen');

            equal(data.is_multiple, false,
                'Should not indicate that a multiple select was converted'
            );
            equal(data.is_disabled, false,
                'Should not indicate that a disabled select was converted'
            );
            // deepEqual(data.form_field.nextSibling.innerHTML, chosenTemplateDom.single,
            //     '`single` chosen HTML dom markup is incorrect'
            // );
        });

        test('should convert multi select to specified HTML markup with expected option data', function () {
            this.$chosen.empty.multi.chosen();

            var data = this.$chosen.empty.multi.data('chosen');

            equal(data.is_multiple, true,
                'Should indicate that a multiple select was converted'
            );
            equal(data.is_disabled, false,
                'Should not indicate that a disabled select was converted'
            );
            // deepEqual(data.form_field.nextSibling.innerHTML, chosenTemplateDom.multi,
            //     '`multi` chosen HTML dom markup is incorrect'
            // );
        });

        test('should convert a disabled select to disabled chosen HTML markup with expected option data', function () {
            this.$chosen.disabled.single.chosen();

            var data = this.$chosen.disabled.single.data('chosen');

            equal(data.is_disabled, true,
                'Should indicate that a disabled select was converted'
            );
            ok($('.chosen-container').hasClass('chosen-disabled'),
                '.chosen-disabled CSS class should be present on chosen container'
            );
            ok($('.chosen-container').hasClass('disabled'),
                '.disabled CSS class should be present on chosen container'
            );
        });


    // DATA-API
    // -------------------------
        module('chosen-data-api', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.$chosen = {
                    single: $(chosenDom.single).appendTo('#qunit-fixture')
                  , multi: $(chosenDom.multi).appendTo('#qunit-fixture')
                  , empty: {
                        single: $(chosenDom.empty.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.empty.multi).appendTo('#qunit-fixture')
                    }
                  , disabled: {
                        single: $(chosenDom.disabled.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.disabled.multi).appendTo('#qunit-fixture')
                    }
                };
            },
            teardown: function () {
                cleanupChosenTest();

                this.$chosen = null;
            }
        });

        test('should activate chosen field on mousedown', function () {
            this.$chosen.single.chosen();

            var data = this.$chosen.single.data('chosen');
            var $chosenContainer = $('.chosen-container');

            ok(!data.active_field, 'field should be inactive initially');

            $chosenContainer.trigger({
                type: 'mousedown',
                which: 1
            });

            ok($chosenContainer.hasClass('chosen-container-active'),
                '.chosen-container-active css class should be added on activation of chosen element'
            );
            ok(data.active_field,
                'chosen elem data should reflect the active state of the chosen field'
            );
        });

        test('should not activate chosen field on mousedown if it\'s a right (context) click', function () {
            this.$chosen.single.chosen();

            var data = this.$chosen.single.data('chosen');
            var $chosenContainer = $('.chosen-container');

            ok(!data.active_field, 'field should be inactive initially');

            $chosenContainer.trigger({
                type: 'mousedown',
                which: 3
            });

            ok(!$chosenContainer.hasClass('chosen-container-active'),
                '.chosen-container-active css class should not be added when chosen container is right-clicked'
            );
            ok(!data.active_field,
                'chosen elem data should reflect the inactive state of the chosen field'
            );
        });

        test('should select option on mousedown unless it\'s a right (context) click', 4, function () {
            this.$chosen.single.chosen();

            var data = this.$chosen.single.data('chosen');
            var $chosenContainer = $('.chosen-container');
            var $chosenResults = $chosenContainer.find('.chosen-results');
            var selectedIndex = 2;
            var rtClickSelectedIndex = 3;

            equal(data.current_selectedIndex, 0,
                'no options should be selected initially'
            );

            // OPEN THE CHOSEN CONTAINER
            $chosenContainer.trigger({
                type: 'mousedown',
                which: 1
            });

            // LEFT CLICK TEST
            var $selectThis = $chosenResults.find('li:eq(' + selectedIndex + ')');
            $selectThis
                .addClass('active-result')
                .data('option-array-index', selectedIndex + 1);

            $chosenResults
                .one('mouseup', function (e) {
                    equal(data.current_selectedIndex, selectedIndex,
                        'current_selectedIndex should match index of option selected'
                    );
                })
                .trigger({
                    target: $selectThis[0],
                    type: 'mouseup',
                    which: 1
                });


            // RIGHT CLICK TEST
            var $rtClickThis = $chosenResults.find('li:eq(' + rtClickSelectedIndex + ')');
            $rtClickThis
                .addClass('active-result')
                .data('option-array-index', rtClickSelectedIndex + 1);

            $chosenResults
                .one('mouseup', function (e) {
                    notEqual(data.current_selectedIndex, rtClickSelectedIndex,
                        'current_selectedIndex should not change on right click of another option'
                    );
                })
                .trigger({
                    target: $rtClickThis[0],
                    type: 'mouseup',
                    which: 3
                });
        });

        test('should select multiple options on mousedown unless it\'s a right (context) click', 5, function () {
            this.$chosen.multi.chosen();

            var data = this.$chosen.multi.data('chosen');
            var $chosenContainer = $('.chosen-container');
            var $chosenResults = $chosenContainer.find('.chosen-results');
            var firstSelectedIndex = 1;
            var secondSelectedIndex = 2;
            var rtClickSelectedIndex = 3;

            equal(data.current_selectedIndex, -1,
                'no options should be selected initially'
            );

            // OPEN THE CHOSEN CONTAINER
            $chosenContainer.trigger({
                type: 'mousedown',
                which: 1
            });

            // LEFT CLICK TEST #1
            var $selectThisFirst = $chosenResults.find('li:eq(' + firstSelectedIndex + ')');
            $selectThisFirst
                .addClass('active-result')
                .data('option-array-index', firstSelectedIndex + 1);

            $chosenResults
                .one('mouseup', function (e) {
                    equal(data.selected_option_count, firstSelectedIndex,
                        'current_selectedIndex should match index of option selected'
                    );
                })
                .trigger({
                    target: $selectThisFirst[0],
                    type: 'mouseup',
                    which: 1
                });

            // LEFT CLICK TEST #2
            var $selectThisSecond = $chosenResults.find('li:eq(' + secondSelectedIndex + ')');
            $selectThisSecond
                .addClass('active-result')
                .data('option-array-index', secondSelectedIndex + 1);

            $chosenResults
                .one('mouseup', function (e) {
                    equal(data.selected_option_count, secondSelectedIndex,
                        'current_selectedIndex should match index of option selected'
                    );
                })
                .trigger({
                    target: $selectThisSecond[0],
                    type: 'mouseup',
                    which: 1
                });


            // RIGHT CLICK TEST
            var $rtClickThis = $chosenResults.find('li:eq(' + rtClickSelectedIndex + ')');
            $rtClickThis
                .addClass('active-result')
                .data('option-array-index', rtClickSelectedIndex + 1);

            $chosenResults
                .one('mouseup', function (e) {
                    notEqual(data.current_selectedIndex, rtClickSelectedIndex,
                        'current_selectedIndex should not change on right click of another option'
                    );
                })
                .trigger({
                    target: $rtClickThis[0],
                    type: 'mouseup',
                    which: 3
                });
        });


    // EVENTS
    // -------------------------
        module('chosen-events', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.$chosen = {
                    single: $(chosenDom.single).appendTo('#qunit-fixture')
                  , multi: $(chosenDom.multi).appendTo('#qunit-fixture')
                  , empty: {
                        single: $(chosenDom.empty.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.empty.multi).appendTo('#qunit-fixture')
                    }
                  , disabled: {
                        single: $(chosenDom.disabled.single).appendTo('#qunit-fixture')
                      , multi:  $(chosenDom.disabled.multi).appendTo('#qunit-fixture')
                    }
                };
            },
            teardown: function () {
                cleanupChosenTest();

                this.$chosen = null;
            }
        });

        test('should fire chosen:ready when select is converted to a chosen element', function () {
            var readyFired = 0;

            this.$chosen.single
                .on('chosen:ready', function (e) {
                    readyFired++;
                })
                .chosen();

            equal(readyFired, 1,
                'chosen:ready should have been emitted when select element was converted'
            );
        });

        test('should fire chosen:showing_dropdown event', 3, function () {
            var showingDropdownFired = 0;

            this.$chosen.single.chosen();

            var data = this.$chosen.single.data('chosen');

            equal(data.results_showing, false,
                'dropdown should be hidden initially'
            );

            this.$chosen.single
                .on('chosen:showing_dropdown', function () {
                    showingDropdownFired++;
                })
                .trigger('chosen:open.chosen');

            equal(showingDropdownFired, 1,
                'chosen:showing_dropdown should have been emitted when results are shown'
            );
        });

        test('should open dropdown menu when chosen elements are focused', function () {
            this.$chosen.single.chosen();

            var data = this.$chosen.single.data('chosen');

            equal(data.results_showing, false,
                'dropdown should be hidden initially'
            );

            this.$chosen.single.trigger('chosen:open.chosen');

            ok($('.chosen-container').hasClass('open'),
                'dropdown should get .open css class when single chosen elem is clicked'
            );
            equal(data.results_showing, true,
                'chosen elem data should reflect the open state of the dropdown'
            );
        });

        test('should not open dropdown menu if there are no choices to be selected initially', function () {
            var allSelectedFired = 0,
                showingDropdownFired = 0;

            this.$chosen.multi
                .empty()
                .on('chosen:showing_dropdown', function (e) {
                    showingDropdownFired++;
                })
                .on('chosen:allselected', function (e) {
                    allSelectedFired++;
                })
                .chosen()
                .trigger('chosen:open.chosen');

            var data = this.$chosen.multi.data('chosen');

            equal(data.is_multiple, true,
                'Should indicate that a multiple select was converted'
            );
            equal(data.no_remaining_results, true,
                'chosen data should reflect that no options are available for selection'
            );
            equal(allSelectedFired, 1,
                'chosen:allselected should have emitted'
            );
            equal(showingDropdownFired, 0,
                'chosen:showing_dropdown should not have been emitted'
            );
        });

        test('should not open dropdown menu if there are no choices to be selected after all others are selected', function () {
            var allSelectedFired = 0,
                showingDropdownFired = 0;

            var $multiSelect = $('<select multiple class="chosen" data-placeholder="Select Some Options"><option value="1">1</option></select>')
                .appendTo('#qunit-fixture')
                .chosen()
                .on('chosen:showing_dropdown', function (e) {
                    showingDropdownFired++;
                })
                .on('chosen:allselected', function (e) {
                    allSelectedFired++;
                });

            var data = $multiSelect.data('chosen');

            equal(data.is_multiple, true,
                'Should indicate that a multiple select was converted'
            );
            equal(data.no_remaining_results, undefined,
                'chosen data should reflect that there are still options available for selection'
            );

            $multiSelect
                .val('1')
                .find('option[value="1"]').prop('selected', true)
                .trigger('chosen:updated');

            $multiSelect.trigger('chosen:open.chosen');

            equal(data.no_remaining_results, true,
                'chosen data should reflect that no options are available for selection'
            );
            equal(allSelectedFired, 1,
                'chosen:allselected should have emitted'
            );
            equal(showingDropdownFired, 0,
                'chosen:showing_dropdown should not have been emitted'
            );
        });

        test('should re-instate current value of search input after triggering chosen:updated', function () {
            var $multiSelect = $('<select multiple class="chosen" data-placeholder="Select Some Options"><option value="1">1</option></select>')
                .appendTo('#qunit-fixture')
                .chosen();

            var $searchField = $('.chosen-container').find('input');

            $searchField.one('keyup', function () {
                $multiSelect.append('<option>2</option>');
                $multiSelect.append('<option>3</option>');
                $multiSelect.append('<option>4</option>');
                $multiSelect.append('<option>5</option>');
                $multiSelect.append('<option>6</option>');

                $multiSelect.trigger('chosen:updated');
            });

            $searchField.val('foo').trigger('keyup');

            equal($searchField.val(), 'foo',
                'the search field should have its original value after chosen:updated is triggered'
            );
            equal($multiSelect.find('option').length, 6);
        });
});