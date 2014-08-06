/*
 * grunt-contrib-qunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

/*global QUnit:true, alert:true*/
(function () {
    'use strict';

    function format(str, style) {
        var styles = {
            // styles
            'bold':             ['\x1B[1m',  '\x1B[22m'],
            'italic':           ['\x1B[3m',  '\x1B[23m'],
            'underline':        ['\x1B[4m',  '\x1B[24m'],
            'inverse':          ['\x1B[7m',  '\x1B[27m'],
            'strikethrough':    ['\x1B[9m',  '\x1B[29m'],
            // text colors
            // grayscale
            'white':            ['\x1B[37m', '\x1B[39m'],
            'grey':             ['\x1B[90m', '\x1B[39m'],
            'black':            ['\x1B[30m', '\x1B[39m'],
            // colors
            'blue':             ['\x1B[34m', '\x1B[39m'],
            'cyan':             ['\x1B[36m', '\x1B[39m'],
            'green':            ['\x1B[32m', '\x1B[39m'],
            'magenta':          ['\x1B[35m', '\x1B[39m'],
            'red':              ['\x1B[31m', '\x1B[39m'],
            'yellow':           ['\x1B[33m', '\x1B[39m'],
            // background colors
            // grayscale
            'whiteBG':          ['\x1B[47m', '\x1B[49m'],
            'greyBG':           ['\x1B[49;5;8m', '\x1B[49m'],
            'blackBG':          ['\x1B[40m', '\x1B[49m'],
            // colors
            'blueBG':           ['\x1B[44m', '\x1B[49m'],
            'cyanBG':           ['\x1B[46m', '\x1B[49m'],
            'greenBG':          ['\x1B[42m', '\x1B[49m'],
            'magentaBG':        ['\x1B[45m', '\x1B[49m'],
            'redBG':            ['\x1B[41m', '\x1B[49m'],
            'yellowBG':         ['\x1B[43m', '\x1B[49m']
        };

        return styles[style][0] + str + styles[style][1];
    }

    // Don't re-order tests.
    QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    QUnit.config.autorun = false;

    // Send messages to the parent PhantomJS process via alert! Good times!!
    function sendMessage() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    }

    // These methods connect QUnit to PhantomJS.
    QUnit.log(function(obj) {
        // What is this I don’t even
        if (obj.message === '[object Object], undefined:undefined') { return; }
        // Parse some stuff before sending it.
        var actual = QUnit.jsDump.parse(obj.actual);
        var expected = QUnit.jsDump.parse(obj.expected);
        // Send it.
        sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
    });

    QUnit.testStart(function(obj) {
        sendMessage('qunit.testStart', obj.name);
    });

    QUnit.testDone(function(obj) {
        sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total);
    });

    QUnit.moduleStart(function(obj) {
        sendMessage('qunit.moduleStart', obj.name);
    });

    QUnit.moduleDone(function(obj) {
        if (obj.failed === 0) {
            console.log(format(format('\r\u2714', 'green'), 'bold') + ' All assertions passed in the ' + format(format(obj.name, 'cyan'), 'bold') + ' module (' + format(obj.passed + ' passed', 'green') + ')');
        } else {
            console.log('\n' + format(format('\u2716', 'red'), 'bold') + '     assertions failed in the ' + format(format(obj.name, 'red'), 'bold') + ' module (' + format(obj.failed + ' failed', 'red') + ')\n');
        }
        sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
    });

    QUnit.begin(function() {
        sendMessage('qunit.begin');
        console.log('\n\n//-----------------------------------');
        console.log('//');
        console.log('//  ' + format('STARTING WEB SKIN JS TEST SUITE', 'bold'));
        console.log('//');
        console.log('//-----------------------------------\n');
    });

    QUnit.done(function(obj) {
        console.log('\n//-----------------------------------');
        if(obj.failed > 0) {
            console.log(format('>> ', 'red') + format('FAILURE DETAILS:', 'bold'));
        }
        sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
    });
}());