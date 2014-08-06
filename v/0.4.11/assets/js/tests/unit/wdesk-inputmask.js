$(function () {

    /* global Inputmask */
    /* jshint phantom: true, indent: false, quotmark: true, -W110 */

    // MOCKS
    // -------------------------
        var keyCodes = {
            ALT: 18, BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, COMMAND: 91, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37, MENU: 93, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38, WINDOWS: 91
        };
        var caret = function (input, begin, end) {
            var npt = input.jquery && input.length > 0 ? input[0] : input, range;
            if (typeof begin == 'number') {
                end = (typeof end == 'number') ? end : begin;
                if (npt.setSelectionRange) {
                    npt.selectionStart = begin;
                    npt.selectionEnd = end;

                } else if (npt.createTextRange) {
                    range = npt.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            } else {
                if (npt.setSelectionRange) {
                    begin = npt.selectionStart;
                    end = npt.selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { "begin": begin, "end": end };
            }
        };
        $.fn.SendKey = function (keyCode, modifier) {
            var $element = this.data('wdesk.inputmask').$element || this;

            modifier = typeof modifier === 'undefined' ? false : modifier;
            var sendDummyKeydown = false;
            if (Object.prototype.toString.call(keyCode) == '[object String]') {
                keyCode = keyCode.charCodeAt(0);
                sendDummyKeydown = true;
            }

            var pos;
            switch (keyCode) {
                case keyCodes.LEFT: {
                    if (!modifier) {
                        pos = caret(this);
                        caret(this, pos.begin - 1);
                    }
                    break;
                }
                case keyCodes.RIGHT: {
                    if (!modifier) {
                        pos = caret(this);
                        caret(this, pos.begin + 1);
                    }
                    break;
                }
                default: {
                    var keydown = $.Event("keydown.wdesk.inputmask"),
                        keypress = $.Event("keypress.wdesk.inputmask"),
                        keyup = $.Event("keyup.wdesk.inputmask");

                    if (!sendDummyKeydown) {
                        keydown.which = keyCode;
                        if (modifier == keyCodes.CONTROL) {
                            keydown.ctrlKey = true;
                        }
                    }
                    $element.trigger(keydown);
                    if (!keydown.isDefaultPrevented()) {
                        keypress.which = keyCode;
                        if (modifier == keyCodes.CONTROL) {
                            keypress.ctrlKey = true;
                        }
                        $element.trigger(keypress);
                        if (!keypress.isDefaultPrevented()) {
                            keyup.which = keyCode;
                            if (modifier == keyCodes.CONTROL) {
                                keyup.ctrlKey = true;
                            }
                            $element.trigger(keyup);
                        }
                    }
                }
            }
        };
        $.fn.Type = function (inputStr) {
            var $input = $(this);

            if($(this).data('wdesk.inputmask')) {
                $.each(inputStr.split(''), function (ndx, lmnt) {
                    $input.SendKey(lmnt);
                });
            } else {
                var existingVal = $input.val();
                $input.val(existingVal + inputStr);
            }
        };

        $.fn.paste = function (inputStr) {
            var $input = $(this);
            $input.trigger('paste');
        };


    // MODULES
    // -------------------------

        // BASE
        // -------------------------
            module('inputmask-base', {
                setup: function() {
                    // check to make sure the testing surface is not polluted
                    equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                    // prepare something for all following tests
                    $('#qunit-fixture').empty();
                },
                teardown: function() {
                    // clean up after each test
                    $('#qunit-fixture').empty();
                }
            });

            test('should provide no conflict', function () {
                var inputmask = $.fn.inputmask.noConflict();
                ok(!$.fn.inputmask, 'inputmask was not set back to undefined (org value)');
                $.fn.inputmask = inputmask;
            });

            test('should be defined on jQuery object', function () {
                ok($(document.body).inputmask, 'inputmask method is not defined on the jQuery object');
            });

            test('should return element', function () {
                var $inputmaskElem = $('<input type="text" class="form-control" data-mask="999-99-999-9999-9" placeholder="ISBN">');
                ok($inputmaskElem.inputmask() == $inputmaskElem, 'element bound to inputmask method was not returned');
            });

            test('should expose core prototype methods', function () {
                ok(!!$.fn.inputmask.Constructor.prototype, 'prototype methods are not defined');
            });

            test('should set defaults', function () {
                var DEFAULTS = $.fn.inputmask.Constructor.DEFAULTS;
                var defaultDefinitions = {
                    '9': "[0-9]",
                    'a': "[A-Za-z]",
                    '~': "[A-Za-z0-9]",
                    '*': "."
                };

                equal(DEFAULTS.mask,            "",                 'InputMask.DEFAULTS.mask');
                equal(DEFAULTS.placeholder,     "_",                'InputMask.DEFAULTS.placeholder');
                deepEqual(DEFAULTS.definitions, defaultDefinitions, 'InputMask.DEFAULTS.parent');
                equal(DEFAULTS.clearIncomplete, false,              'InputMask.DEFAULTS.clearIncomplete');
            });


        // MASK EVENTS
        // -------------------------
            module('inputmask-mask-events', {
                setup: function() {
                    // check to make sure the testing surface is not polluted
                    equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                    // prepare something for all following tests
                    this.$testMask = $('<input type="text" class="form-control" data-mask="99-99-99">').appendTo('#qunit-fixture');
                    this.invalidTestData = 'abc';
                    this.incompleteTestData = '1234';
                    this.completeTestData = '123456';

                    var changeEventTriggered = 0;
                    var incompleteEventTriggeredOnBlur = 0;
                    var completeEventTriggeredOnBlur = 0;
                    var incompleteEventTriggeredOnKeypress = 0;
                    var completeEventTriggeredOnKeypress = 0;
                    var relatedEvent = null;

                    var that = this;

                    this.$testMask.on('change', function (e) {
                        changeEventTriggered++;
                    });
                    this.$testMask.on('incomplete.wdesk.inputmask', function (e) {
                        relatedEvent = e.relatedEvent;
                        if(relatedEvent === 'blur.wdesk.inputmask') {
                            incompleteEventTriggeredOnBlur++;
                        }
                        if(relatedEvent === 'keypress.wdesk.inputmask') {
                            incompleteEventTriggeredOnKeypress++;
                        }
                    });
                    this.$testMask.on('complete.wdesk.inputmask', function (e) {
                        relatedEvent = e.relatedEvent;
                        if(relatedEvent === 'blur.wdesk.inputmask') {
                            completeEventTriggeredOnBlur++;
                        }
                        if(relatedEvent === 'keypress.wdesk.inputmask') {
                            completeEventTriggeredOnKeypress++;
                        }
                    });
                    this.relatedEvent = function () {
                        return relatedEvent;
                    };
                    this.changeEventCount = function () {
                        return changeEventTriggered;
                    };
                    this.incompleteEventCount = function (_relatedEvent) {
                        return _relatedEvent == 'blur' ? incompleteEventTriggeredOnBlur : incompleteEventTriggeredOnKeypress;
                    };
                    this.completeEventCount = function (_relatedEvent) {
                        return _relatedEvent == 'blur' ? completeEventTriggeredOnBlur : completeEventTriggeredOnKeypress;
                    };
                    this.enterInvalidData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.invalidTestData);
                    };
                    this.enterIncompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.incompleteTestData);
                    };
                    this.removeIncompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        $.each(that.incompleteTestData.split(''), function() {
                            that.$testMask.SendKey(keyCodes.BACKSPACE);
                        });
                    };
                    this.enterCompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.completeTestData);
                    };
                    this.removeCompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        $.each(that.completeTestData.split(''), function() {
                            that.$testMask.SendKey(keyCodes.BACKSPACE);
                        });
                    };
                },
                teardown: function() {
                    // clean up after each test
                    $('#qunit-fixture').empty();
                    this.$testMask.remove();
                }
            });

            test('input change event should only fire on blur when input value changes', function () {
                this.enterInvalidData();
                this.$testMask.blur();

                equal(this.changeEventCount(), 0, 'change event should not be triggered when invalid data is entered');

                this.enterIncompleteData();
                this.$testMask.blur();

                equal(this.changeEventCount(), 1, 'change event should be triggered on blur when input value changes');

                this.removeIncompleteData();
                this.enterIncompleteData(false);
                this.$testMask.blur();

                equal(this.changeEventCount(), 1, 'change event should not be triggered on blur when input value does not change');

                this.removeIncompleteData();
                this.$testMask.blur();

                equal(this.changeEventCount(), 2, 'change event should be triggered on blur when input value changes');
            });

            test('no complete/incomplete event should be triggered on keypress() if data is invalid', function () {
                this.enterInvalidData();

                equal(this.incompleteEventCount('keypress'), 0, 'keypress(): incomplete.wdesk.inputmask should not be triggered when invalid data is entered');
                equal(this.completeEventCount('keypress'), 0, 'keypress(): complete.wdesk.inputmask should not be triggered when invalid data is entered');
            });

            test('no complete/incomplete event should be triggered if the input value has not changed', function () {
                this.enterIncompleteData();

                var initIncompKeypressEvCt  = this.incompleteEventCount('keypress');
                var initCompKeypressEvCt    = this.completeEventCount('keypress');

                // without this - the rest of the assertions are pointless
                equal(this.incompleteEventCount('keypress'), this.incompleteTestData.length);

                this.$testMask.blur();

                var initIncompBlurEvCt  = this.incompleteEventCount('blur');
                var initCompBlurEvCt    = this.completeEventCount('blur');

                // without this - the rest of the assertions are pointless
                equal(this.incompleteEventCount('blur'), 1);

                this.$testMask.focus();
                this.$testMask.blur();

                equal(this.incompleteEventCount('keypress'), initIncompKeypressEvCt, 'blur(): keypress incomplete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.completeEventCount('keypress'),   initCompKeypressEvCt,   'blur(): keypress complete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.incompleteEventCount('blur'),     initIncompBlurEvCt,     'blur(): blur incomplete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.completeEventCount('blur'),       initCompBlurEvCt,       'blur(): blur incomplete.wdesk.inputmask event count should not change because input data did not change');

                this.$testMask.focus();
                this.enterInvalidData();
                this.$testMask.blur();

                equal(this.incompleteEventCount('keypress'), initIncompKeypressEvCt, 'blur() after invalid data: keypress incomplete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.completeEventCount('keypress'),   initCompKeypressEvCt,   'blur() after invalid data: keypress complete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.incompleteEventCount('blur'),     initIncompBlurEvCt,     'blur() after invalid data: blur incomplete.wdesk.inputmask event count should not change because input data did not change');
                equal(this.completeEventCount('blur'),       initCompBlurEvCt,       'blur() after invalid data: blur incomplete.wdesk.inputmask event count should not change because input data did not change');
            });

            test('incomplete event should be triggered on blur() and each keypress() when mask is not completely filled in', function () {
                this.enterIncompleteData();

                equal(this.incompleteEventCount('keypress'), this.incompleteTestData.length, 'keypress(): incomplete.wdesk.inputmask should be triggered the same number of times a valid character is entered');
                equal(this.completeEventCount('keypress'), 0, 'keypress(): complete.wdesk.inputmask should not be triggered');

                this.$testMask.blur();

                equal(this.incompleteEventCount('blur'), 1, 'blur(): incomplete.wdesk.inputmask should be triggered');
                equal(this.completeEventCount('blur'), 0, 'blur(): complete.wdesk.inputmask should not be triggered');
            });

            test('incomplete event object should contain accurate related event string when triggered on blur() and each keypress()', function () {
                this.enterIncompleteData();

                equal(this.relatedEvent(), 'keypress.wdesk.inputmask', 'keypress(): related event = ' + this.relatedEvent());

                this.$testMask.blur();

                equal(this.relatedEvent(), 'blur.wdesk.inputmask', 'blur(): related event = ' + this.relatedEvent());
            });

            test('complete event should be triggered on blur() of completely filled-in mask, and on keypress() of final index of mask', function () {
                this.enterCompleteData();

                equal(this.completeEventCount('keypress'), 1, 'keypress(): complete.wdesk.inputmask should be triggered once');

                this.$testMask.blur();

                equal(this.incompleteEventCount('blur'), 0, 'blur(): incomplete.wdesk.inputmask should not be triggered');
                equal(this.completeEventCount('blur'), 1, 'blur(): complete.wdesk.inputmask should be triggered');
            });

            test('complete event object should contain accurate related event string when triggered on blur() and keypress()', function () {
                this.enterCompleteData();

                equal(this.relatedEvent(), 'keypress.wdesk.inputmask', 'keypress(): related event = ' + this.relatedEvent());

                this.$testMask.blur();

                equal(this.relatedEvent(), 'blur.wdesk.inputmask', 'blur(): related event = ' + this.relatedEvent());
            });


        // SIMPLE MASKING
        // -------------------------
            module('inputmask-simple-masking', {
                setup: function() {
                    // check to make sure the testing surface is not polluted
                    equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                    // prepare something for all following tests
                    this.$testMaskJS = $('<input id="testmaskjs" type="text" class="form-control" placeholder="placeholder-text">').appendTo('#qunit-fixture');
                    this.$testMask = $('<input type="text" class="form-control" data-clear-incomplete="false" data-mask="99-99-99" placeholder="placeholder-text">').appendTo('#qunit-fixture');
                    this.$testMaskClearIncomplete = $('<input type="text" class="form-control" data-clear-incomplete="true" data-mask="99-99-99" placeholder="placeholder-text">').appendTo('#qunit-fixture');
                    this.$testMaskPhone = $('<input type="text" class="form-control" data-clear-incomplete="false" data-mask="999.999.9999" placeholder="placeholder-text">').appendTo('#qunit-fixture');
                },
                teardown: function() {
                    // clean up after each test
                    $('[data-mask]').remove();
                    $('#qunit-fixture').empty();
                }
            });

            test('unmask method should remove mask from input, remove data and method binding', function () {

                this.$testMask.focus();
                this.$testMask.Type('12');

                ok(this.$testMask.data('wdesk.inputmask'), 'wdesk.inputmask data not present on input element');
                equal(this.$testMask.val(), '12-__-__', 'testMask input value should equal mask');

                this.$testMask.inputmask('unmask');

                ok(!this.$testMask.data('wdesk.inputmask'), 'unmasked: wdesk.inputmask data was not removed from input element');
                equal(this.$testMask.val(), '12', 'unmasked: testMask input mask removed, but the value remains');

                this.$testMask.Type('abc');

                equal(this.$testMask.val(), '12abc', 'unmasked: testMask input is still restricted by mask');
            });

            test('unmask method should remove data and/or method binding', function () {

                // data-attr
                this.$testMask.focus();
                var errMsgNotFound = 'wdesk.inputmask data not found after instantiating via ';
                var errMsgNotRemoved = 'unmasked: wdesk.inputmask data was not removed from input element instantiated by ';

                ok(this.$testMask.data('wdesk.inputmask'), errMsgNotFound + 'data attributes');

                this.$testMask.inputmask('unmask');

                ok(!this.$testMask.data('wdesk.inputmask'), errMsgNotRemoved + 'data attributes');

                // js
                this.$testMaskJS.inputmask({ mask: '99-99-99' });

                ok(this.$testMaskJS.data('wdesk.inputmask'), errMsgNotFound + 'JS');

                this.$testMaskJS.inputmask('unmask');

                ok(!this.$testMaskJS.data('wdesk.inputmask'), errMsgNotRemoved + 'JS');
            });

            test('input data should maintain reference to unmasked value', function () {

                var expectedMaskedValue = '12-12-12';
                var expectedUnmaskedMaskedValue = '121212';
                var errMsg = 'testMask input value should equal initial typed value within scope of mask';
                var errMsgData = 'testMask input.data("wdesk.inputmask").unmaskedValue should equal initial typed value without the mask';

                this.$testMask.focus();
                this.$testMask.Type(expectedUnmaskedMaskedValue);

                equal(this.$testMask.val(), expectedMaskedValue, errMsg);
                equal(this.$testMask.data('wdesk.inputmask').unmaskedValue, expectedUnmaskedMaskedValue, errMsgData);

                this.$testMask.blur();

                equal(this.$testMask.val(), expectedMaskedValue, 'blur: ' + errMsg);
                equal(this.$testMask.data('wdesk.inputmask').unmaskedValue, expectedUnmaskedMaskedValue, 'blur: ' + errMsgData);

                this.$testMask.focus();

                equal(this.$testMask.val(), expectedMaskedValue, 're-focus: ' + errMsg);
                equal(this.$testMask.data('wdesk.inputmask').unmaskedValue, expectedUnmaskedMaskedValue, 're-focus: ' + errMsgData);
            });

            test('mask should go away on blur if input is empty', function () {

                this.$testMask.focus();

                equal(this.$testMask.val(), '__-__-__', 'testMask input value should be equal to mask value');

                this.$testMask.blur();

                equal(this.$testMask.val().length, 0, 'testMask input value must be empty for the placeholder to be revealed');
            });

            test('clearIncomplete(false): input value should not be cleared on blur even if masked format is not completely filled in', function () {

                var expectedValue = '12-__-__';
                var errMsg = 'testMask input value should equal initial typed value appended by mask remainder';

                this.$testMask.focus();
                this.$testMask.Type('12');

                equal(this.$testMask.val(), expectedValue, errMsg);

                this.$testMask.blur();

                equal(this.$testMask.val(), expectedValue, 'blur: ' + errMsg);
            });

            test('clearIncomplete(true): input value should be cleared on blur if masked format is not completely filled in', function () {

                var expectedValue = '12-__-__';

                this.$testMaskClearIncomplete.focus();
                this.$testMaskClearIncomplete.Type('12');

                equal(this.$testMaskClearIncomplete.val(), expectedValue, 'testMask input value should equal initial typed value appended by mask remainder');

                this.$testMaskClearIncomplete.blur();

                equal(this.$testMaskClearIncomplete.val().length, 0, 'blur: testMask input value must be empty for the placeholder to be revealed');
            });

            test('clearIncomplete(true): input value should remain on blur and re-focus if masked format is completely filled in', function () {

                var expectedValue = '12-12-12';
                var errMsg = 'testMask input value should equal initial typed value';

                this.$testMaskClearIncomplete.focus();
                this.$testMaskClearIncomplete.Type('121212');

                equal(this.$testMaskClearIncomplete.val(), expectedValue, errMsg);

                this.$testMaskClearIncomplete.blur();

                equal(this.$testMaskClearIncomplete.val(), expectedValue, 'blur: ' + errMsg);

                this.$testMaskClearIncomplete.focus();

                equal(this.$testMaskClearIncomplete.val(), expectedValue, 're-focus: ' + errMsg);
            });

            test('delete 2nd integer from value with backspace, continue the mask', function () {

                this.$testMaskPhone.focus();
                this.$testMaskPhone.Type('123');
                this.$testMaskPhone.SendKey(keyCodes.LEFT);
                this.$testMaskPhone.SendKey(keyCodes.LEFT);
                this.$testMaskPhone.SendKey(keyCodes.BACKSPACE);
                this.$testMaskPhone.Type('4');
                this.$testMaskPhone.SendKey(keyCodes.RIGHT);
                this.$testMaskPhone.Type('56');

                equal(this.$testMaskPhone.val(), '143.56_.____', 'testMaskPhone input value: ' + this.$testMaskPhone.val());
            });

            test('delete 2nd integer from value with delete, continue the mask', function () {

                this.$testMaskPhone.focus();
                this.$testMaskPhone.Type('123');
                this.$testMaskPhone.SendKey(keyCodes.LEFT);
                this.$testMaskPhone.SendKey(keyCodes.LEFT);
                this.$testMaskPhone.SendKey(keyCodes.LEFT);
                this.$testMaskPhone.SendKey(keyCodes.DELETE);
                this.$testMaskPhone.Type('4');
                this.$testMaskPhone.SendKey(keyCodes.RIGHT);
                this.$testMaskPhone.Type('56');

                equal(this.$testMaskPhone.val(), '143.56_.____', 'testMaskPhone input value: ' + this.$testMaskPhone.val());
            });


        // MASK FORMATS
        // -------------------------
            module('inputmask-mask-formats', {
                setup: function() {
                    // check to make sure the testing surface is not polluted
                    equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                    // prepare something for all following tests
                    $('#qunit-fixture').empty();
                    this.$testMask = $('<input type="text" id="testmask">').appendTo('#qunit-fixture');
                },
                teardown: function() {
                    // clean up after each test
                    $('#qunit-fixture').empty();
                    this.$testMask.remove();
                }
            });

            test('inputmask({ mask: "*****" }): any character (valid entry)', function () {

                this.$testMask.inputmask({ mask: '*****' });
                this.$testMask.focus();
                this.$testMask.Type('abe');
                this.$testMask.SendKey(keyCodes.LEFT);
                this.$testMask.Type('cd');

                equal(this.$testMask.val(), 'abcde', 'Result ' + this.$testMask.val());

                this.$testMask.Type('ddddddd');

                equal(this.$testMask.val().length, this.$testMask.data('wdesk.inputmask').mask.length, 'Mask length should restrict maxlength of input');
            });

            test('inputmask({ mask: "99/99/9999" }): numbers only (valid entry)', function () {

                this.$testMask.inputmask({ mask: '99/99/9999' });
                this.$testMask.focus();
                this.$testMask.Type('12311999');

                equal(this.$testMask.val(), '12/31/1999', 'Result ' + this.$testMask.val());
            });

            test('inputmask({ mask: "99/99/9999" }): numbers only (invalid entry)', function () {

                this.$testMask.inputmask({ mask: '99/99/9999' });
                this.$testMask.focus();
                this.$testMask.Type('12ac99');

                equal(this.$testMask.val(), '12/99/____', 'Result ' + this.$testMask.val());
            });

            test('inputmask({ mask: "aa-aa-aa" }): letters only (valid entry)', function () {

                this.$testMask.inputmask({ mask: 'aa-aa-aa' });
                this.$testMask.focus();
                this.$testMask.Type('abcdef');

                equal(this.$testMask.val(), 'ab-cd-ef', 'Result ' + this.$testMask.val());
            });

            test('inputmask({ mask: "aa-aa-aa" }): letters only (invalid entry)', function () {

                this.$testMask.inputmask({ mask: 'aa-aa-aa' });
                this.$testMask.focus();
                this.$testMask.Type('ab12cd');

                equal(this.$testMask.val(), 'ab-cd-__', 'Result ' + this.$testMask.val());
            });

            test('inputmask({ mask: "~~~-~~~-~~~" }): alphanumeric (valid entry)', function () {

                this.$testMask.inputmask({ mask: '~~~-~~~-~~~' });
                this.$testMask.focus();
                this.$testMask.Type('abc123DEF');

                equal(this.$testMask.val(), 'abc-123-DEF', 'Result ' + this.$testMask.val());
            });

            test('inputmask({ mask: "~~~-~~~-~~~" }): alphanumeric (invalid entry)', function () {

                this.$testMask.inputmask({ mask: '~~~-~~~-~~~' });
                this.$testMask.focus();
                this.$testMask.Type('abc/"?!ABC');

                equal(this.$testMask.val(), 'abc-ABC-___', 'Result ' + this.$testMask.val());
            });


        // MASK MODIFIER KEYS
        // -------------------------
            module('inputmask-mask-special-keys', {
                setup: function() {
                    // check to make sure the testing surface is not polluted
                    equal($(document.body).children().length, 1, '#qunit-fixture is not the only DOM element on the test surface');

                    // prepare something for all following tests
                    $('#qunit-fixture').empty();
                    this.$testMask = $('<input type="text" class="form-control" data-mask="99-99-99">').appendTo('#qunit-fixture');
                    this.initialVal = this.$testMask.val();

                    this.initializeMaskInput = function () {
                        this.$testMask.focus();
                        this.$testMask.blur();
                    };

                    this.initializeMaskInput();

                    this.maskData = this.$testMask.data('wdesk.inputmask');
                    this.invalidTestData = 'abc';
                    this.incompleteTestData = '1234';
                    this.incompleteTestDataMasked = '12-34-__';
                    this.completeTestData = '123456';
                    this.completeTestDataMasked = '12-34-56';

                    var that = this;

                    this.enterInvalidData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.invalidTestData);
                    };
                    this.enterIncompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.incompleteTestData);
                    };
                    this.removeIncompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        $.each(that.incompleteTestData.split(''), function() {
                            that.$testMask.SendKey(keyCodes.BACKSPACE);
                        });
                    };
                    this.enterCompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        that.$testMask.Type(that.completeTestData);
                    };
                    this.removeCompleteData = function (giveFocus) {
                        giveFocus = typeof giveFocus !== 'undefined' ? giveFocus : true;
                        giveFocus && that.$testMask.focus();
                        $.each(that.completeTestData.split(''), function() {
                            that.$testMask.SendKey(keyCodes.BACKSPACE);
                        });
                    };
                },
                teardown: function() {
                    // clean up after each test
                    $('#qunit-fixture').empty();
                    this.$testMask.remove();
                }
            });

            test('[ESC] key should set input value equal to the value present on initial focus and keep focus on input', function () {

                // WHEN INPUT IS EMPTY
                equal(this.$testMask.val(), this.initialVal, 'input val() should be "' + this.initialVal + '"');

                this.$testMask.focus();

                equal(this.$testMask.val(), this.maskData.buffer.join(''), 'input val() should be equal to mask value since no data has been entered');
                equal(this.maskData.unmaskedValue, this.maskData.unmaskValue(), 'input unmaskedValue should be equal to mask value since no data has been entered');

                this.$testMask.SendKey(keyCodes.ESCAPE);

                equal(this.$testMask.val(), this.initialVal, 'input val() should be "' + this.initialVal + '"');
                deepEqual(this.$testMask[0], $(document.activeElement)[0], 'input should remain focused after pressing [ESC] key');

                this.$testMask.blur();


                // WHEN INPUT IS NOT EMPTY
                this.enterIncompleteData();
                this.$testMask.blur();
                this.$testMask.focus();

                equal(this.$testMask.val(), this.incompleteTestDataMasked, 'input val() should be ' + this.incompleteTestDataMasked);
                equal(this.maskData.unmaskedValue, this.maskData.unmaskValue(), 'input unmaskedValue should be ' + this.maskData.unmaskValue());

                this.$testMask.focus();
                this.removeIncompleteData();

                // without this assertion the rest of the assertions are pointless
                equal(this.$testMask.val(), this.maskData.buffer.join(''), 'input val() should be equal to mask value since all data was removed from input');
                equal(this.maskData.unmaskedValue, this.maskData.unmaskValue(), 'input unmaskedValue should be equal to mask value since all data was removed from input');

                this.$testMask.SendKey(keyCodes.ESCAPE);

                equal(this.$testMask.val(), this.incompleteTestDataMasked, 'input val() should be ' + this.incompleteTestDataMasked);
                equal(this.maskData.unmaskedValue, this.maskData.unmaskValue(), 'input unmaskedValue should be ' + this.maskData.unmaskValue());
                deepEqual(this.$testMask[0], $(document.activeElement)[0], 'input should remain focused after pressing [ESC] key');
            });

            test('paste all valid data into masked input', function () {
                stop();
                var that = this;

                // must assert the expected number of tests when testing pub/sub functionality
                expect(2); // 1 + setup test

                this.$testMask.on('paste', function (e) {
                    setTimeout(function(){
                        equal(that.$testMask.val(), that.incompleteTestDataMasked, 'pasted value (' + that.incompleteTestData + ') should be masked into (' + that.incompleteTestDataMasked + ')');
                        start();
                    }, 100);
                });

                this.$testMask.focus();
                this.$testMask.val(this.incompleteTestData).trigger('paste');
            });

            test('paste a combination of valid and invalid data into masked input', function () {
                stop();
                var that = this;

                // must assert the expected number of tests when testing pub/sub functionality
                expect(2); // 1 + setup test

                this.$testMask.on('paste', function (e) {
                    setTimeout(function(){
                        equal(that.$testMask.val(), that.incompleteTestDataMasked, 'pasted value (' + that.incompleteTestData + ') should be masked into (' + that.incompleteTestDataMasked + ')');
                        start();
                    }, 100);
                });

                this.$testMask.focus();
                this.$testMask.val('abc' + this.incompleteTestData + 'abcabc').trigger('paste');
            });

            test('dragdrop all valid data into masked input', function () {
                stop();
                var that = this;

                // must assert the expected number of tests when testing pub/sub functionality
                expect(2); // 1 + setup test

                this.$testMask.on('dragdrop', function (e) {
                    setTimeout(function(){
                        equal(that.$testMask.val(), that.incompleteTestDataMasked, 'dropped value (' + that.incompleteTestData + ') should be masked into (' + that.incompleteTestDataMasked + ')');
                        start();
                    }, 100);
                });

                this.$testMask.focus();
                this.$testMask.val(this.incompleteTestData).trigger('dragdrop');
            });

            test('dragdrop a combination of valid and invalid data into masked input', function () {
                stop();
                var that = this;

                // must assert the expected number of tests when testing pub/sub functionality
                expect(2); // 1 + setup test

                this.$testMask.on('dragdrop', function (e) {
                    setTimeout(function(){
                        equal(that.$testMask.val(), that.incompleteTestDataMasked, 'dropped value (' + that.incompleteTestData + ') should be masked into (' + that.incompleteTestDataMasked + ')');
                        start();
                    }, 100);
                });

                this.$testMask.focus();
                this.$testMask.val('abc' + this.incompleteTestData + 'abcabc').trigger('dragdrop');
            });


});