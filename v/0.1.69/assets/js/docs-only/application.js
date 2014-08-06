// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

$(document).ready(function(){

    var $window = $(window);
    var bodyAffixOffset = parseFloat($('body').attr('data-offset'));
    // which elems do we need to start animations on when they come into view?
    var $animatedElems = $('.progress-spinner, .progress-bar');
    var $formSection = $('#forms');
    var $tableSection = $('#tables');
    var $gridSection = $('#grid-system');
    var $spinnerSection = $('#spinners');
    var $jsButtonSection = $('#buttons.js-buttons');
    var $popoverSection = $('#popovers');

    //----------------------------------------------
    //+ CORE INITIALIZATIONS
    //  (FIRST BEFORE ANY DEMO JS)
    //----------------------------------------------

        // Initialize side bar navigation
        // -------------------------

            // Disable certain links in docs
            $('section [href^=#]').click(function (e) {
                e.preventDefault();
            });

            var $sidenavWrapper = $('.wdesk-docs-sidebar');
            var $sidenav = $('.wdesk-docs-sidenav');
            var $navbarScrollFade = $('.navbar-scroll-fade');
            
            setTimeout(function () {
                $sidenav.affix({
                    offset: {
                        top: function () { return $window.width() <= 980 ? 269 : 237 }
                      , bottom: 270
                    }
                }).addClass('fade in');
              // if nothing is active, activate the first one
              var activeSection = $sidenav.find("li").hasClass("active");
              if(! activeSection) {
                $sidenav.find("li:first").addClass("active");
              }

            }, 100);
            var responsiveSidebarNav = function(){
                // if the window is small enough that the "side" bar is actually pinned above the content
                // lets make it practical to use by making it a sub-top-nav
                var menuIsMobile = $sidenavWrapper.hasClass('pill-container');
                
                if (Modernizr.mq('only screen and (max-width: 767px)')) {
                    
                    if(! menuIsMobile) {

                        $('body').attr('data-offset', bodyAffixOffset + 37);

                        $sidenavWrapper
                            .hide()
                            .addClass('pill-container');
                        $navbarScrollFade.hide();

                        $sidenav
                            .addClass('nav-pills nav-justified')
                            .removeClass('nav-list')
                            .hide().show(0); // force redraw to fix table display bug on resize

                        $sidenav.closest(".container").hide().show(0);

                        $sidenavWrapper.show(0);
                        $navbarScrollFade.show(0);
                    }

                } else {
                    
                    if(menuIsMobile) {
                        
                        $('body').attr('data-offset', bodyAffixOffset);

                        $sidenavWrapper
                            .hide()
                            .removeClass('pill-container');
                        $navbarScrollFade.hide();

                        $sidenav
                            .removeClass('nav-pills nav-justified')
                            .addClass('nav-list');

                        $sidenav.closest(".container").hide().show(0);

                        $sidenavWrapper.show(0);
                        $navbarScrollFade.show(0);
                    }

                } // END if screen size is less than 768px wide
            }
            $window.smartresize(function(){
                responsiveSidebarNav();
            });
            // one time on load
            responsiveSidebarNav();
        // -------------------------

        // initialize chosen.js elems
        // -------------------------
            $selectElems = $('select.chosen');
            if($selectElems.length > 0) {
                $selectElems.chosen({
                    inherit_select_classes: true
                });
            }
        // -------------------------

        // initialize tooltips / popovers
        // -------------------------
            $('[data-toggle="tooltip"], .tooltip-test').tooltip();
            $('[data-toggle="popover"], .popover-test').popover()
                                                      .click(function(e) { e.preventDefault(); });

            // don't re-enable body scroll when showing tooltip / popover from within modal
            $('.tooltip-test, .popover-test').hover(function(){
                $("body").addClass("modal-open");
            }, function(){
                $("body").removeClass("modal-open");
            });
        // -------------------------

        // Initialize placeholder support for IE9 and below
        // -------------------------
            $('input, textarea').placeholder();
        // -------------------------

    //----------------------------------------------


    //----------------------------------------------
    //+ FORMS / INPUT DEMOS
    //----------------------------------------------
    if($formSection.length > 0) {
        
        // remove invalid styling from invalid demo field
        $('input.invalid-demo').keyup(function (e) {
            if($(this).val() != '') {
                $(this).addClass('valid');
            } else {
                $(this).removeClass('valid');
            }
        });

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
    //----------------------------------------------


    //----------------------------------------------
    //+ PROGRESS DEMOS
    //----------------------------------------------
    if($spinnerSection.length > 0) {

        // DOWNLOADING PROGRESS SPINNER DEMO
        // -------------------------
            $('#download-demo').click(function(){
                var $btn = $(this)
                var $icon = $("> .icon", this);
                $btn.button('downloading')
                $icon.removeClass("icon-download-available icon-downloaded")
                    .addClass("icon-downloading")
                setTimeout(function(){
                    $btn.button('complete')
                    $icon.removeClass("icon-downloading")
                         .addClass("icon-downloaded")
                }, 5000)
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
              selector: '.show-grid > [class*="span"]'
            , title: function () { return $(this).width() + 'px' }
          })
        }
    } // END if($gridSection)
    //----------------------------------------------


    //----------------------------------------------
    //+ JS BUTTON DEMOS
    //----------------------------------------------
    if($jsButtonSection.length > 0) {
        // button state demo
        // -------------------------
            $('#fat-btn').click(function () {
                var $btn = $(this);
                $btn.button('loading');
                setTimeout(function () {
                    $btn.button('reset');
                }, 3000);
            });
    } // END if($buttonSection)



    //----------------------------------------------
    //+ POPOVER NOTES / COMMENTS DEMOS
    //----------------------------------------------
    if($popoverSection.length > 0) {

        // Single note popover demo
        // -------------------------
            // add the overlaid class 
            // to the popover so we can darken the arrow
            var $notePopoverConfirmationModal = $popoverSection.find('.modal.contained');
            var $notePopoverConfirmationModalBackdrop, $parentPopover;
            $notePopoverConfirmationModal.on('show', function(e) {
                                            $parentPopover = $(this).closest('.popover');
                                            $parentPopover.addClass('overlaid');
                                        }).on('hide', function(e) {
                                            $parentPopover = $(this).closest('.popover');
                                            $parentPopover.removeClass('overlaid');
                                        });

            // trigger the showing of the delete confirmation modal example
            var $simulatedDeleteConfirmationPopover = $($('#deleteButton2auto').data('target'));
            setTimeout(function() {
                $('body').removeClass('modal-open');
                if($('html').hasClass('ua-ie')) {
                    $('body').removeClass('modal-open');
                } else {
                    $simulatedDeleteConfirmationPopover.modal('show');
                    $simulatedDeleteConfirmationPopover.on('shown', function (e) {
                        setTimeout(function(){
                            // after we simulate the click - we want to allow scrolling
                            $('body').removeClass('modal-open');
                        }, 100);
                    });
                }
            }, 1000);

            // automatically resize the height of the textarea as the user types
            var $resizableTextareas = $popoverSection.find('textarea').not('[readonly]');
            $resizableTextareas.flexText();


            // disable the comment "save" button unless there is text in the textarea
            var disableEmptyCommentSaveButtons = function(val, $popParent, $saveCommentBtn) {
                // if the comment is empty - the delete button should not open the confirmation prompt
                var $deleteCommentBtn = $popParent.find('.comment-actions .delete-hover');

                if(val.length > 0) {
                    $popParent.removeClass('empty-comment');
                    $saveCommentBtn.prop('disabled', false);
                    $deleteCommentBtn.bind('click', function (e) {
                        var targetModal = $(this).data('target');
                        $(targetModal).modal('show');
                    });
                } else {
                    $popParent.addClass('empty-comment');
                    $saveCommentBtn.prop('disabled', true);
                    $deleteCommentBtn.unbind('click');
                }
            };

            var $commentTextareas = $('.comment-body textarea');
            $.each($commentTextareas, function () {
                var $this = $(this);
                var id = $this.attr('id');
                var val = $this.val();
                var $popParent = $this.closest('.popover');
                var $saveCommentBtn = $popParent.find('[data-enabled-textarea=' + id + ']');

                // initialize on load
                disableEmptyCommentSaveButtons(val, $popParent, $saveCommentBtn);

                if($saveCommentBtn) {
                    $this.bind('keyup', function() {
                        val = $(this).val();

                        // update again on keyup
                        disableEmptyCommentSaveButtons(val, $popParent, $saveCommentBtn)
                    });
                } // END if($saveCommentBtn)
            });

        // -------------------------


        // Threaded Comments Demo
        // -------------------------

            // auto-height for saved readonly textareas
            var $savedTextareas = $popoverSection.find('.readonly textarea');
            $.each($savedTextareas, function() {
                $(this).height( 0 )
                       .height( this.scrollHeight );
            });

            // show the actions button when the "reply" textarea is focused
            var $replyTextareas = $popoverSection.find('.comment-reply textarea, .popover-thread .comment-body textarea').not('[readonly]');

            var checkReplyVal = function($elem, $collapseElem) {
                $elem.trigger('change');
                if($elem.val().length == 0) {
                    $collapseElem.collapse('hide');
                }
            };

            $.each($replyTextareas, function() {
                var $elem = $(this);
                var $form = $elem.closest('form');
                var $collapseMe = $form.find('.comment-actions');

                $form.on('reset', function(){
                    setTimeout(function(){
                        checkReplyVal($elem, $collapseMe);
                    }, 5);
                });

                $elem.on('focus', function(e) {
                        $collapseMe.collapse('show');
                     }).on('blur', function(e) {
                        checkReplyVal($(this), $collapseMe);
                     });

            });

        // -------------------------


    } // END if($popoverSection)
    //----------------------------------------------


    //----------------------------------------------
    //+ DEMOS THAT ARE IN MORE THAN ONE SECTION
    //----------------------------------------------
        
        // Clear search demo
        // -------------------------
            $clearSearch = $('.clear-search');
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

                // $(this).on('shown', function(e) {
                //             console.log("alert shown");
                //      }).on('hidden', function(e) {
                //             console.log("alert hidden");
                //      });

            });
        // -------------------------


        // Toast alert example
        // -------------------------
            setTimeout(function(){

                var $toastTriggerBtns = $('.show-toast-alert', '#alerts');
                var $exampleToastAlerts =  $('.toast-example', '#alerts');
                if($toastTriggerBtns.length > 0) {
                    $toastTriggerBtns.click(function(){

                        $(this).attr('disabled', 'disabled');

                        if($(this).hasClass('top')) {
                            $exampleToastAlerts.filter('.top').alert('show');
                        }
                        if($(this).hasClass('bottom')) {
                            $exampleToastAlerts.filter('.bottom').alert('show');
                        }
                        if($(this).hasClass('left')) {
                            $exampleToastAlerts.filter('.left').alert('show');
                        }
                        if($(this).hasClass('right')) {
                            $exampleToastAlerts.filter('.right').alert('show');
                        }
                    });

                    $exampleToastAlerts.find('.close').click(function(){
                        $toastTriggerBtns.removeAttr('disabled');
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
                var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
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


}); // END DOM ready()

