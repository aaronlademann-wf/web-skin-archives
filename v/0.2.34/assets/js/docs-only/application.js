// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) { $(function(){

    var $window = $(window);
    var $body   = $(document.body);
    var $html   = $('html');
    var bodyAffixOffset = parseFloat($('body').attr('data-offset'));
    // which elems do we need to start animations on when they come into view?
    var $animatedElems = $('.progress-spinner, .progress-bar');
    var $formSection = $('#forms').closest('section');
    var $tableSection = $('#tables').closest('section');
    var $gridSection = $('#grid').closest('section');
    var $iconSection = $('#icons').closest('section');
    var $spinnerSection = $('#spinners').closest('section');
    var $jsButtonSection = $('#buttons.js-buttons').closest('section');
    var $popoverSection = $('#popovers').closest('section');
    var $helpersSection = $('#helper-classes').closest('section');
    var $colorPaletteSection = $('#color-palette').closest('section');

    //----------------------------------------------
    //+ CORE INITIALIZATIONS
    //  (FIRST BEFORE ANY DEMO JS)
    //----------------------------------------------

        // Make sure top navigation links don't take the user out of 
        // a full screen app experience if thats what they are in
        if (('standalone' in window.navigator) && window.navigator.standalone) {
            // For iOS Apps
            $('a').on('click', function(e){
                e.preventDefault();
                var new_location = $(this).attr('href');
                if (new_location !== undefined && new_location.substr(0, 1) != '#' && $(this).attr('data-method') === undefined){
                    window.location = new_location;
                }
            });
        }

        // Initialize side bar navigation
        // -------------------------
            var scrollSpyElemClass  = '.wdesk-docs-sidebar';
            var $sidenavWrapper     = $(scrollSpyElemClass);
            var $sidenav            = $('.wdesk-docs-sidenav');
            var $navbar             = $('.wdesk-docs-navbar');

            // for testing
            var testingNavRibbon    = false;
            var navRibbonHeight     = testingNavRibbon ? 60 : 0;

            // measurement helpers
            var headingMargin   = 20;
            var sideBarMargin   = parseInt($sidenav.css('margin-top'), 10);
            var navHeight       = $navbar.outerHeight(true) + navRibbonHeight;

            setTimeout(function () {

                var getAffixOffset = function() {
                    var sideBarOffsetTop = $sidenav.offset().top;
                    

                    return sideBarOffsetTop - navHeight - sideBarMargin - 15;
                };

                var getScrollspyOffset = function() {
                    return navHeight + sideBarMargin + headingMargin;
                };

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
                    $sidenav.find('li:first').addClass('active');
                }
                $sidenav.addClass('in');


                // hook up scrolling for section navigation
                // -------------------------
                var scrollSpyOffset = getScrollspyOffset();
                var scrollHereOffset = -1 * (scrollSpyOffset / 2);
                $body.scrollspy({
                    target: scrollSpyElemClass,
                    offset: scrollSpyOffset
                });

                // make sure scrollspy locations are refreshed when window is resized
                $window.smartresize(function () {
                    $body.scrollspy('refresh');
                });

                var stripHash = function () {
                    return location.pathname + location.search;
                };

                var toTitleCase = function(str) {
                    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                };

                var scrollHere = function (href, offset) {
                    offset = offset || 0;
                    var target = href;
                    var $target = $(target);

                    var cleanLoc = stripHash();

                    var hash = target.replace('#', '');
                    var hashTitle = hash.replace(/-/g, ' '); // replace dashes with spaces

                    var gaPage = cleanLoc.replace('/index.html', '/') + hash;
                    var fullLocation = window.location.protocol + '//' + window.location.hostname + gaPage;
                    
                    if($target.length) {
                        var offsetMethod = $body[0] === window ? 'position' : 'offset';
                        $('html, body').scrollTop($target[offsetMethod]().top + offset);

                        try {
                            // track this as a pageview
                            ga('set', 'title', toTitleCase(hashTitle) + ' · ' + document.title);
                            ga('set', 'location', fullLocation);
                            ga('send', 'pageview');
                        } catch(err) {
                            // something went wrong with ga
                        }

                    } else {
                        // there is no elem with this ID on the page.
                        try {
                            console.warn('No elem with id = ' + target);
                        } catch(err) {
                            // browser doesn't support console messages
                        }
                    }
                };

                // from within the section body, unless part of an example
                var $exampleAnchors = $('.wdesk-docs-example [href^=#]');
                $exampleAnchors.click(function (e) {
                    e.preventDefault();
                });

                var $sectionAnchors = $('.wdesk-docs-section [href^=#]').not('[data-toggle]');

                $.each($sectionAnchors, function () {
                    if($(this).attr('href').length > 1) {
                        // its not just #, its linking somewhere
                        $(this).click(function (e) {
                            e.preventDefault(); // prevent browser scroll
                            try {
                                scrollHere(this.getAttribute('href'), scrollHereOffset);
                            } catch(err) {}
                        });
                    }
                });

                var $sectionHeadings = $('.wdesk-docs-section h1[id], .wdesk-docs-section h2[id], .wdesk-docs-section > h3[id], .wdesk-docs-section > h4[id]');

                $.each($sectionHeadings, function () {
                    var headingID = $(this).attr('id');
                    var headingText = $(this).text();
                    var currentHash = document.location.hash;
                    $(this)
                        .tooltip({
                            delay: 800,
                            template: '<div class="tooltip docs-tooltip"><div class="arrow"></div><div class="inner"></div></div>',
                            placement: 'auto bottom',
                            container: 'section',
                            title: 'Click to permalink the <strong>' + headingText + '</strong> section',
                            html: true
                        })
                        .click(function(e) {
                            if(currentHash != headingID) {
                                document.location.hash = headingID;
                                currentHash = headingID;

                                // record GA event to signify that someon is interested in permalinking a section
                                ga('send', 'event', 'Permalink', headingText, 'Heading: ' + headingText);
                            }
                        });
                });

                // from the sidenav
                $('.wdesk-docs-sidenav [href^=#]').click(function (e) {
                    var isActive = $(this).parent('.active').length > 0;
                    var hasActiveChildren = $(this).parent().find('.nav').children('.active').length > 0;
                    // disable sidebar links if they are activated
                    if(isActive && !hasActiveChildren) {
                        e.preventDefault();
                    } else {
                        e.preventDefault(); // prevent browser scroll
                        // its not the active link... scroll there.
                        scrollHere(this.getAttribute('href'), scrollHereOffset);
                    }
                });


                // prevent submission of forms in docs examples
                var $submitButtons = $('.wdesk-docs-example [type=submit]');
                $.each($submitButtons, function () {
                    $(this).click(function (e) {
                        e.preventDefault();
                    });
                });

            }, 400);
            
        // -------------------------

        // initialize chosen.js elems
        // -------------------------
            var $selectElems = $('select.chosen');
            if($selectElems.length > 0) {
                $selectElems.chosen({
                    inherit_select_classes: true
                });
            }
        // -------------------------

        // initialize tooltips / popovers
        // -------------------------
            $('.tooltip-test').tooltip();
            $('.popover-test').popover();

            $('.tooltip-demo').tooltip({
                selector: '[data-toggle=tooltip]'
            });

            // $('[data-toggle='tooltip']').tooltip();
            $('[data-toggle=popover]').popover();

            $('[data-toggle=popover]')
                .on('show.wdesk.popover', function(e) {
                    $(this).addClass('active');
                    $(this).parent().addClass('active');
                })
                .on('hide.wdesk.popover', function(e) {
                    $(this).removeClass('active');
                    $(this).parent().removeClass('active');
                });

        // -------------------------

        // Initialize placeholder support for IE9 and below
        // -------------------------
            $('input, textarea').placeholder();
        // -------------------------

        // Add some extras to the code examples
        // -------------------------
        setTimeout(function () {
            $('<style type="text/css" id="codeLangStyles" />').appendTo('head');

            var $codeExamples = $('.highlight');
            var langs = [];

            $.each($codeExamples, function() {
                var $codeBlock = $('code', this);
                var codeClass = $codeBlock.attr('class');

                $(this).addClass(codeClass);

                if($.inArray(codeClass, langs) > -1){
                    // already have the style in place
                } else {
                    // add it
                    langs.push(codeClass);
                    // add the codetype as a class of the wrapper
                    // so we can put a label on it
                    $('#codeLangStyles').append('.highlight.' + codeClass + ':after{ content:"' + codeClass + '"; }');
                }

                // add a linenos class so we can indent appropriately
                // var hasLineNumbers = $codeBlock.find('.lineno').length > 0;
                // if(hasLineNumbers) {
                //     $(this).addClass('numbered');
                // }
            });
        }, 1000);

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

    } // END if($formSection)
    //----------------------------------------------    


    //----------------------------------------------
    //+ TABLE DEMOS
    //----------------------------------------------
    if($tableSection.length > 0) {

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

                var $sortTblHeaders = $('.table-sortable > thead > tr > th');
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

            var selectRow = function($row, cboxClicked) {
                var $checkbox = $row.find(':checkbox');

                if(! cboxClicked) {
                    $checkbox.trigger('click');
                } else {
                    $row.hasClass(selectedClass) ? $row.removeClass(selectedClass) : $row.addClass(selectedClass);    
                }
            };

            if($selectableDemoTable.length > 0) {

                var $selectableRows = $selectableDemoTable.find('tbody > tr');
                var $selectableRowCboxes = $selectableRows.find(':checkbox');

                $selectableRows.on('click', function(e) {

                    var $checkbox = $(this).find(':checkbox');
                    var wasCboxClicked = $(e.target).is($checkbox);

                    selectRow($(this), wasCboxClicked);

                });
            }


    } // END if($tableSection)

    if($colorPaletteSection.length > 0) {
        // var $swatchCells = $colorPaletteSection.find('.table-responsive .scss-output');
        // var pseudoStyle, swatchHex;

        // // copy the pseudo content to the cell itself so the user can copy it
        // $swatchCells.click(function(e) {
        //     try {
        //         pseudoStyle = getComputedStyle($(this)[0], ':before');
        //         if(typeof pseudoStyle == 'object') {
        //             swatchHex = pseudoStyle.content.replace(/["']/g, "");
        //             $(this).html(swatchHex);
        //         }
        //     } catch(err) {
        //         // browser doesn't support getComputedStyle()
        //     }
        // });
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
        $('#wdesk-btn').click(function () {
            var $btn = $(this);
            $btn.button('loading');
            setTimeout(function () {
                $btn.button('reset');
            }, 3000);
        });
    } // END if($buttonSection)


    //----------------------------------------------
    //+ HELPER CLASSES DEMOS
    //----------------------------------------------

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
                        $popParent.addClass('modal-open');
                    })
                    .on('backdrop_hide.wdesk.modal', function(e) {
                        $popParent.removeClass('modal-open');
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

            var $commentTextareas = $('.comment-body textarea, .comment-reply textarea');
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

    //----------------------------------------------
    //+ ICON GLYPH IFRAMES
    //----------------------------------------------

    if($iconSection.length > 0) {

        // IE8 really struggles with this... no need for it to be in the docs for that reason
        // no one is actually going to look at the docs in IE8 anyway - so to ease developer pain... we'll remove
        var isLtIE9 = $('html').hasClass('ua-lt-ie9');

        if(isLtIE9) {
          $iconSection.addClass('hide');
        }

        setTimeout(function() {
            // auto-height for the iconography iframes
            var $iframes = $('iframe');
            var heightPerGlyph = 0;
            $.each($iframes, function (index, element) {
                var frameBodyElem = element.contentWindow.document.body;

                var glyphCount = parseFloat($(frameBodyElem).attr('data-glyphcount'));
                if(index === 0) {
                    // first elem
                    heightPerGlyph = parseFloat($(frameBodyElem).attr('data-avg-glyph-height'));
                }

                if($('html').hasClass('ua-safari') || $('html').hasClass('ua-opera')) {
                    // Safari and Opera need a kick-start.
                    var iSource = $(element).attr('src');
                    $(element).attr('src', '');
                    $(element).attr('src', iSource);
                }

                $(element).closest('.tab-content').find('.icon-loading-container').addClass('hide');
                $(element)
                    .css('height', parseInt(glyphCount * heightPerGlyph, 10) + 'px')
                    .removeClass('hide');
            });
        }, 5000);
    } // END if($iconSection)
    //----------------------------------------------

    //----------------------------------------------
    //+ DEMOS THAT ARE IN MORE THAN ONE SECTION
    //----------------------------------------------
        
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
                    $toastTriggerBtns.click(function(){

                        if($(this).hasClass('top')) {
                            $('<div class="alert alert-toast top toast-example">\n' + 
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>\n' + 
                                '<p>Your document was updated successfully.</p>\n' +
                            '</div>').appendTo($exampleToastAlertContainer).alert('show');
                        }
                        if($(this).hasClass('bottom')) {
                            $('<div class="alert alert-toast bottom toast-example">\n' + 
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>\n' + 
                                '<p>Your document was updated successfully.</p>\n' +
                            '</div>').appendTo($exampleToastAlertContainer).alert('show');
                        }
                        if($(this).hasClass('left')) {
                            $('<div class="alert alert-toast left toast-example">\n' + 
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>\n' + 
                                '<p>Your document was updated successfully.</p>\n' +
                            '</div>').appendTo($exampleToastAlertContainer).alert('show');
                        }
                        if($(this).hasClass('right')) {
                            $('<div class="alert alert-toast right toast-example">\n' + 
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>\n' + 
                                '<p>Your document was updated successfully.</p>\n' +
                            '</div>').appendTo($exampleToastAlertContainer).alert('show');
                        }
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


});}(window.jQuery);
