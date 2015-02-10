// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

var scrollspyOffset  = 0;
var scrollHereOffset = 0;

!function ($) { $(function() {

    var $window = $(window);
    var $document = $(document);
    var $body   = $(document.body);
    var $html   = $body.find('html');

    var _client = $.client;
    var isIE    = _client.browser == 'IE';
    var browserVersion = parseInt(_client.version);
    var gtIE8  = !isIE || (isIE && browserVersion > 8);
    var gtIE7  = !isIE || (isIE && browserVersion > 7);

    var bodyAffixOffset = parseFloat($('body').attr('data-offset'));
    var scrollSpyInitialized = false;
    var scrollSpyElemClass  = '.wdesk-docs-sidebar';
    var $sidenavWrapper     = $(scrollSpyElemClass);
    var $sidenav            = $('.wdesk-docs-sidenav');
    var $sidenavFirstElem   = $sidenav.find('li:first');
    var $navbar             = $('.wdesk-docs-navbar');
    var headingMargin       = -40;

    var navHeight           = false;
    var sideBarMargin       = false;

    // for testing
    var testingNavRibbon    = false;
    var navRibbonHeight     = testingNavRibbon ? 60 : 0;

    // which elems do we need to start animations on when they come into view?
    var $animatedElems = $('.progress-spinner, .progress-bar');
    var $overviewSection = $('#overview-section');
    var $lblsBadgeSection = $('#labels-badges-section');
    var $navSection = $('#nav-section');
    var $formSection = $('#forms-section');
    var $tableSection = $('#tables-section');
    var $gridSection = $('#grid-section');
    var $iconSection = $('#icons-section');
    var $spinnerSection = $('#spinners-section');
    var $jsButtonSection = $('#buttons-section.js-buttons');
    var $jsCollapseSection = $('#collapse-section');
    var $popoverSection = $('#popovers-section');
    var $panelSection = $('#panels-section');
    var $datepickerSection = $('#datepicker-section');
    var $helpersSection = $('#helper-classes-section');
    var $colorPaletteSection = $('#color-palette-section');
    var $extendingSassSection = $('#extending-with-sass-section');
    var $inputmaskSection = $('#inputmask-section');

    var queryStringAdded = false;

    //----------------------------------------------
    //+ GLOBAL DOCS HELPER METHODS
    //  (READY AND WILLING)
    //----------------------------------------------
        function filterIconsBySet() {
            var iconSetName = $.getQueryVariable('iconset');
            if (iconSetName) {
                $.selectFilterableGroup(iconSetName);
            }
        }

        function checkQueryString() {
            filterIconsBySet();
        }

        // there is a query string...
        // if you need to do something with it... now's the time.
        if (window.location.search) {
            checkQueryString();
        }

        function addQueryString(qs) {
            queryStringAdded = true;
            var queries = qs.split(';');
            var stateObjects = {};

            for (var i = 0; i < queries.length; i++) {
                var query = queries[i];
                var queryPair = query.split(':');
                var qsVar = queryPair[0];
                var qsVarValue = queryPair[1];
                var stateObject = {};
                stateObject[qsVar] = qsVarValue;
                stateObjects = $.extend(stateObjects, stateObject);
            }

            replaceState(null, stateObjects);
        }

        //
        //
        //

        function getActiveViewingSection () {
            var $activeSidenavElem = $sidenav.find('.active');
            var $activeChildren = $activeSidenavElem.find('.nav').children('.active');
            var numActiveChildren = $activeChildren && $activeChildren.length;
            var $innerMostActiveChild = numActiveChildren > 0 ? $($activeChildren[numActiveChildren - 1]) : $activeSidenavElem;
            return $innerMostActiveChild.find(' > [href]').attr('href');
        }

        function pushState(newHash, query) {
            query = query || history.state;

            if (newHash) {
                newHash = newHash.lastIndexOf('#') > -1 ? newHash : '#' + newHash;
                // console.log('pushing history state: ' + newHash);
                history.pushState && history.pushState(query, null, document.location.pathname + newHash);
            } else {
                history.pushState && history.pushState(query, null, document.location.pathname);
            }

            if (query) {
                checkQueryString();
            }
        }

        function replaceState(newHash, query) {
            query = query || history.state;
            var stateHash = newHash ? '#' + newHash : document.location.hash;

            if(!newHash && !query) {
                // its a scrollspy refresh, update scroll position to current active sidenav loc
                var activeHref = getActiveViewingSection();
                scrollHere(activeHref);
            } else {
                pushState(stateHash, query);
            }
        }

        function getAffixOffset () {
            // measurement helpers
            sideBarMargin        = sideBarMargin || parseInt($sidenav.css('margin-top'), 10);
            navHeight            = navHeight || $navbar.outerHeight(true) + navRibbonHeight;
            var sideBarOffsetTop = $sidenav.offset().top;

            return sideBarOffsetTop - navHeight - sideBarMargin - 15;
        }

        function getScrollspyOffset () {
            sideBarMargin        = sideBarMargin || parseInt($sidenav.css('margin-top'), 10);
            navHeight            = navHeight || $navbar.outerHeight(true) + navRibbonHeight;
            scrollspyOffset      = scrollspyOffset !== 0 ? scrollspyOffset : navHeight + sideBarMargin + headingMargin;
            scrollHereOffset     = -1 * (scrollspyOffset / 2);
            return scrollspyOffset;
        }

        function stripHash () {
            return location.pathname + location.search;
        }

        function toTitleCase (str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

        function scrollHere(href, offset, ev) {
            var userTriggeredScroll = offset ? true : false;
            offset = offset || scrollHereOffset;

            var target          = href,
                $target         = $(target),
                targetExists    = $target.length,
                offsetMethod    = null,
                cleanLoc        = stripHash(),
                hash            = target.replace('#', ''),
                hashTitle       = hash.replace(/-/g, ' '),
                gaPage          = cleanLoc.replace('/index.html', '/') + hash,
                fullLocation    = window.location.protocol + '//' + window.location.hostname + gaPage;

            // if the browser supports HTML5 history... permalink their location
            if(history.pushState) {
                ev && ev.preventDefault(); // prevent browser scroll if history.replaceState works
            }

            if(targetExists) {
                offsetMethod = $body[0] === window ? 'position' : 'offset';
                $('html, body').scrollTop($target[offsetMethod]().top + offset);

                if(userTriggeredScroll) {
                    pushState('#' + hash);
                    try {
                        // track this as a pageview
                        ga('set', 'title', toTitleCase(hashTitle) + ' · ' + document.title);
                        ga('set', 'location', fullLocation);
                        ga('send', 'pageview');
                    } catch(e) {
                        // something went wrong with ga
                    }
                }
            } else {
                // there is no elem with this ID on the page.
                console.log('ERROR: function scrollHere(' + href + ', ' + offset + '): No elem with id = ' + target + ' found.');
            }
        }

        function selectAllNodeText($elems) {
            return $elems.each(function() {
                $(this).on('click', function(event) {
                    var range,
                        sel,
                        node = event.target;

                    range = document.createRange();
                    range.selectNodeContents(node);

                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                });
            });
        }

        // data-api for selectAllNodeText
        $(document).on('click.wdesk.selectAllNodeText', '[data-select-node-text-on-click]', function(event) {
            selectAllNodeText($(event.target));
        });
    // -------------------------

    //----------------------------------------------
    //+ CORE INITIALIZATIONS
    //  (FIRST BEFORE ANY DEMO JS)
    //----------------------------------------------

        // Make sure top navigation links don't take the user out of
        // a full screen app experience if thats what they are in
        if (('standalone' in window.navigator) && window.navigator.standalone) {
            $document.on('click', 'a', function (e) {
                var $this = $(this);
                e.preventDefault();
                var newLocation = $this.attr('href');
                if (newLocation !== undefined && newLocation.substr(0, 1) != '#' && $this.attr('data-method') === undefined){
                    window.location = newLocation;
                }
            });
        }


        // DOCUMENTATION OPTIONS CONFIGURATION
        // -------------------------
        function initializeDocsJsOptions () {

            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsOptions(begin)');

            // boolean localStorage var we'll use to keep track of
            // whether or not we have stored any option data for them
            var optsStored = 'docs-opts-stored';

            // button that triggers the options menu
            var $optMenuBtn = $('.wdesk-docs-navbar [data-toggle=options]');

            // form where we control these options
            var $optionsForm = $('#docs-options form');
            var $listOptions = $optionsForm.find('select[data-option-key]');
            var $boolOptions = $optionsForm.find('input[type=checkbox][data-option-key]');
            // CSS class prefix we use to modify DOM element visibility
            // .{optionClassPrefix}{optionsKeys[key]}-on|off
            var optionClassPrefix = 'docs-opts-';
            // currently, no class is added to $body if option is turned ON, so we only need to store the suffix used if OFF
            var optionClassSuffix = '-off';

            // named vars showing equivalence between state of DOM
            // and how we save the option to localStorage
            var checked = 'true';
            var unchecked = 'false';
            var noselection = '';


            // HELPER METHODS
            // -------------------------

            var _getStoredOptionName = function(key) {
                return optionClassPrefix + key;
            };

            var _getDomOptionClassName = function(key) {
                return _getStoredOptionName(key) + optionClassSuffix;
            };

            var _getStoredItem = function(key) {
                return $.localStorage.getItem(key);
            };

            var _setStoredItem = function(key, value) {
                var gaScriptAsyncDelay = 1000;
                var gaScriptAsyncDelayMsg = 'Google Analytics async still has not completed after a ' + gaScriptAsyncDelay + 'ms delay... no docs options tracked.';

                // Update GA custom dimensions/metrics
                if(key !== optsStored) {
                    // try to fix async timing issues on pages
                    // that don't take long to load content (like landing page)
                    if (typeof ga !== 'undefined') {
                        _trackStoredOption(key, value);
                    } else {
                        setTimeout(function() {
                            if (typeof ga !== 'undefined') {
                                _trackStoredOption(key, value);
                            } else {
                                console.log(gaScriptAsyncDelayMsg);
                            }
                        }, gaScriptAsyncDelay);
                    }
                }

                // Send GA event ONLY if something has changed
                if(value !== _getStoredItem(key)) {
                    if (typeof ga !== 'undefined') {
                        _trackStoredOptionEvent(key, value);
                    } else {
                        setTimeout(function() {
                            if (typeof ga !== 'undefined') {
                                _trackStoredOptionEvent(key, value);
                            } else {
                                console.log(gaScriptAsyncDelayMsg);
                            }
                        }, gaScriptAsyncDelay);
                    }
                }

                $.localStorage.setItem(key, value);
            };

            var _trackStoredOptionEvent = function(key, value) {
                ga('send', 'event', 'Set Option(s)', key, value);
            };

            var _trackStoredOption = function(key, value) {
                // Associate Options with GA custom dimensions
                // http://bit.ly/18iD0l6
                //
                // NOTE: If you add an option to navbar-docs-options.html
                // you MUST add it to the docsOptions array below in the INDEX that
                // matches the INDEX within the Analytics Property.
                // -------------------------
                var optPrefix = optionClassPrefix;
                var docsOptions = [
                    optPrefix + 'user-type'      // ga dimension1
                  , optPrefix + 'code'           // ga dimension2
                  , optPrefix + 'code-snippets'  // ga dimension3
                  , optPrefix + 'design-assets'  // ga dimension4
                  , optPrefix + 'code-angularjs' // ga dimension5
                  , optPrefix + 'device-type'    // ga dimension6
                  , optPrefix + 'device-touch'   // ga dimension7
                  , optPrefix + 'device-mouse'   // ga dimension8
                  , optPrefix + 'design-notes'   // ga dimension9
                  , optPrefix + 'dev-notes'      // ga dimension10
                ];

                if(value !== '' && typeof value !== 'undefined') {
                    var gaDimIndex = docsOptions.indexOf(key);
                    var gaDimKey;

                    // Set dimension IF its defined in our array
                    if(gaDimIndex > -1) {
                        gaDimKey = 'dimension' + (gaDimIndex + 1);
                        ga('set', gaDimKey, value);
                    } else {
                        console.warn('Key "' + key + '" not found in docsOptions array. No custom GA dimension set.');
                    }
                }
            };

            var _syncBoolOptionLabelClass = function($option, optionChecked) {
                var $boolOptionsLbl = $option.closest('.doc-option-cbox-label');
                $boolOptionsLbl[optionChecked ? 'addClass' : 'removeClass']('active');
            };

            var _showOptionCalloutTitle = function() {
                return '<span class="label label-alt">NEW</span>&nbsp;&nbsp;&nbsp;Viewing Options';
            };

            var _showOptionCalloutContent = function() {
                return '<p class="text-center"><strong>Click this button to customize your <br>Web Skin viewing experience.</strong></p><p class="text-sm text-center"><em>We&rsquo;ll remember your choices next time you pay us a visit!</em></p>';
            };

            var _showOptionCallout = function() {
                var $parent = $optMenuBtn.parent('li');
                $parent
                    .popover({
                        container: 'body',
                        delay: 500,
                        trigger: 'manual',
                        template: '<div class="popover popover-options-navbar popover-fixed"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>',
                        placement: 'auto bottom',
                        modal: true,
                        title: _showOptionCalloutTitle,
                        content: _showOptionCalloutContent
                    });

                setTimeout(function() {
                    if(! $('#docs-options').hasClass('in')) {
                        // don't show them the popover if they've already clicked on the options button
                        $parent.popover('show');

                        ga('send', 'event', 'Option Menu', 'callout');
                    }
                }, 3000);
            };


            // CORE METHODS
            // -------------------------

            var initializeDocBoolOptions = function($option, key) {
                // check the existing css classes on the $body elem
                var initialBodyClasses = $body.attr('class');
                var optionClassName = _getDomOptionClassName(key);
                var optionChecked = $option.prop('checked');
                var optionClassPresentOnBody = initialBodyClasses && initialBodyClasses.indexOf(optionClassName) > -1;

                var domClassUpdateNeeded = false;
                // in this case, we need to add the class to the body to make sure the docs
                // are displaying according to the options set by the user or by defaults.
                if(!optionChecked && !optionClassPresentOnBody) {
                    domClassUpdateNeeded = true;
                }

                _syncBoolOptionLabelClass($option, optionChecked);
                syncRelatedOptionText($option, key);

                storeDocBoolOption(key, optionChecked, domClassUpdateNeeded);
            };

            var initializeDocListOptions = function($option, key) {
                // currently, our list options simply serve as a way to
                // change our boolean options in bulk and/or update some text in the options menu

                syncRelatedOptionText($option, key);
            };

            var _relatedOptionTextKeys = [];
            var $_relatedOptionTextElems = [];
            var syncRelatedOptionText = function($option, key) {
                var $_option = $option;
                var _key = key;

                var _updateText = function(keyIndex) {
                    var _keyIndex = keyIndex;
                    var currentOptionVal = $option.val();

                    if(currentOptionVal && currentOptionVal !== '') {
                        var $textElems = $_relatedOptionTextElems[_keyIndex];
                        $textElems.length &&
                        $.each($textElems, function() {
                            var $this = $(this);
                            var lblText = $this.attr('data-lbl-' + currentOptionVal);
                            if(lblText && typeof lblText !== 'undefined') {
                                $this.text(lblText);
                            }
                        });
                    }
                };

                // only run this once per option key
                var $keyRelatedTextElems;
                if(_relatedOptionTextKeys.indexOf(_key) === -1) {
                    _relatedOptionTextKeys.push(_key);

                    $keyRelatedTextElems = $optionsForm.find('[data-option-related-text-key="' + _key + '"]');

                    if(typeof $keyRelatedTextElems !== 'undefined' && $keyRelatedTextElems.length > 0) {
                        $_relatedOptionTextElems.push($keyRelatedTextElems);

                        var keyIndex = _relatedOptionTextKeys.indexOf(_key);
                        // do it once on load
                        _updateText(keyIndex);
                        // then again when the option value changes
                        $option.on('change', function (e) {
                            _updateText(keyIndex);
                        });
                    }
                }
            };

            var syncRelatedBoolOptions = function(optionRelatedKeys, type) {
                var _type = type;
                $.each(optionRelatedKeys, function (index, key) {
                    var $relatedOption = $boolOptions.filter('[data-option-key=' + key + ']');
                    var propCheckMatch = _type == 'off' ? $relatedOption.prop('checked') : ! $relatedOption.prop('checked');

                    if($relatedOption && propCheckMatch) {
                        $relatedOption.trigger('click');
                    }
                });
            };

            var syncGroupedBoolOptions = function(optionGroupKeys, availableOptionKeys) {
                var _availableOptionKeys = availableOptionKeys;
                $.each(optionGroupKeys, function (index, key) {
                    var _groupKey = key;
                    var $allGroupOptions = $();

                    $.each(_availableOptionKeys, function (index, _key) {
                        var _availKey = _key;

                        $allGroupOptions = $allGroupOptions.add($boolOptions.filter('[data-option-group=' + _availKey + ']'));
                    });

                    var $activeGroupOptions   = $allGroupOptions.filter('[data-option-group=' + _groupKey + ']'); // turn these on
                    var $inactiveGroupOptions = $allGroupOptions.not('[data-option-group=' + _groupKey + ']'); // turn these off

                    if($activeGroupOptions) {
                        $.each($activeGroupOptions, function(index, elem) {
                            var $activeGroupOption = $(this);
                            ! $activeGroupOption.prop('checked') && $activeGroupOption.trigger('click');
                        });
                    }

                    if($inactiveGroupOptions) {
                        $.each($inactiveGroupOptions, function(index, elem) {
                            var $inactiveGroupOption = $(this);
                            $inactiveGroupOption.prop('checked') && $inactiveGroupOption.trigger('click');
                        });
                    }
                });
            };

            var wireUpDocBoolOptionDomChanges = function($option, key) {
                var _key = key;
                $option.on('change', function (e) {
                    var optionChecked = $(this).prop('checked');
                    storeDocBoolOption(_key, optionChecked);

                    _syncBoolOptionLabelClass($option, optionChecked);

                    // if data-option-children-off attr is defined, that means that
                    // the option should always turn off its children when it is turned off.
                    var optionRelatedOffKeys = $(this).data('optionRelatedOff');

                    if(optionRelatedOffKeys && !optionChecked) {
                        optionRelatedOffKeys = optionRelatedOffKeys.split(',');
                        syncRelatedBoolOptions(optionRelatedOffKeys, 'off');
                    }

                    // if data-option-children-on attr is defined, that means that
                    // the option should always turn on its children when it is turned on.
                    var optionRelatedOnKeys = $(this).data('optionRelatedOn');

                    if(optionRelatedOnKeys && optionChecked) {
                        optionRelatedOnKeys = optionRelatedOnKeys.split(',');
                        syncRelatedBoolOptions(optionRelatedOnKeys, 'on');
                    }
                });
            };

            var wireUpDocListOptionDomChanges = function($option, key) {
                var _key = key;
                var $availableOptions = $option.find('option[value!=""]');
                var availableOptionKeys = [];
                $availableOptions.each(function() {
                    availableOptionKeys.push($(this).attr('value'));
                });
                $option.on('change', function (e) {
                    var optionName = _getStoredOptionName(_key);
                    var newOptionValue = $(this).val();
                    _setStoredItem(optionName, newOptionValue);

                    // if data-option-group-controller attr is true, that means that
                    // the value in this select controls the on/off state of other options
                    var isGroupController = $(this).data('optionGroupController');

                    if(isGroupController && newOptionValue !== noselection) {
                        var optionGroupKeys = newOptionValue.split(',');
                        syncGroupedBoolOptions(optionGroupKeys, availableOptionKeys);
                    }
                });
            };

            var storeDocBoolOption = function(key, optionChecked, domClassUpdateNeeded) {
                domClassUpdateNeeded = typeof domClassUpdateNeeded !== 'undefined' ? domClassUpdateNeeded : true;

                var optionName = _getStoredOptionName(key);
                var newOptionValue = optionChecked ? checked : unchecked;
                _setStoredItem(optionName, newOptionValue);

                if(domClassUpdateNeeded) {
                    updateDomOptionClass(key);
                }
            };

            var updateDomOptionClass = function(key) {
                $body.toggleClass(_getDomOptionClassName(key));
                if(scrollSpyInitialized) {
                    // only update the scrollspy if it has already been initialized with the correct options
                    setTimeout(function() {
                        // update the sidenav scrollspy
                        // once the DOM visibility changes
                        // have been made
                        $body.scrollspy('refresh');
                        replaceState();
                    }, 10);
                }
            };

            var checkPersistedOptions = function() {

                var hasPersistedOptions = _getStoredItem(optsStored);

                if(!hasPersistedOptions) {
                    _showOptionCallout(); // first time visitor... show 'em what we can do
                    _setStoredItem(optsStored, 'true');
                }

                // check all the list options (selects)
                $.each($listOptions, function (index, elem) {
                    var $this = $(this);
                    var key = $this.data('optionKey');

                    // what option did they have last time they were here?
                    var optionStored = _getStoredItem(_getStoredOptionName(key));

                    if(optionStored !== noselection) {
                        // something other than the default option was selected in a previous session
                        $this.val(optionStored);
                    }

                    parseListOptionsDOM($this, key);
                });

                // check all the boolean options (checkboxes)
                $.each($boolOptions, function (index, elem) {
                    var $this = $(this);
                    var key = $this.data('optionKey');

                    // is the DOM element defaulted to being checked when the page loads?
                    var optionElemOnByDefault = $this.prop('checked');
                    // what option did they have last time they were here?
                    var optionStored = _getStoredItem(_getStoredOptionName(key));

                    if(optionStored === checked && !optionElemOnByDefault) {
                        // if option was activated in a previous visit by this user,
                        // and the default state of $this is deactivated, activate it
                        $this.prop('checked', true);
                    } else if(optionStored === unchecked && optionElemOnByDefault) {
                        // if option was de-activated on a previous visit by this user,
                        // and the default state of $this is activated, de-activate it
                        $this.prop('checked', false);
                    }

                    // once we're done checking for the existence of persisted options,
                    // we'll wire up the options DOM elements for
                    // 1) intial visibility of documentation stuff based on persisted options, and
                    // 2) wire up doc options form elements for potential further modification according to user requests
                    parseBoolOptionsDOM($this, key);
                });
            };

            var parseBoolOptionsDOM = function($option, key) {
                // initialize boolean options on load
                initializeDocBoolOptions($option, key);

                // wire up boolean options for pending changes from user
                wireUpDocBoolOptionDomChanges($option, key);
            };

            var parseListOptionsDOM = function($option, key) {
                // initialize list options on load
                initializeDocListOptions($option, key);

                // wire up list options for pending changes from user
                wireUpDocListOptionDomChanges($option, key);
            };

            // kick it off
            checkPersistedOptions();

            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsOptions(end)');

        } // END initializeDocsJsOptions()

        // DOCUMENTATION CORE JS
        // -------------------------
        function initializeDocsJsCore () {

            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsCore(begin)');


            // CORE JS METHODS
            // -------------------------
                function docsNavbarMenuMutex () {
                    if(! docsNavbarMutexRegistered) {

                        var $otherNavbarButtons = $('.wdesk-docs-navbar .navbar-nav .hitarea').not($optionsMenuToggleBtn);

                        $otherNavbarButtons.on('click', function (e) {
                            if($optionsMenu.hasClass('in')) {
                                $optionsMenuToggleBtn.trigger('click');
                            } else {
                                // console.log('options menu is not open... do nothing');
                            }
                        });

                        $optionsMenuToggleBtn.on('click', function (e) {
                            if($docsMenu.hasClass('in')) {
                                $docsMenuToggleBtn.trigger('click');
                            } else {
                                // console.log('docs menu is not open... do nothing');
                            }
                        });

                        docsNavbarMutexRegistered = true;
                    }
                }

                function toggleDocOptionsMenu (that, ev) {
                    var _this   = that;
                    var $this   = $(_this);
                    var $parent = $this.parent('li');
                    var target  = $this.data('target');
                    var $target = $(target);
                    var $overlay = $('#docs-options-backdrop');

                    var isShown = $target.hasClass('in');

                    var optionsEvent = $.Event(isShown ? 'hide' : 'show' + '.docs.options');

                    var hideOpenDropdowns = function() {
                        var $openDropdowns = $chosenDropdowns.filter('.open');
                        $openDropdowns.find('.btn').trigger('mousedown.chosen');
                    };

                    if(optsNavbarPaneOpened < 1) {
                        $target
                            .on('show.docs.options', function (e) {
                                $overlay
                                    .on('click', function (e) {
                                        $optionsMenuToggleBtn.trigger('click');
                                    })
                                    .removeClass('hide');

                                ga('send', 'event', 'Option Menu', 'show');
                            })
                            .on('hide.docs.options', function (e) {
                                $overlay.addClass('hide');

                                hideOpenDropdowns();

                                ga('send', 'event', 'Option Menu', 'hide');
                            });
                    }

                    $parent
                        .toggleClass('active')
                        .popover('hide');

                    $target
                        .trigger(optionsEvent)
                        .toggleClass('in');

                    optsNavbarPaneOpened++;
                }

                function permalinkIt (currentHash, permalinkHash, permalinkText) {
                    if(currentHash != permalinkHash) {
                        pushState(permalinkHash);

                        currentHash = permalinkHash;

                        // record GA event to signify that someon is interested in permalinking a section
                        ga('send', 'event', 'Permalink', permalinkText, 'Heading: ' + permalinkText);
                    }
                }
            // -------------------------


            // CORE JS VARS
            // -------------------------
                // Collapsing docs options menu vars
                var optsNavbarPaneOpened = 0;
                var docsNavbarMutexRegistered = false;

                var docsMenuRef = '.docs-nav-collapse';
                var $docsMenu = $(docsMenuRef);
                var $docsMenuToggleBtn = $('.wdesk-docs-navbar [data-target="' + docsMenuRef + '"]');
                var $optionsMenu = $('#docs-options');
                var $optionsMenuToggleBtn = $('.wdesk-docs-navbar [data-toggle="options"]');
                var $chosenDropdowns = $('#docs-options .chosen-container');
                //
                // Sidenav menu vars
                // measurement helpers
                sideBarMargin   = parseInt($sidenav.css('margin-top'), 10);
                navHeight       = $navbar.outerHeight(true) + navRibbonHeight;
            // -------------------------


            // HOOK UP LONG-LIVING CLICK EVENTS
            // -------------------------
                $document
                    // prevent submission of forms in docs examples
                    .on('click', '.wdesk-docs-example [type=submit]', function (e) {
                        e.preventDefault();
                    })
                    // disable href clicks when they are within an example
                    .on('click', '.wdesk-docs-example [href^=#]', function (e) {
                        e.preventDefault();
                    })
                    // hook up query strings for custom content filtering within docs pages
                    .on('click', '.wdesk-docs-section [data-content-query]', function(e) {
                        e.preventDefault();
                        addQueryString($(this).data('content-query'));
                    })
                    // hook up section anchors within the docs content area
                    .on('click', '.wdesk-docs-section [href^=#]:not([data-toggle])', function (e) {
                        var ev = e;
                        var $el = ev && $(ev.target);

                        // check to see if its just a href="#"
                        if(ev.target.getAttribute('href').length > 1) {
                            try {
                                scrollHere(ev.target.getAttribute('href'), scrollHereOffset, ev);
                            } catch(err) {

                            }
                        }
                    })
                    // hook up section anchors within the sidenav
                    .on('click', '.wdesk-docs-sidenav [href^=#]', function (e) {
                        var ev = e;
                        var $el = ev && $(ev.target);

                        var isActive = $el.parent('.active').length > 0;
                        var hasActiveChildren = $el.parent().find('.nav').children('.active').length > 0;

                        if(isActive && !hasActiveChildren) {
                            // disable sidebar links if they are activated
                            e.preventDefault();
                        } else {
                            // its not the active link... scroll there.
                            scrollHere(ev.target.getAttribute('href'), scrollHereOffset, ev);
                        }
                    })
                    .on('click.docs.options.data-api', '[data-toggle=options]', function (e) {
                        var ev = e;
                        toggleDocOptionsMenu(this, ev);
                    });
            // -------------------------


            // Initialize collapsing docs options menu
            // -------------------------
                // register the mutex
                docsNavbarMenuMutex();
            // -------------------------


            // Initialize side bar navigation
            // -------------------------
                $sidenav.affix({
                    offset: {
                        top: function () {
                            return (this.top = getAffixOffset());
                        }
                      , bottom: function () {
                            return (this.bottom = $('.wdesk-docs-footer').outerHeight(true));
                        }
                    }
                });
                // if nothing is active, activate the first one
                var activeSection = $sidenav.find('li').hasClass('active');
                if(! activeSection) {
                    $sidenavFirstElem.addClass('active');
                }
                $sidenav.addClass('in');


                // hook up scrolling for section navigation
                // -------------------------
                setTimeout(function () {
                    // wait for the page to load completely before taking measurements
                    scrollspyOffset = getScrollspyOffset();
                    $body.scrollspy({
                        target: scrollSpyElemClass,
                        offset: scrollspyOffset
                    });
                    scrollSpyInitialized = true;
                }, 2000);

                // make sure scrollspy locations are refreshed when window is resized
                $window.smartresize(function() {
                    if (scrollSpyInitialized) {
                        $body.scrollspy('refresh');
                        replaceState();
                    }
                });
            // -------------------------


            // Initialize chosen.js elems
            // -------------------------
            if(gtIE7) {
                var $selectElems = $('select.chosen');
                if($selectElems.length > 0) {
                    $selectElems.chosen({
                        inherit_select_classes: true
                    });
                }
            }


            // Initialize placeholder support for IE9 and below
            // -------------------------
            if(isIE && browserVersion < 10) {
                $('input.form-control, textarea.form-control').placeholder();
            }


            // Initialize docs permalinks
            // -------------------------
            if(gtIE7) {
                var currentHash = document.location.hash;

                // permalink rows of large tables (like js option tables)
                var $tableRows = $('tr[id]');

                $.each($tableRows, function () {
                    var $this = $(this);
                    var rowID = $this.attr('id');
                    var $heading = $this.find('>th:first');
                    var headingText = $heading.text();

                    $heading.click(function (e) {
                        permalinkIt(currentHash, rowID, headingText);
                    });
                });


                // permalink section headings
                var $sectionHeadings = $('.wdesk-docs-section h1[id], .wdesk-docs-section h2[id], .wdesk-docs-section > h3[id], .wdesk-docs-section > h4[id]');

                $.each($sectionHeadings, function () {
                    var $this = $(this);
                    var headingID = $this.attr('id');
                    var headingText = $this.text();
                    $this
                        .tooltip({
                            delay: 1200,
                            template: '<div class="tooltip docs-tooltip"><div class="arrow"></div><div class="inner"></div></div>',
                            placement: 'auto bottom',
                            container: '.wdesk-docs-section',
                            title: 'Click to permalink the <strong>' + headingText + '</strong> section',
                            html: true
                        })
                        .click(function (e) {
                            permalinkIt(currentHash, headingID, headingText);
                        });
                });
            }
            // -------------------------


            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsCore(end)');

        } // END initializeDocsJsCore()

    //----------------------------------------------


    //----------------------------------------------
    //+ DEMO JS
    //  Run after initializeDocsJsCore is finished
    //----------------------------------------------

        function initializeDocsJsDemos () {

            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsDemos(begin)');


            //----------------------------------------------
            //+ BRAND ICO ASSET DOWNLOAD LOGIC
            //----------------------------------------------
            var brandIcoAssetTblSelector = '#branding-downloads-table';
            var brandIcoAssetTblRowSelector = brandIcoAssetTblSelector + ' .asset-download-row';
            var $frame = $('.brand-consistency-frame');
            var $frameImages = $('.img-reveal-on-dl-row-hover', $frame); // the images we'll reveal based on which row is hovered
            var $revealThisImg;

            $(brandIcoAssetTblSelector).hover(function() {
                $frame.toggleClass('dl-row-is-hovered');
            });
            $(brandIcoAssetTblRowSelector).hover(function () {
                $revealThisImg = $frameImages.filter('[data-reveal-on=' + $(this).data('download') + ']');
                $revealThisImg.addClass('reveal-img');
            }, function () {
                $revealThisImg.removeClass('reveal-img');
            });

            var $imgTips = $(brandIcoAssetTblSelector).find('.sizes [rel=tooltip]');
            $imgTips.tooltip({
                html: true,
                placement: 'right auto',
                delay: {
                    show: 500,
                    hide: 0
                },
                title: function () {
                    return $('<img src="' + $(this).attr('href') + '" width="' + $(this).data('imgWidth') + '" height="' + $(this).data('imgHeight') + '">');
                }
            });
            // delay the placement of the tooltip since the image height throws it off
            // $imgTips.one('show.wdesk.tooltip', function (event) {
            //     event.preventDefault();

            //     $(this).tooltip('show');
            // });


            //----------------------------------------------
            //+ OVERVIEW DEMOS
            //----------------------------------------------
            if($overviewSection.length > 0) {
                var containerClass = 'wdesk-docs-container';
                var $container = $('.' + containerClass);
                var $containerWidthDemoToggle = $('#wdesk-docs-container-width-toggle');
                var $containerWidthRadios = $('input:radio', $containerWidthDemoToggle);
                var $activeRadio = $containerWidthRadios.filter(':checked');

                $containerWidthRadios.on('change', function (e) {
                    var $changed = $(e.target);

                    if (!$changed.is($activeRadio)) {
                        $container[e.target.id === 'normal' ? 'removeClass' : 'addClass']('container-wide');
                        $activeRadio = $changed;
                    }
                });
            }


            //----------------------------------------------
            //+ LABELS / BADGE DEMOS
            //----------------------------------------------
            if($lblsBadgeSection.length > 0) {
                var $doctypeTbl = $('#doctype-label-variant-table');

                var $detailContainers = $doctypeTbl.find('.doctype-group-list');
                var $detailToggle = $('#doctype-group-detail-toggle');

                $detailToggle.on('change', function (e) {
                    var $this = $(this);

                    $detailContainers[$this.prop('checked') ? 'removeClass' : 'addClass']('hide');
                });

                var $clickableToggle = $('#doctype-group-clickable-toggle');

                $clickableToggle.on('change', function (e) {
                    var $this = $(this);
                    var isChecked = $this.prop('checked');

                    // add .hitarea class to all <label> elements
                    // so user can see the hover effect on clickable doctype labels
                    var $actualLabels = $doctypeTbl.find('.label');
                    $actualLabels[isChecked ? 'addClass' : 'removeClass']('hitarea');

                    // add/remove .hitarea class to code examples
                    var $labelCodeExamples = $doctypeTbl.find('code');
                    $.each($labelCodeExamples, function() {
                        var existingMarkup = $labelCodeExamples.html();

                        if (isChecked) {
                            // add .hitarea class to example code
                            $labelCodeExamples.html(existingMarkup.replace('class="label bg', 'class="label hitarea bg'));
                        } else {
                            // remove .hitarea class from example code
                            $labelCodeExamples.html(existingMarkup.replace('class="label hitarea bg', 'class="label bg'));
                        }
                    });
                });
            }


            //----------------------------------------------
            //+ NAV DEMOS
            //----------------------------------------------
            if($navSection.length > 0) {

                // COLLAPSIBLE NAV DEMO
                var $collapsingNavDemo      = $navSection.find('#collapsing-nav-list-example');
                var $collapsingNavSections  = $collapsingNavDemo.find('.nav-list.collapse');
                var $navSectionContentElems = $('#collapsing-nav-list-content').find('[data-folder-key]');

                var $activateGroup3Btn      = $navSection.find('#btn_activateGroup3');
                var $collapseAllBtn         = $navSection.find('#btn_collapseAll');

                $collapsingNavSections
                    .on('activate.wdesk.collapse', function (e) {
                        /*
                            The data() within the relatedTarget object on the event
                            contains everything you need to manipulate DOM based on
                            a new element in the nav list becoming activated
                        */
                        var btnData = $(e.relatedTarget).data();

                        /*
                            This contentSelector can be specified
                            as anything that is a valid jQuery selector
                        */
                        var contentSelectorGroups = btnData.targetContent.substr(1, btnData.targetContent.lastIndexOf('-content') - 1).split('_');
                        // we only go two levels deep for this demo
                        var contentFuzzySelector = contentSelectorGroups[0];
                        if (contentSelectorGroups.length > 1) {
                             contentFuzzySelector += '_' + contentSelectorGroups[1];
                             if (contentSelectorGroups.length > 2) {
                                contentFuzzySelector += '_' + contentSelectorGroups[2];
                            }
                        }

                        var dataFilter = '';
                        if(contentFuzzySelector) {
                            if(contentFuzzySelector === 'projects' || contentFuzzySelector === 'my-recent') {
                                if(contentFuzzySelector === 'projects') {
                                    dataFilter = '[data-is-project="true"]';
                                } else {
                                    dataFilter = '[data-is-recent="true"]';
                                }
                            } else {
                                dataFilter = '[data-folder-key*=' + contentFuzzySelector + ']';
                            }

                            $.each($navSectionContentElems, function() {
                                var $this = $(this);
                                var $active = $this.filter(dataFilter);

                                if ($active.length) {
                                    $active
                                        .removeClass('hide')
                                        .attr('aria-hidden', false);
                                } else {
                                    ! $this.hasClass('hide') &&
                                        $this.addClass('hide')
                                             .attr('aria-hidden', true);
                                }
                            });
                        }
                    });

                $activateGroup3Btn
                    .on('click', function (e) {
                        $collapsingNavDemo.find('#workiva_risk-team_group-3-group')
                            .collapse('activate')
                            .collapse('show');

                        /*
                            Equivalent to the data-api initialization:
                            $collapsingNavDemo.find('#btn_riskMenu_grp3').click()

                            Normally, clicking on an element with [data-toggle=collapse]
                            will initialize a collapse instance on the element specified
                            by the clicked element's [data-target] or [href], with the
                            clicked element passed in as the initial _relatedTarget, which
                            will always receive classes related to the collapse element's
                            state.

                            In this case, since there is no _relatedTarget specified,
                            that argument will default to the element specified (by id) by
                            the collapsible element's aria-labelledby attribute. In most
                            cases, this should refer to the same element that would have
                            triggered the collapse element via the data-api.

                            This allows classes related to state to be communicated the
                            same, regardless of how the collapsible element was initialized.
                        */
                    });

                $collapseAllBtn
                    .on('click', function (e) {
                        $collapsingNavDemo.find('> li > .collapse').collapse('hide');
                    });
            } // END if($navSection)
            //----------------------------------------------


            //----------------------------------------------
            //+ FORMS / INPUT DEMOS
            //----------------------------------------------
            if($formSection.length > 0) {

                // remove invalid styling from invalid demo field
                $('input.invalid-demo').keyup(function (e) {
                    if($(this).val() !== '') {
                        $(this).addClass('valid');
                    } else {
                        $(this).removeClass('valid');
                    }
                });

                // checkbox "toggle" demo
                var $cboxSwitchToggle = $('.wdesk-checkbox-switch-example').find('.checkbox-switch input');

                // disable inputs wrapped in .disabled CSS class
                var $disabledCboxes = $('.checkbox.disabled, .checkbox-inline.disabled, .radio.disabled, .radio-inline.disabled', document.body);
                $('> input', $disabledCboxes).prop('disabled', true);

                // tooltip validation demo
                var getValidationTooltipTemplate = function ($input) {
                    var $formGroup = $input.closest('.form-group');
                    var template;

                    if ($formGroup.hasClass('has-warning')) {
                        template = '<div class="tooltip tooltip-warning"><div class="arrow"></div><div class="inner"></div></div>';
                    } else if ($formGroup.hasClass('has-error')) {
                        template = '<div class="tooltip tooltip-error"><div class="arrow"></div><div class="inner"></div></div>';
                    } else if ($formGroup.hasClass('has-success')) {
                        template = '<div class="tooltip tooltip-success"><div class="arrow"></div><div class="inner"></div></div>';
                    } else {
                        // something went wrong... don't know which type of validation tooltip you need
                        throw 'This demo only works for inputs nested within .form-group elems that have the proper has-{state} css class.';
                    }

                    return template;
                };

                var $tooltipValidationDemos = $('.tooltip-validation-demo .form-group');
                var $validationInput = $('.form-control[data-toggle=tooltip]', $tooltipValidationDemos);

                $.each($validationInput, function () {
                    var $this = $(this);

                    $this.tooltip({
                        trigger: 'focus',
                        placement: 'right auto',
                        container: 'body', // so the extents of the form doesn't screw with placement
                        template: getValidationTooltipTemplate($this)
                    });
                });

                    // .on('focus', function (e) {
                    //     // var validationType = $(this).closest($tooltipValidationDemos).attr('class').replace('form-group ', '');
                    //     // console.log(validationType);
                    //     var $this = $(this);
                    //     $(this)
                    // });

            } // END if($formSection)
            //----------------------------------------------


            //----------------------------------------------
            //+ INPUTMASK PLUGIN DEMOS
            //----------------------------------------------
            if($inputmaskSection.length > 0) {
                var $demoValInput = $('#unmaskedValueDemo');
                var $maskedValuePrintout = $('#printMaskedValue');
                var $unmaskedValuePrintout = $('#printUnmaskedValue');

                var printValues = function() {
                    var demoVal = $demoValInput.val();
                    var hasData = $demoValInput.data('wdesk.inputmask');
                    var demoValUnmasked = hasData ? hasData.unmaskedValue : '';

                    $maskedValuePrintout.text('"' + demoVal + '"');
                    $unmaskedValuePrintout.text('"' + demoValUnmasked + '"');
                };

                printValues(); // do it once on load
                $('#unmaskedValueDemo').on('keyup.wdesk.inputmask', function (e) {
                    printValues();
                });
                $('#unmaskedValueDemo').on('focus', function (e) {
                    printValues();
                });
                $('#unmaskedValueDemo').on('blur', function (e) {
                    printValues();
                });
            } // END if($formSection)
            //----------------------------------------------


            //----------------------------------------------
            //+ TABLE DEMOS
            //----------------------------------------------
            // if($tableSection.length > 0) {

                // Table sortable demo
                // -------------------------
                    var sortedClass = 'sorted';
                    var $sortableTable = $('.table-sortable');

                    var getSortedColIndex = function() {
                        var sortedIndex;

                        if($sortTblCols.length > 0) {
                            $.each($sortTblCols, function(index, Element) {
                                var $this = $(this);
                                if( $this.hasClass(sortedClass) ) {
                                    sortedIndex = index;
                                    return false;
                                }
                            });
                            return sortedIndex;
                        } else {
                            return false;
                        }
                    };

                    if($sortableTable.length > 0) {

                        var $sortTblHeaders = $('.table-sortable > thead > tr > th[data-sort-by]');
                        var $sortTblCols = $('.table-sortable > colgroup > col');
                        var sortedColIndex = getSortedColIndex();

                        $.each($sortTblHeaders, function(index, Element) {

                            $(this).click(function(){

                                if( $(this).hasClass(sortedClass) ) {
                                    if( $(this).hasClass('ascending') ) {
                                        $(this).removeClass('ascending').addClass('descending');
                                    } else {
                                        $(this).removeClass('descending').addClass('ascending');
                                    }
                                } else {
                                    if( $(this).hasClass('ascending') || $(this).hasClass('descending') ) {
                                        // leave the default sort
                                    } else {
                                        $(this).addClass('ascending');
                                    }
                                }

                                $(this).parent('tr').find('th').removeClass(sortedClass);
                                $(this).addClass(sortedClass);

                                $('colgroup col.sorted').removeClass(sortedClass);
                                $sortTblCols.filter(':eq(' + index + ')').addClass(sortedClass);

                            });

                        });
                    }

                // Table selectable demo
                // -------------------------
                    var selectedClass = 'selected';
                    var $selectableDemoTable = $('.table-selectable');
                    var $selectableRows;
                    var $selectableRowCboxes;

                    var selectRow = function($row, cboxClicked) {
                        var $checkbox = $row.find(':checkbox');
                        var checkboxParentId = $checkbox.data('cboxGroup');

                        if(!cboxClicked) {
                            $checkbox.prop('checked') ? $checkbox.prop('checked', false) : $checkbox.prop('checked', true);
                            $checkbox.trigger('change');
                        }

                        if(checkboxParentId) {
                            updateCboxGroupParent(checkboxParentId);
                        }

                        $checkbox.prop('checked') ? $row.addClass(selectedClass) : $row.removeClass(selectedClass);
                    };

                    var initCboxGroupParent = function() {
                        var $selectedCboxes = $selectableRows.find(':checkbox').filter(':checked');
                        var checkboxParentId = false;
                        if($selectedCboxes && $selectedCboxes.length > 0) {
                            checkboxParentId = $selectedCboxes.filter(':first').data('cboxGroup');
                            updateCboxGroupParent(checkboxParentId);
                        } else {
                            checkboxParentId = $selectableDemoTable.find('thead :checkbox').attr('id');
                        }

                        $('#' + checkboxParentId).on('click', function (e) {
                            var $toggleTheseCboxes;
                            if($(this).prop('checked')) {
                                $toggleTheseCboxes = $selectableRowCboxes.not(':checked');
                            } else {
                                $toggleTheseCboxes = $selectableRowCboxes.filter(':checked');
                            }

                            $toggleTheseCboxes.closest('tr').trigger('click.cbox-demo');
                        });
                    };

                    var updateCboxGroupParent = function(checkboxParentId) {
                        var $parentCbox = $('#' + checkboxParentId);
                        var selectableRowCount = $selectableRows.length;
                        var selectedRowCount = $selectableRowCboxes.filter(':checked').length;

                        if(selectedRowCount === 0) {
                            $parentCbox
                                .prop('indeterminate', false)
                                .prop('checked', false);
                        } else if(selectedRowCount < selectableRowCount) {
                            $parentCbox
                                .prop('indeterminate', true)
                                .prop('checked', false);
                        } else if(selectedRowCount === selectableRowCount) {
                            $parentCbox
                                .prop('indeterminate', false)
                                .prop('checked', true);
                        } else {
                            // should never get here
                        }
                    };

                    if($selectableDemoTable.length > 0) {

                        $selectableRows = $selectableDemoTable.find('tbody > tr');
                        $selectableRowCboxes = $selectableRows.find(':checkbox');

                        initCboxGroupParent();

                        $selectableRows.on('click.cbox-demo', function(e) {

                            var $checkbox = $(this).find('.checkbox');
                            var wasCboxClicked = e && ($(e.target).is($checkbox) || $(e.target).closest($checkbox).length > 0);

                            selectRow($(this), wasCboxClicked);

                        });
                    }


            // } // END if($tableSection)

            function makePseudoContentSelectable($elems, pseudoElemSelector) {
                pseudoElemSelector = pseudoElemSelector || ':before';

                var pseudoStyle,
                    swatchHex,
                    computedStyleSupport = true;

                $elems.each(function() {
                    try {
                        pseudoStyle = window.getComputedStyle($(this)[0], pseudoElemSelector);
                    } catch(err) {
                        // browser doesn't support getComputedStyle()
                        computedStyleSupport = false;
                    }

                    // if browser supports computed styles
                    // copy the CSS :before content value into a data attribute
                    // on each individual cell
                    if (computedStyleSupport) {
                        swatchHex = pseudoStyle.getPropertyValue('content').replace(/["']/g, '');
                        $(this).attr('data-pseudo-content', swatchHex);
                    }
                });

                // if browser supports computed styles
                if (computedStyleSupport) {
                    // Repaint the DOM repaint all at once
                    $elems
                        .addClass('js-content-replaced')
                        .attr('title', 'click to select the elem value')
                        .html(function() {
                            return $(this).attr('data-pseudo-content') + '\n<div class="clearfix"></div>\n' + $(this).html();
                        });

                    // Wire up click to select all text
                    selectAllNodeText($elems);
                }
            }

            function colorReferenceInfo(flexConstant, sassApiVar) {
                return  '<table class="table table-bordered">\n' +
                        '    <tbody>\n' +
                        '        <tr>\n' +
                        '           <th>FLEX:</th>\n' +
                        '           <td data-select-node-text-on-click><code>' + flexConstant + '</code></td>\n' +
                        '        </tr>\n' +
                        '        <tr>\n' +
                        '           <th>SCSS:</th>\n' +
                        '           <td data-select-node-text-on-click><code>' + sassApiVar + '</code></td>\n' +
                        '        </tr>\n' +
                        '    </tbody>\n' +
                        '</table>\n';
            }

            if ($extendingSassSection.length > 0) {
                makePseudoContentSelectable($extendingSassSection.find('.swatch.scss-output'), ':before');
            }

            if ($colorPaletteSection.length > 0) {
                var $colorCells = $colorPaletteSection.find('td.scss-output');
                makePseudoContentSelectable($colorCells, ':before');

                // show the flex constant / sass api var in a tooltip on hover
                $colorCells.each(function() {
                    var flexConstant = $(this).attr('data-flex-constant');
                    var sassApiVar = $(this).attr('data-sass-api-var');
                    var cellValue = $(this).attr('data-pseudo-content');

                    $(this).find('> .icon-info-sign')
                        .popover({
                            container: 'body',
                            html: true,
                            title: function() {
                                return 'Using <code>' + cellValue  + '</code> in Wdesk apps';
                            },
                            content: colorReferenceInfo(flexConstant, sassApiVar),
                            template: '<div role="tooltip" class="popover popover-tip"><div class="arrow" aria-hidden="true"></div><div class="inner"><h3 class="title"></h3><div class="content"></div></div></div>'
                        });
                });
            }

            //----------------------------------------------


            //----------------------------------------------
            //+ PROGRESS DEMOS
            //----------------------------------------------
            if($spinnerSection.length > 0) {

                // DOWNLOADING PROGRESS SPINNER DEMO
                // -------------------------
                    $('#download-demo').click(function(){
                        var $btn = $(this);
                        var $icon = $('> .icon', this);
                        $btn.button('downloading');
                        $icon.removeClass('icon-download-available icon-downloaded')
                            .addClass('icon-downloading');
                        setTimeout(function(){
                            $btn.button('complete');
                            $icon.removeClass('icon-downloading')
                                 .addClass('icon-downloaded');
                        }, 5000);
                    });
            } // END if($spinnerSection)
            //----------------------------------------------


            //----------------------------------------------
            //+ GRID DEMOS
            //----------------------------------------------
            if($gridSection.length > 0) {
                // add tipsies to grid for scaffolding
                if ($('#grid-system').length) {
                  $gridSection.tooltip({
                      selector: '.show-grid > [class*=span]'
                    , title: function () { return $(this).width() + 'px'; }
                  });
                }
            } // END if($gridSection)
            //----------------------------------------------


            //----------------------------------------------
            //+ JS BUTTON DEMOS
            //----------------------------------------------
            if($jsButtonSection.length > 0) {
                $('#loading-btn-state-demo').click(function () {
                    var $btn = $(this);
                    $btn.button('loading');
                    setTimeout(function () {
                        $btn.button('reset');
                    }, 3000);
                });
            } // END if($jsButtonSection)


            //----------------------------------------------
            //+ JS COLLAPSE DEMOS
            //----------------------------------------------
            if($jsCollapseSection.length > 0) {
                var collapseID = 'demoCollapse';
                var $collapsedContent = $('#' + collapseID);
                var $collapseButton = $('[data-target=#' + collapseID + ']');

                var contentState = {
                    hide: {
                        btn_class: $collapseButton.attr('class'),
                        btn_text:  $collapseButton.text()
                    },
                    show: {
                        btn_class: 'btn btn-error',
                        btn_text:  'Close'
                    }
                };

                $collapsedContent
                    .on('show.wdesk.collapse', function (e) {
                        $collapseButton
                            .attr('class', contentState.show.btn_class)
                            .text(contentState.show.btn_text);
                    })
                    .on('hide.wdesk.collapse', function (e) {
                        $collapseButton
                            .attr('class', contentState.hide.btn_class)
                            .text(contentState.hide.btn_text);
                    });
            } // END if($jsCollapseSection)


            //----------------------------------------------
            //+ HELPER CLASS DEMOS
            //----------------------------------------------


            //----------------------------------------------
            //+ PANEL NOTES / COMMENTS DEMOS
            //----------------------------------------------

            // bind cancel/affirm behavior to modals and their comments
            function cancelPanelComment($modal) {
                var $confModal = $modal;
                var $thread = $confModal.closest('.panel-comments-thread');
                var $comment = $confModal.closest('.comment');
                var $textarea = $comment.find('textarea');
                var initialTextareaVal = $textarea.val();
                var $footer = $comment.find('.comment-footer');

                // remove the value and exit the editing task
                $textarea
                    .css('height', '60px')
                    .val(initialTextareaVal)
                    .trigger('change') // update flextext
                    .prop('readonly', true)
                    .blur();

                if($comment.is('.comment-reply')) {
                    // if it was a reply - hide it
                    $comment.removeClass('show');
                    $textarea
                        .prop('readonly', false)
                        .val(null);

                    $textarea.closest('.flex-text-wrap').find('span').html('');
                }

                if($comment.is('.comment-new')) {
                    $thread.remove();
                } else {
                    $thread.removeClass('comment-editing');
                    $comment.removeClass('comment-editing');
                    $footer.addClass('hide');
                }
            }

            if($panelSection.length > 0) {

                var $panelCommentThreads = $('.panel-comments-thread');
                var $panelComments = $('.panel-comment', $panelSection);
                var $lastPanelCommentOverlay = $panelCommentThreads.find('> .panel-comment.comment-last:not(.comment-editing) .comment-reply-edit-overlay');
                var $panelCommentTextarea = $('.comment-body .form-control', $panelComments);
                var $resizableCommentTextarea = $panelCommentTextarea.not('[readonly]');
                var $threadCollapseWrappers = $panelCommentThreads.find('> .panel:first .panel-collapse');
                var $threadConfirmationModals = $panelCommentThreads.find(' > .confirmation-modal');
                var $replyCollapseWrappers;
                var $editCommentBtns = $('.panel-comments-thread').find('.edit-comment-btn');


                // add `.has-open-menu` CSS clas to thread when dropdown menu is open
                var $threadMenuButtons = $panelCommentThreads.find('.thread-actions > .dropdown');
                $threadMenuButtons
                    .on('show.wdesk.dropdown', function () {
                        $(this).closest('.panel-comments-thread').addClass('has-open-menu');
                    })
                    .on('hide.wdesk.dropdown', function () {
                        $(this).closest('.panel-comments-thread').removeClass('has-open-menu');
                    });

                // hide replies when comment thread is collapsed
                $threadCollapseWrappers
                    .on('hide.wdesk.collapse', function (e) {
                        if(!e.isDefaultPrevented()) {
                            var $this = $(this);
                            $replyCollapseWrappers = $this.closest('.panel-comments-thread').find('.panel-collapse').not($this);

                            $replyCollapseWrappers.collapse('hide');

                            $this.find('.comment-reply-edit-overlay').addClass('hide');
                        }
                    })
                    .on('hidden.wdesk.collapse', function (e) {
                        $(this).closest('.panel-comments-thread').addClass('panel-thread-collapsed');
                    })
                    .on('show.wdesk.collapse', function (e) {
                        if(!e.isDefaultPrevented()) {
                            var $this = $(this);
                            $replyCollapseWrappers = $this.closest('.panel-comments-thread').find('.panel-collapse').not($this);

                            $replyCollapseWrappers.collapse('show');
                        }
                    })
                    .on('shown.wdesk.collapse', function (e) {
                        $(this).closest('.panel-comments-thread').removeClass('panel-thread-collapsed');

                        $(this).find('.comment-reply-edit-overlay').removeClass('hide');
                    });


                // make some threads collapsed by default when the page loads
                var $autoCollapseThreads = $panelCommentThreads.find('.thread-collapse-control[data-auto-collapse]');
                $autoCollapseThreads.click();


                // check to see if a thread is collapsed before launching the delete confirmation modal
                $threadConfirmationModals.on('show.wdesk.modal', function (event) {
                    var deleteThreadButtonClicked = event.relatedTarget;
                    if (deleteThreadButtonClicked) {
                        var $that = $(this);

                        var $collapseTarget = $(event.relatedTarget.data('target'));
                        var $threadWrapper = $collapseTarget.parent('.panel-comments-thread');
                        var isCollapsed = $threadWrapper.hasClass('panel-thread-collapsed');
                        if (isCollapsed) {
                            // don't show yet
                            event.preventDefault();

                            // expand the collapsed thread, and proceed with the modal confirmation once its expanded
                            var $initialCommentCollapseWrapper = $threadWrapper.find('> .panel:first .panel-collapse');
                            $initialCommentCollapseWrapper
                                // use .one() instead of .on() so that our
                                // listener is automatically de-registered
                                .one('shown.wdesk.collapse', function (event) {
                                    $that.modal('show');
                                })
                                .collapse('show');
                        }
                    }
                });

                // $panelCommentThreads.on('click', '.btn-show-delete-thread-modal', function (event) {
                //     var $that = $(this);
                //     var modalOpts = $that.data();
                //     var $confModal = $(modalOpts.target);
                //     $confModal.modal(modalOpts);

                //     var $collapseTarget = $($that.data('target')).parent('.panel-comments-thread');
                //     if ($collapseTarget.hasClass('panel-thread-collapsed')) {
                //         // don't show yet
                //         // expand the collapsed thread, and proceed with the modal confirmation once its expanded
                //         var $firstThreadComment = $collapseTarget.find('> .panel:first .panel-collapse');
                //         $firstThreadComment
                //             .one('shown.wdesk.collapse', function (event) {
                //                 $confModal.modal('show');
                //             })
                //             .collapse('show');
                //     } else {
                //         $confModal.modal('show');
                //     }
                // });


                // bind "Reply" tooltip effect to last comment in a thread
                $lastPanelCommentOverlay
                    .on('click', function (e) {
                        var $target = $(e.target);
                        if($target.not('.edit-comment-btn') && $target.closest('.edit-comment-btn').length === 0) {
                            var $thread = $(this).closest('.panel-comments-thread');
                            var $reply = $thread.find('.comment-reply');
                            var $textarea = $reply.find('textarea');
                            var $footer = $reply.find('.comment-footer');

                            // show the editable comment reply
                            $thread.addClass('comment-editing');
                            $reply.addClass('comment-editing');
                            $reply.addClass('show');
                            $footer.removeClass('hide');
                            $textarea
                                .css('height', '100%') // override the fixed height we apply
                                .prop('readonly', false)
                                .focus();

                            // hide any visible tooltips
                            $('.tooltip').hide();
                        }
                    })
                    .tooltip({
                        title: 'Reply',
                        placement: 'follow'
                    });

                $panelCommentThreads.find('.comment .modal')
                    .on('shown.wdesk.modal', function (e) {
                        if(!e.isDefaultPrevented()) {
                            $(this).closest('.panel-comments-thread').addClass('modal-open overlaid');
                        }
                    })
                    .on('hidden.wdesk.modal', function (e) {
                        if(!e.isDefaultPrevented()) {
                            $(this).closest('.panel-comments-thread').removeClass('modal-open overlaid');
                        }
                    });

                // bind "Edit Comment" tooltip effect
                $editCommentBtns
                    .tooltip({
                        placement: 'left auto',
                        container: 'body'
                    })
                    // prevent dupe tooltips from being open
                    .on('mouseenter', function (e) {
                        // we used a data-target on the comment to ensure the tip would have an ID
                        $('#replyTooltip').hide();
                    })
                    .on('mouseleave', function (e) {
                        $('#replyTooltip').show();
                    })
                    .on('click', function (e) {
                        var $this = $(this);
                        var $thread = $this.closest('.panel-comments-thread');
                        var $comment = $this.closest('.comment');
                        var $textarea = $comment.find('textarea');
                        var $footer = $comment.find('.comment-footer');

                        $textarea
                            .flexText('<pre><span /><br /><br /></pre>')
                            .css('height', '100%') // override the fixed height we apply
                            .prop('readonly', false)
                            .focus();

                        $thread.addClass('comment-editing');
                        $comment.addClass('comment-editing');
                        $footer.removeClass('hide');
                    });

                var refocusComment = false;
                $panelComments.find('.modal')
                    .on('show.wdesk.modal', function(event) {
                        var $confModal = $(this);
                        var $comment = $confModal.closest('.comment');
                        var $textarea = $comment.find('textarea');

                        if ($textarea.val() === '') {
                            // it is an empty comment,
                            // prevent confirmation modal from opening
                            event.preventDefault();

                            // and proceed with the logic as though
                            // the confirmation modal already appeared
                            // to immediately exit from the editing
                            // since the comment/reply was empty
                            cancelPanelComment($confModal);
                        }
                    })
                    .on('shown.wdesk.modal', function(event) {
                        var $confModal = $(this);
                        var $comment = $confModal.closest('.comment');
                        var $textarea = $comment.find('textarea');
                        var $confCancelBtn = $confModal.find('[data-cancel]');
                        var $confAffirmBtn = $confModal.find('[data-affirm]');

                        $confCancelBtn.click(function () {
                            // leave the value as is, and return the user to their editing task
                            refocusComment = true;
                        });
                        $confAffirmBtn.click(function () {
                            refocusComment = false;
                            cancelPanelComment($confModal);
                        });
                    })
                    .on('hidden.wdesk.modal', function(event) {
                        var $confModal = $(this);
                        var $comment = $confModal.closest('.comment');
                        var $textarea = $comment.find('textarea');

                        if (refocusComment) {
                            // leave the value as is, and return the user to their editing task
                            $textarea.focus();
                        }
                    });


                // keep the "focus" appearance on the panel-group when the textarea has focus.
                $resizableCommentTextarea
                    .on('focus', function (e) {
                        $(this).closest('.panel-comments-thread').addClass('panel-focus');
                    })
                    .on('blur', function (e) {
                        $(this).closest('.panel-comments-thread').removeClass('panel-focus');
                    });

                // automatically resize the height of the textarea as the user types
                $resizableCommentTextarea.flexText('<pre><span /><br /><br /></pre>');


                // disable the comment 'save' button unless there is text in the textarea
                var disableEmptyPanelCommentSaveButtons = function(val, $comment, $affirmBtn, $cancelBtn) {
                    if(val.length > 0) {
                        // $popParent.removeClass('empty-comment');
                        $affirmBtn.prop('disabled', false);
                        // $cancelBtn.prop('disabled', false);
                    } else {
                        $affirmBtn.prop('disabled', true);
                        // $cancelBtn.prop('disabled', true);
                    }
                };

                var $panelCommentTextareas = $('.comment-body textarea', '.panel-comments-thread');
                $.each($panelCommentTextareas, function () {
                    var $this = $(this);
                    var id = $this.attr('id');
                    var val = $this.val();
                    var $comment = $this.closest('.comment');
                    var $affirmBtn = $comment.find('[data-enabled-textarea=' + id + ']').filter('.post');
                    var $cancelBtn = $comment.find('[data-enabled-textarea=' + id + ']').filter('.cancel');

                    // initialize on load
                    disableEmptyPanelCommentSaveButtons(val, $comment, $affirmBtn, $cancelBtn);
                    // labelReplyCblockContainer(val, $comment);

                    if($affirmBtn && $cancelBtn) {
                        $this.bind('keyup change', function() {
                            val = $(this).val();

                            // update again on keyup
                            disableEmptyPanelCommentSaveButtons(val, $comment, $affirmBtn, $cancelBtn);
                            // labelReplyCblockContainer(val, $comment);
                        });
                    } // END if($affirmBtn)
                });

                // close / re-open comment threads
                $.each($panelCommentThreads, function() {
                    var $thread = $(this);
                    var $openCloseToggleBtn = $thread.find('.thread-open-close-toggle-btn');
                    var $openCloseToggleIcon = $openCloseToggleBtn.find('.icon');
                    var $openCloseToggleText = $thread.find('.thread-open-close-text');
                    var isClosed = $openCloseToggleBtn.data('threadClosed');

                    $openCloseToggleBtn.on('click', function (e) {
                        isClosed = $openCloseToggleBtn.data('threadClosed');

                        if(isClosed) {
                            $(this).data('threadClosed', false);
                            $openCloseToggleText.text('Resolve');
                            $openCloseToggleIcon
                                .removeClass('icon-comment-reopen')
                                .addClass('icon-comment-checkmark');
                            $thread.removeClass('panel-thread-closed');
                        } else {
                            $(this).data('threadClosed', true);
                            $openCloseToggleText.text('Reopen');
                            $openCloseToggleIcon
                                .removeClass('icon-comment-checkmark')
                                .addClass('icon-comment-reopen');
                            $thread.addClass('panel-thread-closed');
                        }
                    });
                });

            } // END if($panelSection)


            //----------------------------------------------
            //+ POPOVER NOTES / COMMENTS DEMOS
            //----------------------------------------------
            if($popoverSection.length > 0) {

                var $popoverThreads = $('.popover-comment');

                // Single note popover demo
                // -------------------------
                    // add the overlaid class
                    // to the popover so we can darken the arrow
                    var $notePopoverConfirmationModal = $popoverSection.find('.popover .modal');

                    // add the "modal-open" css class to popover any time a modal is shown
                    var $modalConfirmations = $popoverThreads.find('.modal');
                    $.each($modalConfirmations, function(){
                        var $popParent = $(this).closest('.popover');
                        var $commentTextarea = $popParent.find('.comment-editing textarea');

                        $(this)
                            .on('backdrop_shown.wdesk.modal', function(e) {
                                // $popParent.addClass('modal-open');
                            })
                            .on('backdrop_hide.wdesk.modal', function(e) {
                                // $popParent.removeClass('modal-open');
                                // re-focus the textarea when closing the modal
                                $commentTextarea.focus();
                            });

                    });

                    // close / re-open comment threads
                    $.each($popoverThreads, function() {
                        var $thread = $(this);
                        var $openCloseToggleBtn = $thread.find('.thread-open-close-toggle-btn');
                        var $openCloseToggleIcon = $openCloseToggleBtn.find('.icon');
                        var $openCloseToggleText = $thread.find('.thread-open-close-text');
                        var $threadStatusElem = $thread.find('.thread-overlay .thread-status');
                        var $commentTypeIcon = $thread.find('.comment-title > .icon');
                        var isClosed = $openCloseToggleBtn.data('threadClosed');

                        $openCloseToggleBtn.on('click', function (e) {
                            isClosed = $openCloseToggleBtn.data('threadClosed');

                            if(isClosed) {
                                $(this).data('threadClosed', false);
                                $openCloseToggleText.text('Close');
                                $openCloseToggleIcon
                                    .removeClass('icon-comment-reopen')
                                    .addClass('icon-comment-checkmark');
                                $thread.removeClass('popover-thread-closed');
                                $threadStatusElem.text('');
                                $commentTypeIcon
                                    .removeClass('icon-comment-outlined')
                                    .addClass('icon-comment-alt');
                            } else {
                                $(this).data('threadClosed', true);
                                $openCloseToggleText.text('Reopen');
                                $openCloseToggleIcon
                                    .removeClass('icon-comment-checkmark')
                                    .addClass('icon-comment-reopen');
                                $thread.addClass('popover-thread-closed');
                                $threadStatusElem.text('Closed');
                                $commentTypeIcon
                                    .removeClass('icon-comment-alt')
                                    .addClass('icon-comment-outlined');
                            }
                        });
                    });

                    // delete / edit confirmation modal for saved comment in a thread
                    var isRightClick = function(e) {
                        var rightclick = false;
                        if (!e) {
                            e = window.event;
                        }
                        if (e.which) {
                            rightclick = (e.which == 3);
                        } else if (e.button) {
                            rightclick = (e.button == 2);
                        }

                        return rightclick;
                    };

                    var $savedComments = $('.popover-thread').find('.comment-readonly');
                    $.each($savedComments, function() {
                        var $savedComment = $(this);
                        var $confirmationModal = $(this).find('.modal');
                        var $confirmationTriggerBtn = $(this).find('.edit-delete-trigger');

                        $savedComment.on('contextmenu', function (e) {
                            $confirmationTriggerBtn.click();
                            return false;
                        });

                        $confirmationModal
                            .on('shown.wdesk.modal', function (e) {
                                $savedComment.off('contextmenu');
                            })
                            .on('hidden.wdesk.modal', function (e) {
                                $savedComment.on('contextmenu', function (e) {
                                    $confirmationTriggerBtn.click();
                                    return false;
                                });
                            });
                    });


                    // private / shared comment type toggle
                    var $commentTypeToggle = $('.popover-comment').find('.checkbox-switch > input');

                    $commentTypeToggle.each(function() {
                        var $thisComment = $(this).closest('.popover-comment');
                        var $commentTypeIcon = $thisComment.find('.comment-title > .icon');
                        var $commentDeleteBtn = $thisComment.find('.delete-hover');
                        var $commentSaveBtn = $thisComment.find('button[type="submit"]');
                        var $commentTextarea = $thisComment.find('.comment-body > textarea');
                        var $commentTextareaLbl = $thisComment.find('.comment-body > label');

                        var isShared = $(this).prop('checked');
                        $(this).on('change', function (e) {
                            isShared = $(this).prop('checked');

                            if(isShared) {
                                $commentTypeIcon
                                    .removeClass('icon-comment-private-note')
                                    .addClass('icon-comment-alt');
                                $commentDeleteBtn.text('Discard');
                                $commentSaveBtn.text('Post');
                                $commentTextarea.attr('placeholder', 'Make a shared comment...');
                            } else {
                                $commentTypeIcon
                                    .removeClass('icon-comment-alt')
                                    .addClass('icon-comment-private-note');
                                $commentDeleteBtn.text('Delete');
                                $commentSaveBtn.text('Save');
                                $commentTextarea.attr('placeholder', 'Enter a private comment...');
                            }

                            $commentTextareaLbl.text($commentTextarea.attr('placeholder'));
                        });
                    });

                    // automatically resize the height of the textarea as the user types
                    var $resizableTextareas = $popoverSection.find('textarea').not('[readonly]');
                    $resizableTextareas.flexText('<pre><span /><br /><br /></pre>');


                    // disable the comment 'save' button unless there is text in the textarea
                    var disableEmptyCommentSaveButtons = function(val, $comment, $popParent, $saveCommentBtn) {
                        // if the comment is empty - the delete button should not open the confirmation prompt
                        var $deleteCommentBtn = $comment.find('.comment-actions .delete-hover');

                        if(val.length > 0) {
                            $popParent.removeClass('empty-comment');
                            $saveCommentBtn.prop('disabled', false);
                            $deleteCommentBtn.prop('disabled', false);
                            // $deleteCommentBtn.bind('click', function (e) {
                            //     var targetModal = $(this).data('target');
                            //     $(targetModal).modal('show');
                            // });
                        } else {
                            $popParent.addClass('empty-comment');
                            $saveCommentBtn.prop('disabled', true);
                            $deleteCommentBtn.prop('disabled', true);
                            // $deleteCommentBtn.unbind('click');
                        }
                    };

                    var labelReplyCblockContainer = function(val, $comment) {
                        // if the comment-reply textarea is empty - the comment-reply div should have css class comment-reply-empty
                        var $commentReplyContainer = $comment.find('.comment-reply');

                        if(val.length > 0) {
                            $commentReplyContainer.removeClass('comment-reply-empty');
                        } else {
                            $commentReplyContainer.addClass('comment-reply-empty');
                        }
                    };

                    var $commentTextareas = $('.comment-body textarea, .comment-reply textarea', '.popover-comment');
                    $.each($commentTextareas, function () {
                        var $this = $(this);
                        var id = $this.attr('id');
                        var val = $this.val();
                        var $comment = $this.closest('.comment');
                        var $popParent = $this.closest('.popover');
                        var $saveCommentBtn = $popParent.find('[data-enabled-textarea=' + id + ']');

                        // initialize on load
                        disableEmptyCommentSaveButtons(val, $comment, $popParent, $saveCommentBtn);
                        labelReplyCblockContainer(val, $comment);

                        if($saveCommentBtn) {
                            $this.bind('keyup', function() {
                                val = $(this).val();

                                // update again on keyup
                                disableEmptyCommentSaveButtons(val, $comment, $popParent, $saveCommentBtn);
                                labelReplyCblockContainer(val, $comment);
                            });
                        } // END if($saveCommentBtn)
                    });
                // -------------------------


                // Threaded Comments Demo
                // -------------------------

                    // auto-height for saved readonly textareas
                    var $savedTextareas = $popoverSection.find('.comment-readonly textarea');
                    $.each($savedTextareas, function() {
                        $(this).height( 0 )
                               .height( this.scrollHeight );
                    });

                    // show the actions button when the 'reply' textarea is focused
                    var $replyTextareas = $popoverSection.find('.comment-reply textarea, .popover-thread .comment-body textarea').not('[readonly]');

                    var checkReplyVal = function($elem, $collapseElem) {
                        $elem.trigger('change');
                        if($elem.val().length === 0) {
                            $collapseElem.collapse('hide');
                        }
                    };

                    $.each($replyTextareas, function() {
                        var $elem = $(this);
                        var $form = $elem.closest('.comment');
                        var $collapseMe = $form.find('.comment-actions');
                        var $collapsedMeta = $form.find('.comment-meta');

                        // $form.on('reset', function(){
                        //     setTimeout(function(){
                        //         checkReplyVal($elem, $collapseMe);
                        //     }, 5);
                        // });

                        if($elem.closest('.new-comment').length === 0) {
                            $elem.on('focus', function(e) {
                                    $collapseMe.collapse('show');
                                    $collapsedMeta.removeClass('hide');
                                 }).on('blur', function(e) {
                                    if($(this).val().length === 0) {
                                        $collapsedMeta.addClass('hide');
                                    }
                                    checkReplyVal($(this), $collapseMe);
                                 });
                        }

                    });

                // -------------------------
            } // END if($popoverSection)


            //----------------------------------------------
            //+ DATEPICKER DEMOS
            //----------------------------------------------
            if($datepickerSection.length > 0) {
                // $('#dp3').datepicker();
            } // END if($datepickerSection)


            //----------------------------------------------
            //+ ICON GLYPH IFRAMES
            //----------------------------------------------
            if($iconSection.length > 0) {

            } // END if($iconSection)
            //----------------------------------------------

            //----------------------------------------------
            //+ DEMOS THAT ARE IN MORE THAN ONE SECTION
            //----------------------------------------------

                // Initialize tooltips / popovers
                // -------------------------
                    $('.tooltip-test').tooltip();
                    $('.popover-test').popover();

                    $('[role=main], .wdesk-docs-footer').tooltip({
                        selector: '[data-toggle=tooltip]'
                    });

                    $('.tooltip-follow-demo').tooltip({
                        placement: 'follow',
                        title: 'Move your mouse cursor and watch me follow!'
                    });

                    // $('[rel=tooltip]').tooltip();
                    $('[data-toggle=popover]').popover();

                    $('[data-toggle=popover]')
                        .on('show.wdesk.popover', function (e) {
                            $(this).addClass('active');
                            $(this).parent().addClass('active');
                        })
                        .on('hide.wdesk.popover', function (e) {
                            $(this).removeClass('active');
                            $(this).parent().removeClass('active');
                        });
                // -------------------------

                //
                // Tabbed docs examples
                //
                    // if anything other than the first tab is activated,
                    // we need to add a CSS class so that the top left corner of the nested
                    // .wdesk-docs-example elem can be rounded
                    var $exampleTabContent = $('.example-tab-content');
                    $exampleTabContent.each(function() {
                        var $that = $(this);
                        var $toggles = $that.find('[data-toggle=tab]');

                        $toggles.on('show.wdesk.tab', function(event) {
                            var $toggle = $(this);

                            // if its the first tab
                            var firstTarget = $toggles.eq(0).data('target') || $toggles.eq(0).attr('href');
                            var thisTarget  = $toggle.data('target') || $toggle.attr('href');

                            if (thisTarget === firstTarget) {
                                $that.removeClass('first-tab-inactive');
                            } else {
                                $that.addClass('first-tab-inactive');
                            }
                        });
                    });


                // Clear search demo
                // -------------------------
                    var $clearSearch = $('.clear-search');
                    if($clearSearch.length > 0) {
                        $('.clear-search').button('clearSearch');
                    }
                // -------------------------


                // Initialize all docs alerts
                // -------------------------
                    var $alerts = $('.container .alert');
                    $.each($alerts, function(){
                        var isToast = $(this).hasClass('alert-toast');
                        if(!isToast) {
                            $(this).alert('show');
                        } else {
                            // don't show the toast alerts automatically
                            $(this).alert();
                        }

                        // DEBUG THE EVENTS

                        // $(this).on('shown.wdesk.alert', function(e) {
                        //             console.log('alert shown.wdesk.alert');
                        //      }).on('hidden.wdesk.alert', function(e) {
                        //             console.log('alert hidden.wdesk.alert');
                        //      });

                    });
                // -------------------------


                // Toast alert example
                // -------------------------
                    setTimeout(function(){

                        var $toastTriggerBtns = $('.show-toast-alert');
                        var $exampleToastAlertContainer = $('.toasts');
                        // var toastDOM = $exampleToastAlertContainer.html();
                        // var $exampleToastAlerts =  $('.toast-example');
                        if($toastTriggerBtns.length > 0) {
                            var $theToast, $triggerBtn;

                            var initToasts = function() {
                                $theToast
                                    .one('show.wdesk.alert', function (e) {
                                        $triggerBtn.off('click');
                                    })
                                    .one('hide.wdesk.alert', function (e) {
                                        var closedToastDir = e.target.dataset.toastDirection;
                                        $triggerBtn = $toastTriggerBtns.filter('[data-toast-direction="' + closedToastDir + '"]');
                                        $triggerBtn
                                            .on('click', function () { $(this).trigger('show.toast') })
                                            .removeClass('active');
                                    })
                                    .alert('show');
                            };

                            var toastHTML = function(direction) {
                                var alertText = (direction == 'top' || direction == 'bottom') ? 'Your document was updated successfully.' : 'Document updated.';
                                return '<div role="alert" aria-live="polite" class="alert alert-toast alert-alt ' + direction + ' toast-example" data-toast-direction="' + direction + '">\n' +
                                        '<button type="button" class="close" data-dismiss="alert">\n' +
                                          '<i aria-hidden="true">&times;</i><i class="sr-only">Close</i>' +
                                        '</button>\n' +
                                        '<p>' + alertText + '</p>\n' +
                                    '</div>';
                            };

                            $toastTriggerBtns.on('click', function () {
                                $(this).trigger('show.toast');
                            });

                            $toastTriggerBtns.on('show.toast', function (e) {
                                $triggerBtn = $(this);
                                $triggerBtn.addClass('active');

                                var direction = $triggerBtn.data('toastDirection');
                                $theToast = $(toastHTML(direction)).appendTo($exampleToastAlertContainer);

                                setTimeout(initToasts, 50);
                            });
                        }

                    }, 100);
                // -------------------------

                // Make sure css3 animations
                // don't play until they are
                // scrolled into view
                // -------------------------

                    // Returns true if the specified element has been scrolled into the viewport.
                    var isElementInViewport = function(elem) {
                        var $elem = $(elem);

                        // Get the scroll position of the page.
                        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') !== -1) ? 'body' : 'html');
                        var viewportTop = $(scrollElem).scrollTop();
                        var viewportBottom = viewportTop + $(window).height();

                        // Get the position of the element on the page.
                        var elemTop = Math.round( $elem.offset().top );
                        var elemBottom = elemTop + $elem.height();

                        return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
                    };

                    // Check if it's time to start the animation.
                    var checkAnimation = function() {

                        $.each($animatedElems, function(){
                            var $this = $(this);
                            if (isElementInViewport($this)) {
                                if ($this.hasClass('play')) return;
                                // Start the animation
                                $this.addClass('play');
                            } else {
                                $this.removeClass('play');
                            }
                        });

                    };

                    // Capture scroll events (debounced)
                    $window.smartscroll(function(){
                        checkAnimation();
                    });
                    // one time on load
                    checkAnimation();

            //----------------------------------------------

            var $globalHelpTabDemo = $('.global-help-tab');

            if($globalHelpTabDemo) {

                $.each($globalHelpTabDemo, function() {
                    var $this = $(this);
                    $this
                        .on('show', function() {
                            $(this).parent('li').addClass('active');
                        })
                        .on('hide', function() {
                            $(this).parent('li').removeClass('active');
                        });

                    // substitute for ui mutex
                    var $navbar = $this.closest('.navbar');
                    $navbar.click(function(e) {
                        var $target = $(e.target);
                        var $popButton = ($target.hasClass('.global-help-tab') || $target.closest('.global-help-tab').length > 0);
                        var $pop = $('#' + $this.data('target'));
                        if(!$popButton && $pop.length > 0) {
                            $this.popover('hide');
                        }
                    });
                });
            }

            typeof console !== 'undefined' && debugMethodOrder && console.log('initializeDocsJsDemos(end)');

        } // END initializeDocsJsDemos()

    //----------------------------------------------


    //----------------------------------------------
    //+ METHOD CALL CONTROL
    //  (control when this stuff goes boom)
    //
        var debugMethodOrder = false;
    //
    //----------------------------------------------

        // INITIALIZE OPTIONS
        if(gtIE7) {
            initializeDocsJsOptions();
        }

        // INITIALIZE CORE DOCS JS
        initializeDocsJsCore();

        if(gtIE7) {
            // INITIALIZE DEMO DOCS JS
            initializeDocsJsDemos();
        }


        // special href="#name" anchors
        // that should go to that location on
        // the page, but then also toggle a tab
        $(document).on('click', '[data-tabs]', function (e) {
            var $this = $(this);
            var tabSet = $this.data('tabs');
            var tabHref = $this.data('target');

            var $toggleTab = $(tabSet).find('[href=' + tabHref + ']');

            $toggleTab && $toggleTab.tab('show');
        });

    //----------------------------------------------

});}(jQuery);
