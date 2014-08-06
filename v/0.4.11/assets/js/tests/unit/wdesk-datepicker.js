$(function () {

    /* global window, patch_date, Datepicker, UTCDate, UTCToday */
    /* jshint node: true, phantom: true, indent: false */

    // BASE
    // -------------------------
        module('datepicker-base', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
            },
            teardown: function () {
                // clean up after each test
                $('#qunit-fixture').empty();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('should provide no conflict', function () {
            var datepicker = $.fn.datepicker.noConflict();
            ok(!$.fn.datepicker, 'datepicker was set back to undefined (org value)');
            $.fn.datepicker = datepicker;
        });

        test('starts after calling noConflict() (no undefined defaults or locale_opts)', function () {
            var datepicker = $.fn.datepicker.noConflict();
            $.fn.otherDP = datepicker;

            $('<div class="input-group date" id="datepicker">'+
                '<input size="16" type="text" value="12-02-2012" readonly>'+
                '<span class="input-group-addon"><i class="icon icon-calendar"></i></span>'+
                '</div>')
                .appendTo('#qunit-fixture')
                .otherDP();

            expect(1);

            $.fn.datepicker = $.fn.otherDP;
            delete $.fn.otherDP;
        });

        test('should be defined on jquery object', function () {
            var $input = $('<input>');
            ok($input.datepicker, 'datepicker method is defined');
        });

        test('should return element', function () {
            var $input = $('<input>');
            ok($input.datepicker() == $input, 'matching element returned');
        });

        test('should expose default settings', function () {
            ok(!!$.fn.datepicker.defaults, 'defaults are defined');
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.datepicker.defaults;

            equal(DEFAULTS.autoclose, true,
                'Datepicker.DEFAULTS.autoclose == true'
            );
            equal(DEFAULTS.beforeShowDay, $.noop,
                'Datepicker.DEFAULTS.beforeShowDay == $.noop'
            );
            equal(DEFAULTS.calendarWeeks, false,
                'Datepicker.DEFAULTS.calendarWeeks == false'
            );
            equal(DEFAULTS.clearBtn, false,
                'Datepicker.DEFAULTS.clearBtn == false'
            );
            deepEqual(DEFAULTS.daysOfWeekDisabled, [],
                'Datepicker.DEFAULTS.daysOfWeekDisabled == []'
            );
            equal(DEFAULTS.endDate, Infinity,
                'Datepicker.DEFAULTS.endDate == Infinity'
            );
            equal(DEFAULTS.forceParse, true,
                'Datepicker.DEFAULTS.forceParse == true'
            );
            equal(DEFAULTS.format, 'mm/dd/yyyy',
                'Datepicker.DEFAULTS.format == "mm/dd/yyyy"'
            );
            equal(DEFAULTS.keyboardNavigation, true,
                'Datepicker.DEFAULTS.keyboardNavigation == true'
            );
            equal(DEFAULTS.language, 'en',
                'Datepicker.DEFAULTS.language == "en"'
            );
            equal(DEFAULTS.minViewMode, 0,
                'Datepicker.DEFAULTS.minViewMode == 0'
            );
            equal(DEFAULTS.orientation, 'auto',
                'Datepicker.DEFAULTS.orientation == "auto"'
            );
            equal(DEFAULTS.rtl, false,
                'Datepicker.DEFAULTS.rtl == false'
            );
            equal(DEFAULTS.startDate, -Infinity,
                'Datepicker.DEFAULTS.startDate == -Infinity'
            );
            equal(DEFAULTS.startView, 0,
                'Datepicker.DEFAULTS.startView == 0'
            );
            equal(DEFAULTS.todayBtn, false,
                'Datepicker.DEFAULTS.todayBtn == false'
            );
            equal(DEFAULTS.todayHighlight, true,
                'Datepicker.DEFAULTS.todayHighlight == true'
            );
            equal(DEFAULTS.weekStart, 0,
                'Datepicker.DEFAULTS.weekStart == 0'
            );
        });

        test('should set en date defaults', function () {
            var DATES = $.fn.datepicker.dates.en;

            deepEqual(DATES.days,
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'Datepicker.DATES.days'
            );
            deepEqual(DATES.daysShort,
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                'Datepicker.DATES.daysShort'
            );
            deepEqual(DATES.daysMin,
                ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                'Datepicker.DATES.daysMin'
            );
            deepEqual(DATES.months,
                ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                'Datepicker.DATES.months'
            );
            deepEqual(DATES.monthsShort,
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'Datepicker.DATES.monthsShort'
            );
            equal(DATES.today, 'Today', 'Datepicker.DATES.today == "Today"');
            equal(DATES.clear, 'Clear', 'Datepicker.DATES.clear == "Clear"');
        });


    // EVENTS
    // -------------------------
        module('datepicker-events', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.component = null;
                this.input = $('<input type="text" value="31-03-2011">')
                                .appendTo('#qunit-fixture')
                                .datepicker({format: 'dd-mm-yyyy'})
                                .focus(); // Activate for visibility checks
                this.dp = this.input.data('wdesk.datepicker');
                this.picker = this.dp.picker;
            },
            teardown: function () {
                this.picker && this.picker.remove();
                this.input && this.input.remove();
                this.component && this.component.remove();

                $('#qunit-fixture').empty();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('Focusing the input triggers show.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input =
                $('<input type="text" value="31-03-2011">')
                    .appendTo('#qunit-fixture')
                    .datepicker({
                        format: 'dd-mm-yyyy'
                    });
            this.dp = this.input.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            this.input.on('show.wdesk.datepicker', function () {
                triggered++;
            });
            equal(triggered, 0, 'show.wdesk.datepicker has never been triggered');
            ok(!this.picker.is(':visible'), 'Date picker is hidden initially');

            this.input.focus();
            equal(triggered, 1, 'show.wdesk.datepicker was triggered');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.input.hasClass('focus'), 'Input has focus class');
        });

        test('Clicking the component triggers show.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            var componentDOM =
                '<div class="input-group date" id="datepicker">'+
                    '<input size="16" type="text" value="12-02-2012" readonly>'+
                    '<span class="input-group-addon"><i class="icon icon-calendar"></i></span>'+
                '</div>';
            this.component =
                $(componentDOM)
                    .appendTo('#qunit-fixture')
                    .datepicker({format: 'dd-mm-yyyy'});
            this.input = this.component.find('input');
            this.addon = this.component.find('.input-group-addon');
            this.dp = this.component.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            this.component.on('show.wdesk.datepicker', function () {
                triggered++;
            });
            equal(triggered, 0, 'show.wdesk.datepicker has never been triggered');
            ok(!this.picker.is(':visible'), 'Date picker is hidden initially');

            this.addon.trigger('click');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.input.hasClass('focus'), 'Input has focus class');
        });

        test('Hiding the picker triggers hide.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input.on('hide.wdesk.datepicker', function () {
                triggered++;
            });
            equal(triggered, 0, 'hide.wdesk.datepicker has never been triggered');

            $(document).trigger('mousedown');
            equal(triggered, 1, 'hide.wdesk.datepicker was triggered');
        });

        test('Selecting a year from decade view triggers changeYear.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input.on('changeYear.wdesk.datepicker', function () {
                triggered++;
            });
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'),
                'Month picker is visible'
            );
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            target = this.picker.find('.datepicker-months thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-years').is(':visible'),
                'Year picker is visible'
            );
            equal(this.dp.viewMode, 2);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Change years to test internal state changes
            target = this.picker.find('.datepicker-years tbody span:contains(2010)');
            target.click();
            equal(this.dp.viewMode, 1);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2010, 2, 1));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));
            equal(triggered, 1);
        });

        test('Navigating forward/backward from month view triggers changeYear.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input.on('changeYear.wdesk.datepicker', function () {
                triggered++;
            });
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'),
                'Month picker is visible'
            );
            equal(this.dp.viewMode, 1);

            target = this.picker.find('.datepicker-months thead th.prev');
            ok(target.is(':visible'), 'Prev switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'),
                'Month picker is visible'
            );
            equal(triggered, 1);

            target = this.picker.find('.datepicker-months thead th.next');
            ok(target.is(':visible'), 'Next switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'),
                'Month picker is visible'
            );
            equal(triggered, 2);
        });

        test('Selecting a month from year view triggers changeMonth.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input.on('changeMonth.wdesk.datepicker', function () {
                triggered++;
            });

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'),
                'Month picker is visible'
            );
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            target = this.picker.find('.datepicker-months tbody span:contains(Apr)');
            target.click();
            equal(this.dp.viewMode, 0);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 3, 1));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));
            equal(triggered, 1);
        });

        test('Navigating forward/backward from month view triggers changeMonth.wdesk.datepicker', function () {
            var target,
                triggered = 0;

            this.input.on('changeMonth.wdesk.datepicker', function () {
                triggered++;
            });

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.prev');
            ok(target.is(':visible'), 'Prev switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-days').is(':visible'),
                'Day picker is visible'
            );
            equal(triggered, 1);

            target = this.picker.find('.datepicker-days thead th.next');
            ok(target.is(':visible'), 'Next switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-days').is(':visible'),
                'Day picker is visible'
            );
            equal(triggered, 2);
        });

        test('Event format() returns a formatted date string', function () {
            var target,
                error, out;

            this.input.on('changeDate.wdesk.datepicker', function (e) {
                try {
                    out = e.format();
                } catch (e) {
                    error = e;
                }
            });
            equal(this.dp.viewMode, 0);

            target = this.picker.find('.datepicker-days tbody td:nth(15)');
            target.click();
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 14));
            datesEqual(this.dp.date, UTCDate(2011, 2, 14));
            equal(error, undefined);
            equal(out, '14-03-2011');
        });

        test('Event format(altformat) returns a formatted date string', function () {
            var target,
                error, out;

            this.input.on('changeDate.wdesk.datepicker', function (e) {
                try {
                    out = e.format('m/d/yy');
                } catch (e) {
                    error = e;
                }
            });
            equal(this.dp.viewMode, 0);

            target = this.picker.find('.datepicker-days tbody td:nth(15)');
            target.click();
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 14));
            datesEqual(this.dp.date, UTCDate(2011, 2, 14));
            equal(error, undefined);
            equal(out, '3/14/11');
        });

        test('Clear button: triggers change and changeDate events', function () {
            var target,
                triggered_change = 0,
                triggered_changeDate = 0;

            this.input =
                $('<input type="text" value="31-03-2011">')
                    .appendTo('#qunit-fixture')
                    .datepicker({
                        format: 'dd-mm-yyyy',
                        clearBtn: true
                    })
                    .focus(); // Activate for visibility checks
            this.dp = this.input.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            this.input
                .on('changeDate.wdesk.datepicker', function () {
                    triggered_changeDate++;
                }).on('change', function () {
                    triggered_change++;
                })
                .focus();
            ok(this.picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(this.picker.find('.datepicker-days tfoot .clear').is(':visible'),
                'Clear button visible'
            );

            target = this.picker.find('.datepicker-days tfoot .clear');
            target.click();
            equal(triggered_change, 1);
            equal(triggered_changeDate, 1);

            stop();
            start();
        });


    // OPTIONS
    // -------------------------
        module('datepicker-options', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.input =
                    $('<input type="text" value="2012-03-05">')
                        .appendTo('#qunit-fixture');
            },
            teardown: function () {
                // clean up after each test
                this.input.remove();
                $('#qunit-fixture *').each(function () {
                    var t = $(this);
                    if ('wdesk.datepicker' in t.data())
                        t.datepicker('remove');
                });
                $('#qunit-fixture').empty();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('Autoclose', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true
            });
            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.is(':visible'), 'Picker is visible');
            ok($(document.body).hasClass('modal-open'), 'body scroll is disabled');

            target = picker.find('.datepicker-days tbody td:nth(7)');
            equal(target.text(), '4'); // Mar 4

            target.click();
            ok(picker.is(':not(:visible)'), 'Picker is hidden');
            ok(!$(document.body).hasClass('modal-open'), 'body scroll is re-enabled');
            datesEqual(dp.date, UTCDate(2012, 2, 4));
            datesEqual(dp.viewDate, UTCDate(2012, 2, 4));
        });

        test('Startview: year view (integer)', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                startView: 1
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':not(:visible)'),
                'Days view hidden'
            );
            ok(picker.find('.datepicker-months').is(':visible'),
                'Months view visible'
            );
            ok(picker.find('.datepicker-years').is(':not(:visible)'),
                'Years view hidden'
            );
        });

        test('Startview: year view (string)', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                startView: 'year'
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':not(:visible)'),
                'Days view hidden'
            );
            ok(picker.find('.datepicker-months').is(':visible'),
                'Months view visible'
            );
            ok(picker.find('.datepicker-years').is(':not(:visible)'),
                'Years view hidden'
            );
        });

        test('Startview: decade view (integer)', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                startView: 2
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':not(:visible)'),
                'Days view hidden'
            );
            ok(picker.find('.datepicker-months').is(':not(:visible)'),
                'Months view hidden'
            );
            ok(picker.find('.datepicker-years').is(':visible'),
                'Years view visible'
            );
        });

        test('Startview: decade view (string)', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                startView: 'decade'
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':not(:visible)'),
                'Days view hidden'
            );
            ok(picker.find('.datepicker-months').is(':not(:visible)'),
                'Months view hidden'
            );
            ok(picker.find('.datepicker-years').is(':visible'),
                'Years view visible'
            );
        });

        test('Today Button: today button visibility according to default', function () {
            var todayBtnVisibileByDefault = $.fn.datepicker.defaults.todayBtn;
            this.input.datepicker({
                format: 'yyyy-mm-dd'
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            if(todayBtnVisibileByDefault) {
                ok(picker.find('.datepicker-days tfoot .today').is(':visible'),
                    'Today button is visible'
                );
            } else {
                ok(picker.find('.datepicker-days tfoot .today').is(':not(:visible)'),
                    'Today button not visible'
                );
            }
        });

        test('Today Button: today visibility when disabled', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                todayBtn: false
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .today').is(':not(:visible)'),
                'Today button hidden'
            );

            picker.find('.datepicker-days thead th.datepicker-switch').click();
            ok(picker.find('.datepicker-months').is(':visible'),
                'Months view visible'
            );
            ok(picker.find('.datepicker-months tfoot .today').is(':not(:visible)'),
                'Today button hidden'
            );

            picker.find('.datepicker-months thead th.datepicker-switch').click();
            ok(picker.find('.datepicker-years').is(':visible'),
                'Years view visible'
            );
            ok(picker.find('.datepicker-years tfoot .today').is(':not(:visible)'),
                'Today button hidden'
            );
        });

        test('Today Button: data-api', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                todayBtn: true
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .today').is(':visible'),
                'Today button visible'
            );
        });

        test('Today Button: moves to today\'s date', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                todayBtn: true
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .today').is(':visible'),
                'Today button visible'
            );

            target = picker.find('.datepicker-days tfoot .today');
            target.click();
            var d = new Date(),
                today = UTCDate(d.getFullYear(), d.getMonth(), d.getDate());
            datesEqual(dp.viewDate, today);
            datesEqual(dp.date, UTCDate(2012, 2, 5));
        });

        test('Today Button: "linked" selects today\'s date', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                todayBtn: 'linked'
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .today').is(':visible'),
                'Today button visible'
            );

            target = picker.find('.datepicker-days tfoot .today');
            target.click();
            var d = new Date(),
                today = UTCDate(d.getFullYear(), d.getMonth(), d.getDate());
            datesEqual(dp.viewDate, today);
            datesEqual(dp.date, today);
        });

        test('Clear Button: clear visibility when enabled', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                clearBtn: true
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .clear').is(':visible'),
                'Clear button visible'
            );

            picker.find('.datepicker-days thead th.datepicker-switch').click();
            ok(picker.find('.datepicker-months').is(':visible'),
                'Months view visible'
            );
            ok(picker.find('.datepicker-months tfoot .clear').is(':visible'),
                'Clear button visible'
            );

            picker.find('.datepicker-months thead th.datepicker-switch').click();
            ok(picker.find('.datepicker-years').is(':visible'),
                'Years view visible'
            );
            ok(picker.find('.datepicker-years tfoot .clear').is(':visible'),
                'Clear button visible'
            );
        });

        test('Clear Button: clears input value', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                clearBtn: true
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .clear').is(':visible'),
                'Today button visible'
            );

            target = picker.find('.datepicker-days tfoot .clear');
            target.click();
            equal(this.input.val(),'','Input value has been cleared.');

            var pickerAutoCloseByDefault = $.fn.datepicker.defaults.autoclose;
            if(pickerAutoCloseByDefault) {
                ok(!picker.is(':visible'), 'Picker is hidden');
            } else {
                ok(picker.is(':visible'), 'Picker is visible');
            }
        });

        test('Clear Button: hides datepicker if autoclose is on', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                clearBtn: true,
                autoclose: true
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            ok(picker.find('.datepicker-days').is(':visible'),
                'Days view visible'
            );
            ok(picker.find('.datepicker-days tfoot .clear').is(':visible'),
                'Today button visible'
            );

            target = picker.find('.datepicker-days tfoot .clear');
            target.click();

            equal(this.input.val(), '', 'Input value has been cleared.');
            ok(picker.is(':not(:visible)'), 'Picker is hidden');
        });

        test('DaysOfWeekDisabled', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                daysOfWeekDisabled: '1,5'
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();
            target = picker.find('.datepicker-days tbody td:nth(22)');
            ok(target.hasClass('disabled'), 'Day of week is disabled');

            target = picker.find('.datepicker-days tbody td:nth(24)');
            ok(!target.hasClass('disabled'), 'Day of week is enabled');

            target = picker.find('.datepicker-days tbody td:nth(26)');
            ok(target.hasClass('disabled'), 'Day of week is disabled');
        });

        test('BeforeShowDay', function () {

            var beforeShowDay = function(date) {
                var dateTime =
                    UTCDate(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate()
                    ).getTime();
                var dateTime25th = UTCDate(2012, 9, 25).getTime();
                var dateTime26th = UTCDate(2012, 9, 26).getTime();
                var dateTime27th = UTCDate(2012, 9, 27).getTime();
                var dateTime28th = UTCDate(2012, 9, 28).getTime();

                if (dateTime == dateTime25th) {
                    return { tooltip: 'A tooltip' };
                } else if (dateTime == dateTime26th) {
                    return 'test26';
                } else if (dateTime == dateTime27th) {
                    return { enabled: false, classes:'test27' };
                } else if (dateTime == dateTime28th) {
                    return false;
                }
            };

            this.input
                .val('2012-10-26')
                .datepicker({
                    format: 'yyyy-mm-dd',
                    beforeShowDay: beforeShowDay
                });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();

            target = picker.find('.datepicker-days tbody td:nth(25)');
            equal(target.attr('title'), 'A tooltip', '25th has tooltip');
            ok(!target.hasClass('disabled'), '25th is enabled');

            target = picker.find('.datepicker-days tbody td:nth(26)');
            ok(target.hasClass('test26'), '26th has test26 class');
            ok(!target.hasClass('disabled'), '26th is enabled');

            target = picker.find('.datepicker-days tbody td:nth(27)');
            ok(target.hasClass('test27'), '27th has test27 class');
            ok(target.hasClass('disabled'), '27th is disabled');

            target = picker.find('.datepicker-days tbody td:nth(28)');
            ok(target.hasClass('disabled'), '28th is disabled');

            target = picker.find('.datepicker-days tbody td:nth(29)');
            ok(!target.hasClass('disabled'), '29th is enabled');
        });

        test('Orientation: values are parsed correctly', function () {

            this.input.datepicker({
                format: 'yyyy-mm-dd'
            });

            var dp = this.input.data('wdesk.datepicker');

            equal(dp.o.orientation.x, 'auto');
            equal(dp.o.orientation.y, 'auto');

            dp._process_options({orientation: ''});
            equal(dp.o.orientation.x, 'auto', 'Empty value');
            equal(dp.o.orientation.y, 'auto', 'Empty value');

            dp._process_options({orientation: 'left'});
            equal(dp.o.orientation.x, 'left', '"left"');
            equal(dp.o.orientation.y, 'auto', '"left"');

            dp._process_options({orientation: 'right'});
            equal(dp.o.orientation.x, 'right', '"right"');
            equal(dp.o.orientation.y, 'auto', '"right"');

            dp._process_options({orientation: 'top'});
            equal(dp.o.orientation.x, 'auto', '"top"');
            equal(dp.o.orientation.y, 'top', '"top"');

            dp._process_options({orientation: 'bottom'});
            equal(dp.o.orientation.x, 'auto', '"bottom"');
            equal(dp.o.orientation.y, 'bottom', '"bottom"');

            dp._process_options({orientation: 'left top'});
            equal(dp.o.orientation.x, 'left', '"left top"');
            equal(dp.o.orientation.y, 'top', '"left top"');

            dp._process_options({orientation: 'left bottom'});
            equal(dp.o.orientation.x, 'left', '"left bottom"');
            equal(dp.o.orientation.y, 'bottom', '"left bottom"');

            dp._process_options({orientation: 'right top'});
            equal(dp.o.orientation.x, 'right', '"right top"');
            equal(dp.o.orientation.y, 'top', '"right top"');

            dp._process_options({orientation: 'right bottom'});
            equal(dp.o.orientation.x, 'right', '"right bottom"');
            equal(dp.o.orientation.y, 'bottom', '"right bottom"');

            dp._process_options({orientation: 'left right'});
            equal(dp.o.orientation.x, 'left', '"left right"');
            equal(dp.o.orientation.y, 'auto', '"left right"');

            dp._process_options({orientation: 'right left'});
            equal(dp.o.orientation.x, 'right', '"right left"');
            equal(dp.o.orientation.y, 'auto', '"right left"');

            dp._process_options({orientation: 'top bottom'});
            equal(dp.o.orientation.x, 'auto', '"top bottom"');
            equal(dp.o.orientation.y, 'top', '"top bottom"');

            dp._process_options({orientation: 'bottom top'});
            equal(dp.o.orientation.x, 'auto', '"bottom top"');
            equal(dp.o.orientation.y, 'bottom', '"bottom top"');

            dp._process_options({orientation: 'foo bar'});
            equal(dp.o.orientation.x, 'auto', '"foo bar"');
            equal(dp.o.orientation.y, 'auto', '"foo bar"');

            dp._process_options({orientation: 'foo left'});
            equal(dp.o.orientation.x, 'left', '"foo left"');
            equal(dp.o.orientation.y, 'auto', '"foo left"');

            dp._process_options({orientation: 'top bar'});
            equal(dp.o.orientation.x, 'auto', '"top bar"');
            equal(dp.o.orientation.y, 'top', '"top bar"');
        });

        test('startDate', function () {
            this.input.datepicker({
                format: 'yyyy-mm-dd',
                startDate: new Date(2012, 9, 26)
            });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();

            target = picker.find('.datepicker-days tbody td:nth(25)');
            ok(target.hasClass('disabled'), 'Previous day is disabled');

            target = picker.find('.datepicker-days tbody td:nth(26)');
            ok(!target.hasClass('disabled'), 'Specified date is enabled');

            target = picker.find('.datepicker-days tbody td:nth(27)');
            ok(!target.hasClass('disabled'), 'Next day is enabled');
        });

        test('endDate', function () {
            this.input
                .val('2012-10-26')
                .datepicker({
                    format: 'yyyy-mm-dd',
                    endDate: new Date(2012, 9, 26)
                });

            var dp = this.input.data('wdesk.datepicker'),
                picker = dp.picker,
                target;

            this.input.focus();

            target = picker.find('.datepicker-days tbody td:nth(25)');
            ok(!target.hasClass('disabled'), 'Previous day is enabled');

            target = picker.find('.datepicker-days tbody td:nth(26)');
            ok(!target.hasClass('disabled'), 'Specified date is enabled');

            target = picker.find('.datepicker-days tbody td:nth(27)');
            ok(target.hasClass('disabled'), 'Next day is disabled');
        });


    // METHODS
    // -------------------------
        module('datepicker-methods', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.input =
                    $('<input type="text" value="2012-03-05">')
                        .appendTo('#qunit-fixture')
                        .datepicker({format: 'yyyy-mm-dd'});
                this.dp = this.input.data('wdesk.datepicker');

                this.findSelected = function (findStr) {
                    return this.dp.picker.find('.datepicker-days td' + findStr);
                };
            },
            teardown: function () {
                this.dp && this.dp.remove();

                $('#qunit-fixture').empty();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('update - String', function () {
            this.dp.update('2012-03-13');
            var date = this.findSelected(':contains(13)');

            datesEqual(this.dp.date, UTCDate(2012, 2, 13));
            ok(date.is('.active'), 'Date is selected');
        });

        test('update - Date', function () {
            this.dp.update(new Date(2012, 2, 13));
            var date = this.findSelected(':contains(13)');

            datesEqual(this.dp.date, UTCDate(2012, 2, 13));
            ok(date.is('.active'), 'Date is selected');
        });

        test('update - null', function () {
            this.dp.update(null);
            var selected = this.dp.picker.find('.active');

            equal(this.dp.date, undefined);
            equal(selected.length, 0, 'No date is selected');
        });

        test('setDate', function () {
            var date_in = new Date(2013, 1, 1),
                expected_date = new Date(Date.UTC(2013, 1, 1));

            notEqual(this.dp.date, date_in);
            this.dp.setDate(date_in);
            datesEqual(this.dp.date, expected_date);
        });

        test('setUTCDate', function () {
            var date_in = new Date(Date.UTC(2012, 3, 5)),
                expected_date = date_in;

            notEqual(this.dp.date, date_in);
            this.dp.setUTCDate(date_in);
            datesEqual(this.dp.date, expected_date);
        });


    // INLINE
    // -------------------------
        module('datepicker-inline', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.component = $('<div data-date="12-02-2012"></div>')
                                .appendTo('#qunit-fixture')
                                .datepicker({
                                    format: 'dd-mm-yyyy',
                                    keyboardNavigation: true
                                });
                this.dp = this.component.data('wdesk.datepicker');
                this.picker = this.dp.picker;
            },
            teardown: function () {
                this.component && this.component.remove();
                this.picker && this.picker.remove();

                $('#qunit-fixture').empty();
                $(window).removeData();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('Picker gets date/viewDate from data-date attr', function () {
            datesEqual(this.dp.date, UTCDate(2012, 1, 12),
                'Picker date should be set from data-date HTML attribute'
            );
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 12),
                'Picker viewDate should be set from data-date HTML attribute'
            );
        });

        test('Visible after init', function () {
            ok(this.picker.is(':visible'),
                'Inline picker should be visible after init'
            );
            ok(!$(document.body).hasClass('modal-open'),
                'body scroll should not be disabled when picker is inline'
            );
        });

        test('update', function () {
            this.dp.update('13-03-2012');

            datesEqual(this.dp.date, UTCDate(2012, 2, 13),
                'Picker date should be updated'
            );
        });

        test('keyboardNavigation disabled no matter what', function () {
            // user requested keyboard navigation
            ok(this.dp._o.keyboardNavigation,
                'keyboardNavigation is set to true when dp is initialized'
            );
            // we won't give it to them even if they ask.
            ok(!this.dp.o.keyboardNavigation,
                'keyboardNavigation is disabled despite being set to true upon initialization because it is an inline picker'
            );
        });


    // FORMATS
    // -------------------------
        module('datepicker-formats', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.input = $('<input type="text">').appendTo('#qunit-fixture');
                this.date = UTCDate(2012, 2, 15, 0, 0, 0, 0); // March 15, 2012
            },
            teardown: function () {
                this.input.data('wdesk.datepicker').picker &&
                this.input.data('wdesk.datepicker').picker.remove();

                this.input && this.input.remove();

                $('#qunit-fixture').empty();
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('d: Day of month, no leading zero.', function () {
            this.input
                .val('2012-03-05')
                .datepicker({format: 'yyyy-mm-d'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[2], '5');
        });

        test('dd: Day of month, leading zero.', function () {
            this.input
                .val('2012-03-5')
                .datepicker({format: 'yyyy-mm-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[2], '05');
        });

        test('D: Day of week, short.', function () {
            this.input
                .val('2012-03-05')
                .datepicker({format: 'yyyy-mm-dd-D'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[3], 'Mon');
        });

        test('DD: Day of week, long.', function () {
            this.input
                .val('2012-03-05')
                .datepicker({format: 'yyyy-mm-dd-DD'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[3], 'Monday');
        });

        test('m: Month, no leading zero.', function () {
            this.input
                .val('2012-03-05')
                .datepicker({format: 'yyyy-m-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[1], '3');
        });

        test('mm: Month, leading zero.', function () {
            this.input
                .val('2012-3-5')
                .datepicker({format: 'yyyy-mm-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[1], '03');
        });

        test('M: Month shortname.', function () {
            this.input
                .val('2012-Mar-05')
                .datepicker({format: 'yyyy-M-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[1], 'Mar');
        });

        test('MM: Month full name.', function () {
            this.input
                .val('2012-March-5')
                .datepicker({format: 'yyyy-MM-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[1], 'March');
        });

        test('yy: Year, two-digit.', function () {
            this.input
                .val('2012-03-05')
                .datepicker({format: 'yy-mm-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[0], '12');
        });

        test('yyyy: Year, four-digit.', function () {
            this.input
                .val('2012-03-5')
                .datepicker({format: 'yyyy-mm-dd'})
                .datepicker('setValue');

            equal(this.input.val().split('-')[0], '2012');
        });

        test('dd-mm-yyyy: Regression: Prevent potential month overflow in small-to-large formats (Mar 31, 2012 -> Mar 01, 2012)', function () {
            this.input
                .val('31-03-2012')
                .datepicker({format: 'dd-mm-yyyy'})
                .datepicker('setValue');

            equal(this.input.val(), '31-03-2012');
        });

        test('dd-mm-yyyy: Leap day', function () {
            this.input
                .val('29-02-2012')
                .datepicker({format: 'dd-mm-yyyy'})
                .datepicker('setValue');

            equal(this.input.val(), '29-02-2012');
        });

        test('yyyy-mm-dd: Alternative format', function () {
            this.input
                .val('2012-02-12')
                .datepicker({format: 'yyyy-mm-dd'})
                .datepicker('setValue');

            equal(this.input.val(), '2012-02-12');
        });

        test('yyyy-MM-dd: Regression: Infinite loop when numbers used for month', function () {
            this.input
                .val('2012-02-12')
                .datepicker({format: 'yyyy-MM-dd'})
                .datepicker('setValue');

            equal(this.input.val(), '2012-February-12');
        });

        test('Regression: End-of-month bug',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 4, 31);
                this.input
                    .val('29-02-2012')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '29-02-2012');
            })
        );

        test('Invalid formats are force-parsed into a valid date on tab',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 4, 31);
                this.input
                    .val('44-44-4444')
                    .datepicker({format: 'yyyy-MM-dd'})
                    .focus();

                this.input.trigger({
                    type: 'keydown',
                    keyCode: 9
                });

                equal(this.input.val(), '56-September-30');
            })
        );

        test('Trailing separators',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 4, 31);
                this.input
                    .val('29.02.2012.')
                    .datepicker({format: 'dd.mm.yyyy.'})
                    .datepicker('setValue');

                equal(this.input.val(), '29.02.2012.');
            })
        );

        test('+1d: Tomorrow',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('+1d')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '16-03-2012');
            })
        );

        test('-1d: Yesterday',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('-1d')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '14-03-2012');
            })
        );

        test('+1w: Next week',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('+1w')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '22-03-2012');
            })
        );

        test('-1w: Last week',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('-1w')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '08-03-2012');
            })
        );

        test('+1m: Next month',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('+1m')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '15-04-2012');
            })
        );

        test('-1m: Last month',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('-1m')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '15-02-2012');
            })
        );

        test('+1y: Next year',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('+1y')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '15-03-2013');
            })
        );

        test('-1y: Last year',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('-1y')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '15-03-2011');
            })
        );

        test('-1y +2m: Multiformat',
            patch_date(function (Date) {
                window.Date.now = UTCDate(2012, 2, 15);
                this.input
                    .val('-1y +2m')
                    .datepicker({format: 'dd-mm-yyyy'})
                    .datepicker('setValue');

                equal(this.input.val(), '15-05-2011');
            })
        );


    // DATA-API
    // -------------------------
        module('datepicker-data-api', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.dp = null;
                this.picker = null;
                this.pickerStart = null;
                this.pickerEnd = null;

                var componentDOM =
                    '<div class="input-group date" data-provide="datepicker">'+
                        '<span class="input-group-addon"><i class="icon icon-calendar"></i></span>'+
                        '<input />'+
                    '</div>';
                this.component = $(componentDOM).appendTo('#qunit-fixture');
                this.component.addon = this.component.find('.input-group-addon');
                this.component.input = this.component.find('input');

                var inputDOM = '<input data-provide="datepicker" />';
                this.input = $(inputDOM).appendTo('#qunit-fixture');

                var buttonDOM = '<button data-provide="datepicker"></button>';
                this.button = $(buttonDOM).appendTo('#qunit-fixture');

                var rangeDOM =
                    '<div class="input-group input-daterange" data-provide="datepicker">'+
                        '<input class="datepicker" value="12/1/2013">'+
                        '<span class="input-group-addon">to</span>'+
                        '<input class="datepicker" value="12/31/2013">'+
                    '</div>';
                this.range = $(rangeDOM).appendTo('#qunit-fixture');
                this.rangeStart = this.range.find('input:first');
                this.rangeEnd = this.range.find('input:last');
            },
            teardown: function () {
                $('#qunit-fixture *').each(function () {
                    var t = $(this);
                    if ('wdesk.datepicker' in t.data()) {
                        t.datepicker('remove');
                    }
                });
                $('#qunit-fixture').empty();
                $(document.body).removeAttr('class');
                $('.datepicker').each(function () {
                    $(this).remove();
                });

                this.input && this.input.remove();
                this.component && this.component.remove();
                this.button && this.button.remove();
                this.range && this.range.remove();
                this.pickerStart && this.pickerStart.remove();
                this.pickerEnd && this.pickerStart.remove();
            }
        });

        test('DATA-API: data-provide="datepicker" on input; focus', function () {
            var triggered = 0;

            this.input
                .on('show.wdesk.datepicker', function (e) {
                    triggered++;
                })
                .focus();

            this.dp = this.input.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp, 'datepicker is initialized by "focus" event');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on input; click', function () {
            var triggered = 0;

            this.input
                .on('show.wdesk.datepicker', function (e) {
                    triggered++;
                })
                .click();

            this.dp = this.input.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp, 'datepicker is initialized by "click" event');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on component; addon click', function () {
            var triggered = 0;

            this.component.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.component.addon.click();

            this.dp = this.component.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp,
                'append component initialized by "click" event on input-group-addon'
            );
            equal(triggered, 1,
                'show.wdesk.datepicker was triggered by "click" event on input-group-addon'
            );
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.component.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on component; addon focus', function () {
            var triggered = 0;

            this.component.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.component.addon.click();

            this.dp = this.component.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp,
                'append component initialized by "focus" event on input-group-addon'
            );
            equal(triggered, 1,
                'show.wdesk.datepicker was triggered by "focus" event on input-group-addon'
            );
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.component.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on component; input click', function () {
            var triggered = 0;

            this.component.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.component.input.click();

            this.dp = this.component.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp,
                'append component initialized by "click" event on component input'
            );
            equal(triggered, 1,
                'show.wdesk.datepicker was triggered by "click" event on component input'
            );
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.component.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on component; input focus', function () {
            var triggered = 0;

            this.component.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.component.input.focus();

            this.dp = this.component.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp,
                'append component initialized by "focus" event on component input'
            );
            equal(triggered, 1,
                'show.wdesk.datepicker was triggered by "focus" event on component input'
            );
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(this.component.input.hasClass('focus'), 'Input has focus class');
        });

        test('DATA-API: data-provide="datepicker" on button; click', function () {
            var triggered = 0;

            this.button
                .on('show.wdesk.datepicker', function (e) {
                    triggered++;
                })
                .click();

            this.dp = this.button.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp, 'datepicker button is initialized by "click" event');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered by "click" event on button');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(!this.button.hasClass('focus'), 'Button does not has focus class (for `<input>` elems only)');
        });

        test('DATA-API: data-provide="datepicker" on button; focus', function () {
            var triggered = 0;

            this.button
                .on('show.wdesk.datepicker', function (e) {
                    triggered++;
                })
                .focus();

            this.dp = this.button.data('wdesk.datepicker');
            this.picker = this.dp.picker;

            ok(this.dp, 'datepicker button is initialized by "focus" event');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered by "focus" event on button');
            ok(this.picker.is(':visible'), 'Date picker is visible');
            ok(!this.button.hasClass('focus'), 'Button does not has focus class (for `<input>` elems only)');
        });

        test('DATA-API: data-provide="datepicker" on rangepicker; rangeStart Focus', function () {
            var triggered = 0;

            this.range.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.rangeStart.focus();

            this.dp = this.range.data('wdesk.datepicker');
            this.pickerStart = this.dp.pickers[0].picker;
            this.pickerEnd = this.dp.pickers[1].picker;

            ok(this.dp, 'range initialized by "focus" event on rangeStart');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered by "focus" event on rangeStart');
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(this.rangeStart.hasClass('focus'), 'Start date input has focus class');
            ok(!this.rangeEnd.hasClass('focus'), 'End date input does not have focus class');
        });

        test('DATA-API: data-provide="datepicker" on rangepicker; rangeEnd Focus', function () {
            var triggered = 0;

            this.range.on('show.wdesk.datepicker', function (e) {
                triggered++;
            });

            this.rangeEnd.focus();

            this.dp = this.range.data('wdesk.datepicker');
            this.pickerStart = this.dp.pickers[0].picker;
            this.pickerEnd = this.dp.pickers[1].picker;

            ok(this.dp, 'range initialized by "focus" event on rangeEnd');
            equal(triggered, 1, 'show.wdesk.datepicker was triggered by "focus" event on rangeEnd');
            ok(this.pickerEnd.is(':visible'), 'End date picker is visible');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');
            ok(this.rangeEnd.hasClass('focus'), 'End date input has focus class');
            ok(!this.rangeStart.hasClass('focus'), 'Start date input does not have focus class');
        });


    // DATE RANGE COMPONENT
    // -------------------------
        module('datepicker-range-component', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                var rangeDOM =
                    '<div class="input-group input-daterange" id="datepicker">'+
                        '<input type="text">'+
                        '<span class="input-group-addon">to</span>'+
                        '<input type="text">'+
                    '</div>';
                this.range = $(rangeDOM).appendTo('#qunit-fixture');
                this.range.datepicker({format: 'dd-mm-yyyy'});

                this.dp = this.range.data('wdesk.datepicker');
                this.pickerStart = this.dp.pickers[0].picker;
                this.pickerEnd = this.dp.pickers[1].picker;

                this.rangeStart = this.range.find('input:first');
                this.rangeEnd = this.range.find('input:last');
            },
            teardown: function () {
                this.range && this.range.remove();
                this.pickerStart && this.pickerStart.remove();
                this.pickerEnd && this.pickerEnd.remove();

                $('#qunit-fixture').empty();
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('Key trigger: Empty end date input automatically focused after start date picked', function () {
            var triggeredEndFocus = 0;

            this.rangeEnd.on('focus', function (e) {
                triggeredEndFocus++;
            });


            // non-exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.rangeStart
                .val('12-11-2012')
                .trigger({
                    type: 'keydown',
                    keyCode: 9 // tab
                });
            // End date input was focused
            equal(triggeredEndFocus, 1,
                'End date input was focused after start date was entered'
            );
            ok(this.pickerEnd.is(':visible'), 'End date picker is visible');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');

            $(document).trigger('mousedown');


            // exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.rangeStart
                .val('12-12-2012')
                .trigger({
                    type: 'keydown',
                    keyCode: 27 // esc
                });
            equal(triggeredEndFocus, 1,
                'End date input was not focused because hide() had a parameter value of "exit"'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');
        });

        test('Key trigger: Non-empty end date input NOT automatically focused after start date picked', function () {
            var triggeredEndFocus = 0;

            this.rangeEnd
                .on('focus', function (e) {
                    triggeredEndFocus++;
                })
                .val('12-13-2012');


            // non-exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.rangeStart
                .val('12-11-2012')
                .trigger({
                    type: 'keydown',
                    keyCode: 13 // enter
                });
            // End date input was not focused
            equal(triggeredEndFocus, 0,
                'End date input was not focused after start date was entered'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');

            $(document).trigger('mousedown');


            // exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.rangeStart
                .val('12-12-2012')
                .trigger({
                    type: 'keydown',
                    keyCode: 27 // esc
                });
            equal(triggeredEndFocus, 0,
                'End date input was not focused because hide() had a parameter value of "exit"'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');
        });

        test('Mouse trigger: Empty end date input automatically focused after start date picked', function () {
            var triggeredEndFocus = 0;

            this.rangeEnd.on('focus', function (e) {
                triggeredEndFocus++;
            });


            // non-exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.pickerStart.find('.day:first').click();
            equal(triggeredEndFocus, 1,
                'End date input was focused after start date was entered because hide() contained a non-exit parameter value'
            );
            ok(this.pickerEnd.is(':visible'), 'End date picker is visible');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');

            $(document).trigger('mousedown');


            // exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            $(document).trigger('mousedown');
            equal(triggeredEndFocus, 1,
                'End date input was not focused because hide() had a parameter value of "exit"'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');
        });

        test('Mouse trigger: Non-empty end date input NOT automatically focused after start date picked', function () {
            var triggeredEndFocus = 0;

            this.rangeEnd
                .on('focus', function (e) {
                    triggeredEndFocus++;
                })
                .val('12-13-2012');


            // non-exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');

            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            this.pickerStart.find('.day:first').click();
            // End date input was not focused
            equal(triggeredEndFocus, 0,
                'End date input was not focused after start date was entered'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');

            $(document).trigger('mousedown');


            // exit parameter value
            // -------------------------
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden initially');
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden initially');
            this.rangeStart.focus();
            ok(this.pickerStart.is(':visible'), 'Start date picker is visible on focus');

            $(document).trigger('mousedown');
            equal(triggeredEndFocus, 0,
                'End date input was not focused because hide() had a parameter value of "exit"'
            );
            ok(!this.pickerEnd.is(':visible'), 'End date picker is hidden');
            ok(!this.pickerStart.is(':visible'), 'Start date picker is hidden');
        });


    // COMPONENT
    // -------------------------
        module('datepicker-component', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.component = $('<div class="input-group date" id="datepicker">'+
                                        '<input size="16" type="text" value="12-02-2012" readonly>'+
                                        '<span class="input-group-addon"><i class="icon icon-calendar"></i></span>'+
                                    '</div>')
                                .appendTo('#qunit-fixture')
                                .datepicker({format: 'dd-mm-yyyy'});
                this.input = this.component.find('input');
                this.addon = this.component.find('.input-group-addon');
                this.dp = this.component.data('wdesk.datepicker');
                this.picker = this.dp.picker;
            },
            teardown: function () {
                this.component && this.component.remove();
                this.picker && this.picker.remove();

                $('#qunit-fixture').empty();
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });


        test('Component gets date/viewDate from input value', function () {
            datesEqual(this.dp.date, UTCDate(2012, 1, 12));
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 12));
        });

        test('Activation by component', function () {
            ok(!this.picker.is(':visible'));

            this.addon.click();
            ok(this.picker.is(':visible'));
        });

        test('simple keyboard nav test', function () {
            var target;

            // Keyboard nav only works with non-readonly inputs
            this.input.removeAttr('readonly');
            equal(this.dp.viewMode, 0);

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2012', 'Title is "February 2012"');
            datesEqual(this.dp.date, UTCDate(2012, 1, 12));
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 12));

            // Focus/open
            this.addon.click();

            // Navigation: -1 day, left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37
            });
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 11));
            datesEqual(this.dp.date, UTCDate(2012, 1, 11));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2012', 'Title is "February 2012"');

            // Navigation: +1 month, shift + right arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 39,
                shiftKey: true
            });
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 11));
            datesEqual(this.dp.date, UTCDate(2012, 2, 11));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                ctrlKey: true
            });
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 11));
            datesEqual(this.dp.date, UTCDate(2011, 2, 11));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');
        });

        test('setValue', function () {
            this.dp.date = UTCDate(2012, 2, 13);
            this.dp.setValue();

            datesEqual(this.dp.date, UTCDate(2012, 2, 13));
            equal(this.input.val(), '13-03-2012');
        });

        test('update', function () {
            this.input.val('13-03-2012');
            this.dp.update();

            datesEqual(this.dp.date, UTCDate(2012, 2, 13));
        });

        test('Navigating to/from decade view', function () {
            var target;

            this.addon.click();
            this.input.val('31-03-2012');
            this.dp.update();
            equal(this.dp.viewMode, 0);

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'), 'Month picker is visible');
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            target = this.picker.find('.datepicker-months thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-years').is(':visible'), 'Year picker is visible');
            equal(this.dp.viewMode, 2);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Change years to test internal state changes
            target = this.picker.find('.datepicker-years tbody span:contains(2011)');
            target.click();
            equal(this.dp.viewMode, 1);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 1));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            target = this.picker.find('.datepicker-months tbody span:contains(Apr)');
            target.click();
            equal(this.dp.viewMode, 0);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 3, 1));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });

        test('Selecting date resets viewDate and date', function () {
            var target;

            this.addon.click();
            this.input.val('31-03-2012');
            this.dp.update();

            // Rendered correctly
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '26'); // Should be Feb 26

            // Updated internally on click
            target.click();
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 26));
            datesEqual(this.dp.date, UTCDate(2012, 1, 26));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '29'); // Should be Jan 29
        });

        test('"remove" removes associated HTML', function () {
            var datepickerDivSelector = '.datepicker';

            $('#datepicker').datepicker('show');
            //there should be one datepicker initiated so that means one hidden .datepicker div
            equal($(datepickerDivSelector).length, 1);

            this.component.datepicker('remove');
            equal($(datepickerDivSelector).length, 0);//hidden HTML should be gone
        });

        test('"remove" removes datepicker data', function () {
            $('#datepicker').datepicker('show');
            //there should be one datepicker initiated so that means one hidden .datepicker div
            ok($('#datepicker').data('wdesk.datepicker'));

            this.component.datepicker('remove');
            ok(!$('#datepicker').data('wdesk.datepicker'));
        });

        test('Does not block events', function () {
            var clicks = 0;
            function handler () {
                clicks++;
            }

            $('#qunit-fixture').on('click', '.input-group-addon', handler);

            this.addon.click();
            equal(clicks, 1);

            $('#qunit-fixture').off('click', '.input-group-addon', handler);
        });


        test('date and viewDate must be between startDate and endDate when setStartDate called', function () {
            this.dp.setDate(new Date(2013, 1, 1));
            this.dp.setStartDate(new Date(2013, 5, 6));

            datesEqual(this.dp.viewDate, UTCDate(2013, 5, 6));
            datesEqual(this.dp.date, UTCDate(2013, 5, 6));
        });

        test('date and viewDate must be between startDate and endDate when setEndDate called', function () {
            this.dp.setDate(new Date(2013, 12, 1));
            this.dp.setEndDate(new Date(2013, 5, 6));

            datesEqual(this.dp.viewDate, UTCDate(2013, 5, 6));
            datesEqual(this.dp.date, UTCDate(2013, 5, 6));
        });


    // CALENDAR WEEKS
    // -------------------------
        module('datepicker-calendar-weeks', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.input = $('<input type="text">')
                    .appendTo('#qunit-fixture')
                    .val('2013-01-14')
                    .datepicker({
                        format: 'yyyy-mm-dd',
                        calendarWeeks: true
                    })
                    .focus(); // Activate for visibility checks
                this.dp = this.input.data('wdesk.datepicker');
                this.picker = this.dp.picker;
            },
            teardown: function () {
                this.picker && this.picker.remove();

                $('#qunit-fixture').empty();
                $('.datepicker').each(function () {
                    $(this).remove();
                });
            }
        });

        test('adds cw header column', function () {
            var target = this.picker.find('.datepicker-days thead th:first-child');

            ok(target.hasClass('cw'), 'First column heading is from cw column');
        });

        test('adds calendar week cells to each day row', function () {
            var target = this.picker.find('.datepicker-days tbody tr');
            expect(target.length + 1); // target.length + 1 setup test

            target.each(function(i){
                var t = $(this).children().first();

                ok(t.hasClass('cw'), 'First column is cw column');
            });
        });

        test('displays correct calendar week', function () {
            var target = this.picker.find('.datepicker-days tbody tr');
            expect(target.length + 1); // target.length + 1 setup test

            target.each(function(i){
                var t = $(this).children().first();

                equal(t.text(), i+1, 'Displays correct calendar weeks');
            });
        });

        test('it prepends column to switcher thead row', function () {
            var target = this.picker.find('.datepicker-days thead tr:first-child');

            equal(target.children().length, 4, 'first row has 4 columns');
            ok(target.children().first().hasClass('cw'), 'cw column is prepended');
        });


    // MOUSE NAVIGATION
    // -------------------------
        module('datepicker-mouse-navigation', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                /*
                    Tests start with picker on March 31, 2012.  Fun facts:

                    * February 1, 2012 was on a Wednesday
                    * February 29, 2012 was on a Wednesday
                    * March 1, 2012 was on a Thursday
                    * March 31, 2012 was on a Saturday
                */
                this.input = $('<input type="text" value="31-03-2012">')
                                .appendTo('#qunit-fixture')
                                .datepicker({format: 'dd-mm-yyyy'})
                                .focus(); // Activate for visibility checks
                this.dp = this.input.data('wdesk.datepicker');
                this.picker = this.dp.picker;
            },
            teardown: function () {
                this.picker && this.picker.remove();

                $('.datepicker').each(function () {
                    $(this).remove();
                });
                $('#qunit-fixture').empty();
            }
        });

        test('Selecting date resets viewDate and date', function () {
            var target;

            // Rendered correctly
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days tbody td:nth(7)');
            equal(target.text(), '4'); // Should be Mar 4

            // Updated internally on click
            target.click();
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 4));
            datesEqual(this.dp.date, UTCDate(2012, 2, 4));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '26'); // Should be Feb 29
        });

        test('Navigating next/prev by month', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.prev');
            ok(target.is(':visible'), 'Month:prev nav is visible');

            // Updated internally on click
            target.click();
            // Should handle month-length changes gracefully
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 29));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '29'); // Should be Jan 29

            target = this.picker.find('.datepicker-days thead th.next');
            ok(target.is(':visible'), 'Month:next nav is visible');

            // Updated internally on click
            target.click().click();
            // Graceful moonth-end handling carries over
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 29));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '25'); // Should be Mar 25
            // (includes "old" days at start of month, even if that's all the first week-row consists of)
        });

        test('Navigating to/from year view', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'), 'Month picker is visible');
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Change months to test internal state
            target = this.picker.find('.datepicker-months tbody span:contains(Apr)');
            target.click();
            equal(this.dp.viewMode, 0);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 1)); // Apr 30
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });

        test('Navigating to/from decade view', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'), 'Month picker is visible');
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            target = this.picker.find('.datepicker-months thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-years').is(':visible'), 'Year picker is visible');
            equal(this.dp.viewMode, 2);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Change years to test internal state changes
            target = this.picker.find('.datepicker-years tbody span:contains(2011)');
            target.click();
            equal(this.dp.viewMode, 1);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 1));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            target = this.picker.find('.datepicker-months tbody span:contains(Apr)');
            target.click();
            equal(this.dp.viewMode, 0);
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 3, 1));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });

        test('Navigating prev/next in year view', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'), 'Month picker is visible');
            equal(this.dp.viewMode, 1);
            equal(this.picker.find('.datepicker-months thead th.datepicker-switch').text(), '2012');
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Go to next year (2013)
            target = this.picker.find('.datepicker-months thead th.next');
            target.click();
            equal(this.picker.find('.datepicker-months thead th.datepicker-switch').text(), '2013');
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Go to prev year (x2 == 2011)
            target = this.picker.find('.datepicker-months thead th.prev');
            target.click().click();
            equal(this.picker.find('.datepicker-months thead th.datepicker-switch').text(), '2011');
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });

        test('Navigating prev/next in decade view', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-months').is(':visible'), 'Month picker is visible');
            equal(this.dp.viewMode, 1);
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            target = this.picker.find('.datepicker-months thead th.datepicker-switch');
            ok(target.is(':visible'), 'View switcher is visible');

            target.click();
            ok(this.picker.find('.datepicker-years').is(':visible'), 'Year picker is visible');
            equal(this.dp.viewMode, 2);
            equal(this.picker.find('.datepicker-years thead th.datepicker-switch').text(), '2010-2019');
            // Not modified when switching modes
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Go to next decade (2020-29)
            target = this.picker.find('.datepicker-years thead th.next');
            target.click();
            equal(this.picker.find('.datepicker-years thead th.datepicker-switch').text(), '2020-2029');
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2022, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Go to prev year (x2 == 2000-09)
            target = this.picker.find('.datepicker-years thead th.prev');
            target.click().click();
            equal(this.picker.find('.datepicker-years thead th.datepicker-switch').text(), '2000-2009');
            // Only viewDate modified
            datesEqual(this.dp.viewDate, UTCDate(2002, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });

        test('Selecting date from previous month resets viewDate and date, changing month displayed', function () {
            var target;

            // Rendered correctly
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '26'); // Should be Feb 26
            equal(this.picker.find('.datepicker-days thead th.datepicker-switch').text(), 'March 2012');

            // Updated internally on click
            target.click();
            equal(this.picker.find('.datepicker-days thead th.datepicker-switch').text(), 'February 2012');
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 26));
            datesEqual(this.dp.date, UTCDate(2012, 1, 26));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '29'); // Should be Jan 29
        });

        test('Selecting date from next month resets viewDate and date, changing month displayed', function () {
            var target;

            this.input.val('01-04-2012');
            this.dp.update();

            // Rendered correctly
            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days tbody td:last');
            equal(target.text(), '5'); // Should be May 5
            equal(this.picker.find('.datepicker-days thead th.datepicker-switch').text(), 'April 2012');

            // Updated internally on click
            target.click();
            equal(this.picker.find('.datepicker-days thead th.datepicker-switch').text(), 'May 2012');
            datesEqual(this.dp.viewDate, UTCDate(2012, 4, 5));
            datesEqual(this.dp.date, UTCDate(2012, 4, 5));

            // Re-rendered on click
            target = this.picker.find('.datepicker-days tbody td:first');
            equal(target.text(), '29'); // Should be Apr 29
        });


    // KEYBOARD NAVIGATION
    // -------------------------
        module('datepicker-keyboard-navigation', {
            setup: function () {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                /*
                    Tests start with picker on March 31, 2012.  Fun facts:

                    * February 1, 2012 was on a Wednesday
                    * February 29, 2012 was on a Wednesday
                    * March 1, 2012 was on a Thursday
                    * March 31, 2012 was on a Saturday
                */
                this.input = $('<input type="text" value="31-03-2012">')
                                .appendTo('#qunit-fixture')
                                .datepicker({format: 'dd-mm-yyyy'})
                                .focus(); // Activate for visibility checks
                this.dp = this.input.data('wdesk.datepicker');
                this.picker = this.dp.picker;

                this.emptyInput = $('<input type="text">')
                                .appendTo('#qunit-fixture')
                                .datepicker({format: 'dd-mm-yyyy'});
                this.emptyDp = this.emptyInput.data('wdesk.datepicker');
                this.emptyPicker = this.emptyDp.picker;
            },
            teardown: function () {
                this.picker && this.picker.remove();

                $('.datepicker').each(function () {
                    $(this).remove();
                });
                $('#qunit-fixture').empty();
            }
        });

        test('no date (default to today to prevent keyboard navigation JS errors)', function () {
            equal(this.emptyDp.date, undefined, 'this.date is undefined');

            this.emptyInput
                .focus()
                .trigger({
                    type: 'keydown',
                    keyCode: 37
                });

            datesEqual(this.emptyDp.date, this.emptyDp.viewDate,
                'Empty date field initialized with todays date so that keyboard navigation works'
            );
        });

        test('by day (right/left arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 day, left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 30));
            datesEqual(this.dp.date, UTCDate(2012, 2, 30));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: +1 day, right arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 39
                });
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 1));
            datesEqual(this.dp.date, UTCDate(2012, 3, 1));

            // Month changed: April 1 (this is not a joke!)
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'April 2012', 'Title is "April 2012"');
        });

        test('by week (up/down arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 week, up arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 38
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 24));
            datesEqual(this.dp.date, UTCDate(2012, 2, 24));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: +1 week, down arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 40
                });
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 7));
            datesEqual(this.dp.date, UTCDate(2012, 3, 7));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'April 2012', 'Title is "April 2012"');
        });

        test('by month, v1 (shift + left/right arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 month, shift + left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                shiftKey: true
            });
            // Both updated on keyboard navigation, w/ graceful date ends
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 29));
            datesEqual(this.dp.date, UTCDate(2012, 1, 29));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2012', 'Title is "February 2012"');

            // Navigation: +1 month, shift + right arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 39,
                    shiftKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 29));
            datesEqual(this.dp.date, UTCDate(2012, 3, 29));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'April 2012', 'Title is "April 2012"');
        });

        test('by month, v2 (shift + up/down arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 month, shift + up arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 38,
                shiftKey: true
            });
            // Both updated on keyboard navigation, w/ graceful date ends
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 29));
            datesEqual(this.dp.date, UTCDate(2012, 1, 29));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2012', 'Title is "February 2012"');

            // Navigation: +1 month, shift + down arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 40,
                    shiftKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2012, 3, 29));
            datesEqual(this.dp.date, UTCDate(2012, 3, 29));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'April 2012', 'Title is "April 2012"');
        });

        test('by year, v1 (ctrl + left/right arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                ctrlKey: true
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, ctrl + right arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 39,
                    ctrlKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, v2 (ctrl + up/down arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + up arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 38,
                ctrlKey: true
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, ctrl + down arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 40,
                    ctrlKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, v3 (ctrl + shift + left/right arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                ctrlKey: true,
                shiftKey: true
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, ctrl + right arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 39,
                    ctrlKey: true,
                    shiftKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, v4 (ctrl + shift + up/down arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + up arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 38,
                ctrlKey: true,
                shiftKey: true
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, ctrl + down arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 40,
                    ctrlKey: true,
                    shiftKey: true
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, OSx v1 (cmd + up/down arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, cmd + up arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 38,
                ctrlKey: false,
                metaKey: true // OSX CMD KEY
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, cmd + down arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 40,
                    ctrlKey: false,
                    metaKey: true // OSX CMD KEY
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, OSx v2 (ctrl + left/right arrows)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 year, ctrl + left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                ctrlKey: false,
                metaKey: true // OSX CMD KEY
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2011, 2, 31));
            datesEqual(this.dp.date, UTCDate(2011, 2, 31));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2011', 'Title is "March 2011"');

            // Navigation: +1 year, ctrl + right arrow key
            for (var i=0; i<2; i++)
                this.input.trigger({
                    type: 'keydown',
                    keyCode: 39,
                    ctrlKey: false,
                    metaKey: true // OSX CMD KEY
                });
            datesEqual(this.dp.viewDate, UTCDate(2013, 2, 31));
            datesEqual(this.dp.date, UTCDate(2013, 2, 31));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2013', 'Title is "March 2013"');
        });

        test('by year, from leap day', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');

            this.input.val('29-02-2012').datepicker('update');
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 29));
            datesEqual(this.dp.date, UTCDate(2012, 1, 29));
            equal(target.text(), 'February 2012', 'Title is "February 2012"');

            // Navigation: -1 year
            this.input.trigger({
                type: 'keydown',
                keyCode: 37,
                ctrlKey: true
            });
            // Both updated on keyboard navigation; graceful month-end
            datesEqual(this.dp.viewDate, UTCDate(2011, 1, 28));
            datesEqual(this.dp.date, UTCDate(2011, 1, 28));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2011', 'Title is "February 2011"');

            // Navigation: +1 year, back to leap year
            this.input.trigger({
                type: 'keydown',
                keyCode: 39,
                ctrlKey: true
            });
            // Both updated on keyboard navigation; graceful month-end
            datesEqual(this.dp.viewDate, UTCDate(2012, 1, 28));
            datesEqual(this.dp.date, UTCDate(2012, 1, 28));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2012', 'Title is "February 2012"');

            // Navigation: +1 year
            this.input.trigger({
                type: 'keydown',
                keyCode: 39,
                ctrlKey: true
            });
            // Both updated on keyboard navigation; graceful month-end
            datesEqual(this.dp.viewDate, UTCDate(2013, 1, 28));
            datesEqual(this.dp.date, UTCDate(2013, 1, 28));

            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'February 2013', 'Title is "February 2013"');
        });

        test('Selection (enter)', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Navigation: -1 day, left arrow key
            this.input.trigger({
                type: 'keydown',
                keyCode: 37
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 30));
            datesEqual(this.dp.date, UTCDate(2012, 2, 30));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');

            // Selection: Enter
            this.input.trigger({
                type: 'keydown',
                keyCode: 13
            });
            // Both updated on keyboard navigation
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 30));
            datesEqual(this.dp.date, UTCDate(2012, 2, 30));

            // Month not changed
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');
            ok(this.picker.is(':not(:visible)'), 'Picker is hidden');
        });

        test('Toggle hide/show (escape); navigation while hidden is suppressed', function () {
            var target;

            equal(this.dp.viewMode, 0);
            target = this.picker.find('.datepicker-days thead th.datepicker-switch');
            equal(target.text(), 'March 2012', 'Title is "March 2012"');
            ok(this.picker.is(':visible'), 'Picker is visible');

            // Hide
            this.input.trigger({
                type: 'keydown',
                keyCode: 27
            });
            ok(this.picker.is(':not(:visible)'), 'Picker is hidden');
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // left arrow key, *doesn't* navigate
            this.input.trigger({
                type: 'keydown',
                keyCode: 37
            });
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));

            // Show
            this.input.trigger({
                type: 'keydown',
                keyCode: 27
            });
            ok(this.picker.is(':visible'), 'Picker is visible');
            datesEqual(this.dp.viewDate, UTCDate(2012, 2, 31));
            datesEqual(this.dp.date, UTCDate(2012, 2, 31));
        });
});
