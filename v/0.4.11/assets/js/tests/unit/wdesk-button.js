$(function () {

    /* global Button */
    /* jshint phantom: true, indent: false */

    // BASE
    // -------------------------
        module('button-base', {
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
            var btn = $.fn.button.noConflict();
            ok(!$.fn.button,
                'button was not set back to undefined (org value)'
            );
            $.fn.button = btn;
        });

        test('should be defined on jQuery object', function () {
            ok($(document.body).button,
                'button method is not defined on jQuery object'
            );
        });

        test('should return element', function () {
            equal($(document.body).button()[0], document.body,
                'element bound to button method was not returned'
            );
        });

        test('should expose defaults var for settings', function () {
            ok($.fn.button.Constructor.DEFAULTS,
                'defaults var object should be exposed'
            );
        });

        test('should set plugin defaults', function () {
            var DEFAULTS = $.fn.button.Constructor.DEFAULTS;

            equal(DEFAULTS.activeClass, 'active', 'Button.DEFAULTS.activeClass');
            equal(DEFAULTS.prop, 'disabled', 'Button.DEFAULTS.prop');
        });


    // STATES
    // -------------------------
        module('button-states', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.dataStr = 'loading';
                this.btnTextInit = 'load';
                this.btnTextActive = 'loading...';
                var loadingBtnDOM =
                    '<button class="btn" data-' + this.dataStr + '-text="' + this.btnTextActive + '" ' +
                            'data-prop="readonly">' +
                        '<span class="btn-text">' +
                            this.btnTextInit +
                        '</span>' +
                    '</button>';
                this.loadingBtn = $(loadingBtnDOM).appendTo('#qunit-fixture');
                this.loadingBtnText = this.loadingBtn.find('.btn-text');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should toggle the specified .prop() option', function () {
            var that = this;

            this.loadingBtn.button(this.dataStr);
            equal(that.loadingBtn[0], $(document.activeElement)[0], 'button should be focused');
            ok(!this.loadingBtn.prop('readonly'),
                'readonly prop should be false'
            );
            ok(!this.loadingBtn.hasClass('readonly'),
                'btn class that matches prop should be removed'
            );

            stop();

            setTimeout(function () {
                ok(that.loadingBtn.prop('readonly'),
                    'readonly prop should be true'
                );
                ok(that.loadingBtn.hasClass('readonly'),
                    'btn should have css class that matches prop'
                );

                start();
            }, 0);
        });

        test('should return set state to loading', function () {
            var that = this;

            this.loadingBtn.button(this.dataStr);
            equal(this.loadingBtn[0], $(document.activeElement)[0], 'button should be focused');
            ok(!this.loadingBtn.prop('readonly'),
                'readonly prop should be false'
            );
            ok(!this.loadingBtn.hasClass('readonly'),
                'btn class that matches prop should be removed'
            );
            equal(this.loadingBtnText.html(), this.btnTextActive);

            stop();

            setTimeout(function () {
                ok(that.loadingBtn.prop('readonly'),
                    'readonly prop should be true'
                );
                ok(that.loadingBtn.hasClass('readonly'),
                    'btn should have class that matches prop'
                );

                start();
            }, 0);
        });

        test('should return reset state', function () {
            var that = this;

            this.loadingBtn.button(this.dataStr);
            equal(this.loadingBtn[0], $(document.activeElement)[0], 'button should be focused');
            ok(!this.loadingBtn.prop('readonly'),
                'readonly prop should be false'
            );
            ok(!this.loadingBtn.hasClass('readonly'),
                'btn class that matches prop should be removed'
            );
            equal(this.loadingBtnText.html(), this.btnTextActive);

            stop();

            setTimeout(function () {
                ok(that.loadingBtn.prop('readonly'),
                    'readonly prop should be true'
                );
                ok(that.loadingBtn.hasClass('readonly'),
                    'btn should have class that matches prop'
                );

                start();
                stop();

                that.loadingBtn.button('reset');
                equal(that.loadingBtnText.html(), that.btnTextInit);

                setTimeout(function () {
                    equal(that.loadingBtn[0], $(document.activeElement)[0], 'button should be focused');
                    ok(!that.loadingBtn.prop('readonly'),
                        'readonly prop should be false'
                    );
                    ok(!that.loadingBtn.hasClass('readonly'),
                        'btn class that matches prop should be removed'
                    );

                    start();
                }, 0);
            }, 0);
        });


    // TOGGLE (JS INSTANTIATION)
    // -------------------------
        module('button-toggle-js', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.customClass = 'custom-class';
                this.btn = $('<button class="btn" type="button" aria-selected="false">download</button>').appendTo('#qunit-fixture');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should toggle active css class and `aria-selected` attribute', function () {
            ok(!this.btn.hasClass('active'), 'btn should not have active class');
            equal(this.btn.attr('aria-selected'), 'false', 'btn `aria-selected` attribute should be `false`');

            this.btn.button('toggle');

            ok(this.btn.hasClass('active'), 'btn should have active class');
            equal(this.btn.attr('aria-selected'), 'true', 'btn `aria-selected` attribute should be `true`');
            equal(this.btn[0], $(document.activeElement)[0], 'button should be focused');
        });

        test('should toggle custom active css class and `aria-selected` attribute', function () {
            ok(!this.btn.hasClass(this.customClass), 'btn should not have custom class');
            equal(this.btn.attr('aria-selected'), 'false', 'btn `aria-selected` attribute should be `false`');

            this.btn.attr('data-active-class', this.customClass);
            this.btn.button('toggle');

            ok(this.btn.hasClass(this.customClass), 'btn should have custom class');
            equal(this.btn.attr('aria-selected'), 'true', 'btn `aria-selected` attribute should be `true`');
            equal(this.btn[0], $(document.activeElement)[0], 'button should be focused');
        });


    // TOGGLE (DATA-API INSTANTIATION)
    // -------------------------
        module('button-toggle-data-api', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                this.customClass = 'custom-class';
                this.btn = $('<button class="btn" type="button" data-toggle="button" aria-selected="false">download</button>').appendTo('#qunit-fixture');
                this.customBtn = $('<button class="btn" type="button" data-toggle="button" aria-selected="false" data-active-class="custom-class">download</button>').appendTo('#qunit-fixture');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should toggle active css class and `aria-selected` attribute', function () {
            this.btn
                .appendTo('#qunit-fixture');

            ok(!this.btn.hasClass('active'), 'btn should not have active class');
            equal(this.btn.attr('aria-selected'), 'false', 'btn `aria-selected` attribute should be `false`');

            this.btn.click();

            ok(this.btn.hasClass('active'), 'btn should have active class');
            equal(this.btn.attr('aria-selected'), 'true', 'btn `aria-selected` attribute should be `true`');
            equal(this.btn[0], $(document.activeElement)[0], 'button should be focused');
        });

        test('should toggle custom active css class and `aria-selected` attribute', function () {
            this.customBtn
                .appendTo('#qunit-fixture');

            ok(!this.customBtn.hasClass(this.customClass), 'btn should not have custom class');
            equal(this.customBtn.attr('aria-selected'), 'false', 'btn `aria-selected` attribute should be `false`');

            this.customBtn.click();

            ok(this.customBtn.hasClass(this.customClass), 'btn should have custom class');
            equal(this.customBtn.attr('aria-selected'), 'true', 'btn `aria-selected` attribute should be `true`');
            equal(this.customBtn[0], $(document.activeElement)[0], 'button should be focused');
        });

        test('should toggle active css class when btn children are clicked', function () {
            var $inner = $('<i></i>');

            this.btn
                .append($inner)
                .appendTo($('#qunit-fixture'));

            ok(!this.btn.hasClass('active'), 'btn should not have active css class');
            equal(this.btn.attr('aria-selected'), 'false', 'btn `aria-selected` attribute should be `false`');

            $inner.click();

            ok(this.btn.hasClass('active'), 'btn should have active css class');
            equal(this.btn.attr('aria-selected'), 'true', 'btn `aria-selected` attribute should be `true`');
            equal(this.btn[0], $(document.activeElement)[0], 'button should be focused');
        });


    // RADIO GROUP TOGGLES
    // -------------------------
        module('button-toggle-group-radio', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                var simpleBtnGroupDOM =
                    '<div class="btn-group" data-toggle="buttons">' +
                        '<button class="btn">download</button>' +
                    '</div>';
                this.simpleBtnGroup = $(simpleBtnGroupDOM).appendTo('#qunit-fixture');
                this.simpleBtnGroupBtn = this.simpleBtnGroup.find('.btn');

                var btnGroupDOM =
                    '<div class="btn-group" data-toggle="buttons">' +
                        '<label class="btn btn-primary active focus">' +
                            '<input type="radio" name="options" id="option1" checked="true"> Option 1' +
                        '</label>' +
                        '<label class="btn btn-primary">' +
                            '<input type="radio" name="options" id="option2"> Option 2' +
                        '</label>' +
                        '<label class="btn btn-primary">' +
                            '<input type="radio" name="options" id="option3"> Option 3' +
                        '</label>' +
                    '</div>';
                this.btnGroup = $(btnGroupDOM).appendTo('#qunit-fixture');
                this.btn1 = $(this.btnGroup.children()[0]);
                this.btn2 = $(this.btnGroup.children()[1]);
                this.btn3 = $(this.btnGroup.children()[2]);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test('should toggle active css class when btn children are clicked within btn-group', function () {
            var $inner = $('<i></i>');

            this.simpleBtnGroupBtn.append($inner);

            ok(!this.simpleBtnGroupBtn.hasClass('active'), 'btn should not have active class');

            $inner.click();

            ok(this.simpleBtnGroupBtn.hasClass('active'), 'btn should have active class');
        });

        // RADIO TOGGLES
        test(':radio - should check for closest matching toggle', function () {
            ok(this.btn1.hasClass('active'), 'btn1 should have active class');
            ok(this.btn1.hasClass('focus'), 'btn1 should have focus class');
            ok(this.btn1.find('input').prop('checked'), 'btn1 input should be checked');

            ok(!this.btn2.hasClass('active'), 'btn2 should not have active class');
            ok(!this.btn2.hasClass('active'), 'btn2 should not have focus class');
            ok(!this.btn2.find('input').prop('checked'), 'btn2 input should be not checked');

            this.btn2.find('input').click();

            ok(!this.btn1.hasClass('active'), 'btn1 should not have active class');
            ok(!this.btn1.hasClass('focus'), 'btn1 should not have focus class');
            ok(!this.btn1.find('input').prop('checked'), 'btn1 input should not be checked');

            ok(this.btn2.hasClass('active'), 'btn2 should have active class');
            ok(this.btn2.hasClass('focus'), 'btn2 should have focus class');
            ok(this.btn2.find('input').prop('checked'), 'btn2 input should be checked');
            equal(this.btn2.find('input')[0], $(document.activeElement)[0], 'btn2 input should be focused');
        });

        test(':radio - should check for closest matching toggle even if custom active class is specified', function () {
            var customClass = 'custom-active';
            this.btnGroup.attr('data-active-class', customClass);
            this.btn1.attr('class', customClass + ' focus'); // replace .active with new customClass

            ok(this.btn1.hasClass(customClass), 'btn1 should have custom active class');
            ok(this.btn1.hasClass('focus'), 'btn1 should have focus class');
            ok(this.btn1.find('input').prop('checked'), 'btn1 should be checked');

            ok(!this.btn2.hasClass(customClass), 'btn2 should not have custom active class');
            ok(!this.btn2.hasClass('focus'), 'btn2 should not have focus class');
            ok(!this.btn2.find('input').prop('checked'), 'btn2 should not be checked');

            this.btn2.find('input').click();

            ok(!this.btn1.hasClass(customClass), 'btn1 should not have custom active class');
            ok(!this.btn1.hasClass('focus'), 'btn1 should not have focus class');
            ok(!this.btn1.find('input').prop('checked'), 'btn1 should not be checked');

            ok(this.btn2.hasClass(customClass), 'btn2 should have custom active class');
            ok(this.btn2.hasClass('focus'), 'btn2 should have focus class');
            ok(this.btn2.find('input').prop('checked'), 'btn2 should be checked');
            equal(this.btn2.find('input')[0], $(document.activeElement)[0], 'btn2 input should be focused');
        });


    // CHECKBOX GROUP TOGGLES
    // -------------------------
        module('button-toggle-group-checkbox', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                var btnGroupDOM =
                    '<div class="btn-group" data-toggle="buttons">' +
                        '<label class="btn btn-primary">' +
                            '<input type="checkbox" id="option1"> Option 1' +
                        '</label>' +
                        '<label class="btn btn-primary">' +
                            '<input type="checkbox" id="option2"> Option 2' +
                        '</label>' +
                        '<label class="btn btn-primary">' +
                            '<input type="checkbox" id="option3"> Option 3' +
                        '</label>' +
                    '</div>';
                this.btnGroup = $(btnGroupDOM).appendTo('#qunit-fixture');
                this.btn1 = $(this.btnGroup.children()[0]);
                this.btn2 = $(this.btnGroup.children()[1]);
                this.btn3 = $(this.btnGroup.children()[2]);
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();
            }
        });

        test(':checkbox - should check for closest matching toggle', function () {
            this.btn1.click();

            ok(this.btn1.hasClass('active'), 'btn1 should have active class');
            ok(this.btn1.hasClass('focus'), 'btn1 should have focus class');
            ok(this.btn1.find('input').prop('checked'), 'btn1 input should be checked');

            ok(!this.btn2.hasClass('active'), 'btn2 should not have active class');
            ok(!this.btn2.hasClass('active'), 'btn2 should not have focus class');
            ok(!this.btn2.find('input').prop('checked'), 'btn2 input should be not checked');

            this.btn2.click();

            ok(this.btn1.hasClass('active'), 'btn1 should still have active class');
            ok(!this.btn1.hasClass('focus'), 'btn1 should not have focus class');
            ok(this.btn1.find('input').prop('checked'), 'btn1 input should still be checked');

            ok(this.btn2.hasClass('active'), 'btn2 should have active class');
            ok(this.btn2.hasClass('focus'), 'btn2 should have focus class');
            ok(this.btn2.find('input').prop('checked'), 'btn2 input should be checked');
            equal(this.btn2.find('input')[0], $(document.activeElement)[0], 'btn2 input should be focused');
        });

        test(':checkbox - child input focus should add focus CSS class to parent `.btn` element', function () {
            this.btn1.find('input').focus();

            ok(!this.btn1.hasClass('active'), 'btn1 should not have active class');
            ok(this.btn1.hasClass('focus'), 'btn1 should have focus class');
            equal(this.btn1.find('input')[0], $(document.activeElement)[0], 'btn1 input should be focused');

            this.btn2.find('input').focus();

            ok(!this.btn2.hasClass('active'), 'btn1 should not have active class');
            ok(this.btn2.hasClass('focus'), 'btn1 should have focus class');
            ok(!this.btn1.hasClass('focus'), 'btn1 should not have focus class');
            equal(this.btn2.find('input')[0], $(document.activeElement)[0], 'btn2 input should be focused');
        });


    // MSIE 8 Checkbox / Radio Shim
    // -------------------------
        module('button-cbox-radio-shim-msie', {
            setup: function() {
                // check to make sure the testing surface is not polluted
                equal($(document.body).children().length, 1,
                    '#qunit-fixture is not the only DOM element on the test surface'
                );

                // prepare something for all following tests
                var simpleCboxDOM =
                    '<div class="checkbox checkbox-pretty">' +
                        '<input type="checkbox" id="cboxStackedEx">' +
                        '<label for="cboxStackedEx">Option one is this and that&mdash;be sure to include why it\'s great</label>' +
                    '</div>';
                this.simpleCbox = $(simpleCboxDOM).appendTo('#qunit-fixture');
                this.simpleCboxInput = this.simpleCbox.find('input');
                this.simpleCboxLbl = this.simpleCbox.find('label');

                var radioGroupDOM =
                    '<form>' +
                        '<div class="radio radio-pretty">' +
                            '<input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" class="checked" checked>' +
                            '<label for="optionsRadios1">Option one is this and that&mdash;be sure to include why it\'s great</label>' +
                        '</div>' +
                        '<div class="radio radio-pretty">' +
                            '<input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">' +
                            '<label for="optionsRadios2">Option two can be something else and selecting it will deselect option one</label>' +
                        '</div>' +
                    '</form>';
                this.radioGroup = $(radioGroupDOM).appendTo('#qunit-fixture');
                this.radio1 = $('#optionsRadios1');
                this.radio2 = $('#optionsRadios2');
            },
            teardown: function() {
                // clean up after each test
                $('#qunit-fixture').empty();

                this.simpleCbox = null;
                this.simpleCboxInput = null;
                this.simpleCboxLbl = null;

                this.radioGroup = null;
                this.radio1 = null;
                this.radio2 = null;
            }
        });

        test('should add checked css class when checkbox wrapper is clicked', function () {
            ok(!this.simpleCboxInput.hasClass('checked'), 'input should not have checked class');

            this.simpleCbox.click();
            ok(this.simpleCboxInput.hasClass('checked'), 'input should have checked class');
        });

        test('should remove checked css class when checkbox wrapper is clicked and checkbox is already checked', function () {
            this.simpleCboxInput.prop('checked', true);

            this.simpleCbox.click();
            ok(!this.simpleCboxInput.hasClass('checked'), 'input should not have checked class');

            this.simpleCbox.click();
            ok(this.simpleCboxInput.hasClass('checked'), 'input should have checked class');
        });

        test('checkbox change event should fire when checkbox wrapper is clicked', function () {
            var changeTriggered = 0;

            this.simpleCboxInput.on('change', function (e) {
                changeTriggered++;
            });

            this.simpleCbox.click();

            equal(changeTriggered, 1, 'change event should have been triggered');
        });

        test('should effectively mimic radio button group toggling when wrapper is clicked', function () {
            equal(this.radio1.prop('checked'), true, 'first radio button in the group should be checked');
            ok(this.radio1.hasClass('checked'), 'first radio button should have the checked CSS class');
            ok(this.radio1.attr('checked'), 'first radio button in the group should have checked attr');

            this.radio2.parent('.radio').click();

            ok(!this.radio1.attr('checked'), 'first radio button should no longer have the checked attribute');
            ok(!this.radio1.hasClass('checked'), 'first radio button should no longer have the checked CSS class');
            equal(this.radio1.prop('checked'), false, 'first radio button should no longer be checked');

            ok(this.radio2.attr('checked'), 'second radio button should now have the checked attribute');
            ok(this.radio2.hasClass('checked'), 'second radio button should now have the checked CSS class');
            equal(this.radio2.prop('checked'), true, 'second radio button should now be checked');

            this.radio1.parent('.radio').click();

            ok(!this.radio2.attr('checked'), 'second radio button should no longer have the checked attribute');
            ok(!this.radio2.hasClass('checked'), 'second radio button should no longer have the checked CSS class');
            equal(this.radio2.prop('checked'), false, 'second radio button should no longer be checked');

            ok(this.radio1.attr('checked'), 'first radio button should now have the checked attribute');
            ok(this.radio1.hasClass('checked'), 'first radio button should now have the checked CSS class');
            equal(this.radio1.prop('checked'), true, 'first radio button should now be checked');
        });
});