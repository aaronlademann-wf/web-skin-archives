$(window).load(function(){

    // Clear search demo
    // -------------------------
        var $clearSearch = $('.clear-search');
        if($clearSearch.length > 0) {
            $('.clear-search').button('clearSearch');
        }
    // -------------------------

    // ICOMOON DOCUMENTATION DOM HELPERS
    // ---------------------------------------------------------------------------

    jQuery.expr[':'].Contains = function(a,i,m){ return (a.textContent || a.innerText || '').toUpperCase().indexOf(m[3].toUpperCase())>=0; };

    var filterIcons = function($elem, targetID) {

        var filter = $elem.val(); 

        if(filter) { 
            $(targetID).find('.glyph:not(:Contains(' + filter + '))').hide(); 
            $(targetID).find('.glyph:Contains(' + filter + ')').show(); 
        } else { 
            $(targetID).find('.glyph').show();
        }

        var visibleGlyphs = $(targetID).find('.glyph:visible');
        var $glyphCountElem = $(targetID).find('.glyphcount');
        $('.badge', $glyphCountElem).html(visibleGlyphs.length);

        if( filter ) {
            $glyphCountElem.removeClass('hide');
        } else {
            $glyphCountElem.addClass('hide');
        }
        return false;

    }; // END filterIcons

    var $searchInputs = $('.input-search');
    $.each($searchInputs, function(){
        var targetID = $(this).data('search-target');
        var visibleGlyphs = $(targetID).find('.glyph:visible');
        $(targetID).find('.glyphcount .badge').html(visibleGlyphs.length);

        $(this).on('change', function() {

            var targetID = $(this).data('search-target');
            filterIcons($(this), targetID);

        }).on('keyup', function(){ 
            $(this).change(); 
        });

    });

    //----------------------------------------------
    //+ MAIN SET
    //    PASTE FROM lt-ie7.js HERE
    //    simply change var icon = {} 
    //    to var mainClassname, mainPua = {}
    //    each time you download fonts from IcoMoon
    //----------------------------------------------
      
        var mainClassname, mainPua = {
            'icon-envelope' : '&#xe602;',
            'icon-envelope-alt' : '&#xe603;',
            'icon-file-copy' : '&#xe604;',
            'icon-book-binder-alt-copy' : '&#xe605;',
            'icon-blocked' : '&#xe000;',
            'icon-warning-sign' : '&#xe001;',
            'icon-info-sign' : '&#xe002;',
            'icon-notification' : '&#xe003;',
            'icon-help' : '&#xe004;',
            'icon-pencil-reverse' : '&#xe005;',
            'icon-minus-sign' : '&#xe006;',
            'icon-checkmark-sign' : '&#xe007;',
            'icon-plus-sign' : '&#xe008;',
            'icon-close-sign' : '&#xe009;',
            'icon-close' : '&#xe00a;',
            'icon-plus' : '&#xe00b;',
            'icon-minus' : '&#xe00c;',
            'icon-checkmark' : '&#xe00d;',
            'icon-upload' : '&#xe00e;',
            'icon-upload-alt2' : '&#xe00f;',
            'icon-download' : '&#xe010;',
            'icon-download-alt2' : '&#xe011;',
            'icon-arrow-up' : '&#xe012;',
            'icon-arrow-right' : '&#xe013;',
            'icon-arrow-down' : '&#xe014;',
            'icon-arrow-left' : '&#xe015;',
            'icon-arrow-up-circle' : '&#xe016;',
            'icon-arrow-down-circle' : '&#xe017;',
            'icon-zoom-in' : '&#xe018;',
            'icon-zoom-out' : '&#xe019;',
            'icon-search' : '&#xe01a;',
            'icon-play' : '&#xe01b;',
            'icon-pause' : '&#xe01c;',
            'icon-stop' : '&#xe01d;',
            'icon-backward' : '&#xe01e;',
            'icon-forward' : '&#xe01f;',
            'icon-first' : '&#xe020;',
            'icon-last' : '&#xe021;',
            'icon-previous' : '&#xe022;',
            'icon-next' : '&#xe025;',
            'icon-eject' : '&#xe03c;',
            'icon-italic' : '&#xe052;',
            'icon-bold' : '&#xe054;',
            'icon-font' : '&#xe055;',
            'icon-star' : '&#xe056;',
            'icon-star2' : '&#xe057;',
            'icon-star3' : '&#xe058;',
            'icon-heart' : '&#xe059;',
            'icon-contrast' : '&#xe05a;',
            'icon-heart2' : '&#xe05b;',
            'icon-thumbs-up' : '&#xe061;',
            'icon-thumbs-up2' : '&#xe070;',
            'icon-camera' : '&#xe072;',
            'icon-home' : '&#xe07e;',
            'icon-refresh' : '&#xe080;',
            'icon-eye' : '&#xe081;',
            'icon-eye-blocked' : '&#xe089;',
            'icon-road' : '&#xe08a;',
            'icon-enter' : '&#xe097;',
            'icon-exit' : '&#xe098;',
            'icon-airplane' : '&#xe09a;',
            'icon-connection' : '&#xe09b;',
            'icon-pushpin' : '&#xe09c;',
            'icon-switch' : '&#xe09d;',
            'icon-music' : '&#xe09e;',
            'icon-cogs' : '&#xe09f;',
            'icon-checkbox-checked' : '&#xe0a0;',
            'icon-checkbox-unchecked' : '&#xe0a1;',
            'icon-checkbox-partial' : '&#xe0a2;',
            'icon-radio-checked' : '&#xe0a3;',
            'icon-radio-unchecked' : '&#xe0a4;',
            'icon-filter' : '&#xe0a5;',
            'icon-drawer' : '&#xe0a6;',
            'icon-drawer2' : '&#xe0a7;',
            'icon-play2' : '&#xe0a8;',
            'icon-headphones' : '&#xe0a9;',
            'icon-volume-high' : '&#xe0aa;',
            'icon-volume-low' : '&#xe0ab;',
            'icon-volume-mute' : '&#xe0ac;',
            'icon-qrcode' : '&#xe0ad;',
            'icon-tag' : '&#xe0ae;',
            'icon-tags' : '&#xe0af;',
            'icon-barcode' : '&#xe0b0;',
            'icon-cart' : '&#xe0b1;',
            'icon-target' : '&#xe0b2;',
            'icon-contract' : '&#xe0b3;',
            'icon-expand' : '&#xe0b4;',
            'icon-redo-alt' : '&#xe0b5;',
            'icon-print' : '&#xe0ba;',
            'icon-camera2' : '&#xe0bb;',
            'icon-location' : '&#xe0bc;',
            'icon-droplet' : '&#xe0bd;',
            'icon-gift' : '&#xe0be;',
            'icon-leaf' : '&#xe0bf;',
            'icon-fire' : '&#xe0c0;',
            'icon-calendar' : '&#xe0c2;',
            'icon-shuffle' : '&#xe0c5;',
            'icon-magnet' : '&#xe0c6;',
            'icon-cloud-download' : '&#xe0c7;',
            'icon-cloud-upload' : '&#xe0c8;',
            'icon-cloud' : '&#xe0c9;',
            'icon-safari' : '&#xe0ca;',
            'icon-opera' : '&#xe0cb;',
            'icon-IE' : '&#xe0cc;',
            'icon-firefox' : '&#xe0cd;',
            'icon-chrome' : '&#xe0ce;',
            'icon-css3' : '&#xe0cf;',
            'icon-html5' : '&#xe0d0;',
            'icon-attachment' : '&#xe0d1;',
            'icon-flag' : '&#xe0d2;',
            'icon-book-binder-alt' : '&#xe0d3;',
            'icon-book-binder' : '&#xe024;',
            'icon-file' : '&#xe026;',
            'icon-file-dragndrop' : '&#xe027;',
            'icon-file-dragndrop-new' : '&#xe028;',
            'icon-file-msexcel' : '&#xe029;',
            'icon-file-mspowerpoint' : '&#xe02a;',
            'icon-file-msword' : '&#xe02b;',
            'icon-file-pdf' : '&#xe02c;',
            'icon-pending' : '&#x25f4;',
            'icon-update-available' : '&#x27f3;',
            'icon-downloaded' : '&#x2193;',
            'icon-download-available' : '&#x2313;',
            'icon-zoom-page-height' : '&#xe02d;',
            'icon-zoom-page-width' : '&#xe02e;',
            'icon-cog' : '&#xe071;',
            'icon-library-bookshelf' : '&#xe02f;',
            'icon-gripper' : '&#xe030;',
            'icon-arrow-sm-left' : '&#xe031;',
            'icon-arrow-sm-down' : '&#xe032;',
            'icon-arrow-sm-right' : '&#xe033;',
            'icon-arrow-sm-up' : '&#xe034;',
            'icon-phone' : '&#xe079;',
            'icon-users' : '&#xe035;',
            'icon-user' : '&#xe036;',
            'icon-notification-megaphone' : '&#xe037;',
            'icon-notification-cheerleader' : '&#xe038;',
            'icon-calculator-sm' : '&#xe08c;',
            'icon-calculator-buttons' : '&#xe08d;',
            'icon-construction-cone' : '&#xe08e;',
            'icon-construction-barrier' : '&#xe08f;',
            'icon-film' : '&#xe091;',
            'icon-heartbeat' : '&#xe092;',
            'icon-key2' : '&#xe093;',
            'icon-lightbulb-off' : '&#xe094;',
            'icon-lightbulb-on' : '&#xe095;',
            'icon-map-folded' : '&#xe096;',
            'icon-prize-ribbon' : '&#xe039;',
            'icon-mirror-horizontal' : '&#xe03a;',
            'icon-mirror-vertical' : '&#xe03b;',
            'icon-mouse-wheel' : '&#xe03d;',
            'icon-new-indicator' : '&#xe03e;',
            'icon-quote-open' : '&#xe03f;',
            'icon-quote-close' : '&#xe040;',
            'icon-loading-hourglass' : '&#xe041;',
            'icon-chevron-left' : '&#xe0b6;',
            'icon-chevron-right' : '&#xe0b7;',
            'icon-chevron-up' : '&#xe0b8;',
            'icon-chevron-down' : '&#xe0b9;',
            'icon-chevron-down-sm' : '&#xe042;',
            'icon-chevron-left-sm' : '&#xe043;',
            'icon-chevron-right-sm' : '&#xe044;',
            'icon-chevron-up-sm' : '&#xe045;',
            'icon-arrow-sm-expand-y' : '&#xe046;',
            'icon-delete-backspace' : '&#xe047;',
            'icon-bookmark' : '&#xe048;',
            'icon-pencil-draw' : '&#xe0d7;',
            'icon-directory' : '&#xe0da;',
            'icon-menu-list' : '&#xe0dd;',
            'icon-hr-sketch' : '&#xe0e6;',
            'icon-arrow-sketch' : '&#xe0e7;',
            'icon-arrow-sketch-short' : '&#xe0e8;',
            'icon-comment-on' : '&#xe049;',
            'icon-comment' : '&#xe04a;',
            'icon-comment-lines' : '&#xe04b;',
            'icon-comment-filter' : '&#xe04c;',
            'icon-comment-alt' : '&#xe04d;',
            'icon-comment-add' : '&#xe04e;',
            'icon-spellcheck' : '&#xe04f;',
            'icon-find' : '&#xe050;',
            'icon-link-source' : '&#xe051;',
            'icon-link-remove' : '&#xe053;',
            'icon-link-format' : '&#xe05c;',
            'icon-link-create' : '&#xe05d;',
            'icon-file-link' : '&#xe05e;',
            'icon-link-broken' : '&#xe05f;',
            'icon-link' : '&#xe060;',
            'icon-unlock' : '&#xe062;',
            'icon-lock' : '&#xe08b;',
            'icon-view-print-area' : '&#xe090;',
            'icon-undo' : '&#xe063;',
            'icon-redo' : '&#xe064;',
            'icon-file-trash' : '&#xe065;',
            'icon-trash' : '&#xe066;',
            'icon-view-trash' : '&#xe067;',
            'icon-file-control' : '&#xe068;',
            'icon-file-properties' : '&#xe069;',
            'icon-file-preview' : '&#xe06a;',
            'icon-file-paginate' : '&#xe06b;',
            'icon-file-validate' : '&#xe06c;',
            'icon-file-new' : '&#xe06d;',
            'icon-file-export' : '&#xe06e;',
            'icon-file-import' : '&#xe06f;',
            'icon-file-save-as' : '&#xe073;',
            'icon-file-save' : '&#xe074;',
            'icon-folder-open' : '&#xe075;',
            'icon-formula' : '&#xe076;',
            'icon-symbol' : '&#xe077;',
            'icon-page-break' : '&#xe078;',
            'icon-table-insert-column' : '&#xe0d4;',
            'icon-table-insert-row' : '&#xe07a;',
            'icon-table' : '&#xe07b;',
            'icon-image' : '&#xe07c;',
            'icon-chart-bar' : '&#xe07d;',
            'icon-pencil' : '&#xe07f;',
            'icon-comment-private-note' : '&#xe023;',
            'icon-highlighter' : '&#xe082;',
            'icon-support' : '&#xe083;',
            'icon-full-screen' : '&#xe084;',
            'icon-folder' : '&#xe085;',
            'icon-file-project' : '&#xe086;',
            'icon-comment-reopen' : '&#xe087;',
            'icon-comment-outlined' : '&#xe088;',
            'icon-comment-checkmark' : '&#xe0c1;',
            'icon-book-binder-properties-alt' : '&#xe0c3;',
            'icon-book-binder-properties' : '&#xe0c4;'
        };

    //----------------------------------------------
    //+ TWO COLOR SET
    //    PASTE FROM lt-ie7.js HERE
    //    simply change var icon = {} 
    //    to var twoColorClassname, twoColorPua = {}
    //    each time you download fonts from IcoMoon
    //    FOR THIS SET, ALSO REMOVE -after from the classname
    //----------------------------------------------
      
        var twoColorClassname, twoColorPua = {
            'icon-file-copy' : '&#xe600;',
            'icon-book-binder-alt-copy' : '&#xe601;',
            'icon-file-msexcel' : '&#xe000;',
            'icon-file-mspowerpoint' : '&#xe001;',
            'icon-file-msword' : '&#xe002;',
            'icon-file-pdf' : '&#xe003;',
            'icon-comment-filter' : '&#xe004;',
            'icon-comment-alt' : '&#xe005;',
            'icon-comment-add' : '&#xe006;',
            'icon-spellcheck' : '&#xe007;',
            'icon-link-source' : '&#xe008;',
            'icon-link-remove' : '&#xe009;',
            'icon-link-format' : '&#xe00a;',
            'icon-link-create' : '&#xe00b;',
            'icon-file-link' : '&#xe00c;',
            'icon-view-print-area' : '&#xe00d;',
            'icon-file-trash' : '&#xe00e;',
            'icon-view-trash' : '&#xe00f;',
            'icon-file-control' : '&#xe010;',
            'icon-file-properties' : '&#xe011;',
            'icon-file-validate' : '&#xe012;',
            'icon-file-new' : '&#xe013;',
            'icon-file-export' : '&#xe014;',
            'icon-file-import' : '&#xe015;',
            'icon-page-break' : '&#xe016;',
            'icon-table-insert-column' : '&#xe017;',
            'icon-table-insert-row' : '&#xe018;',
            'icon-update-available' : '&#x27f2;',
            'icon-downloaded' : '&#xe019;',
            'icon-highlighter' : '&#xe01a;',
            'icon-comment-private-note' : '&#xe01b;',
            'icon-file-preview' : '&#xe01c;',
            'icon-book-binder' : '&#xe01d;',
            'icon-book-binder-alt' : '&#xe01e;',
            'icon-book-binder-properties' : '&#xe01f;',
            'icon-book-binder-properties-alt' : '&#xe020;'

            // DONT PASTE OVER THIS PART
            // should remain equivalent to icon-comment-lines
            , 'icon-comment' : '&#xe04b;'
        };

    //----------------------------------------------
    //+ WFML DOCICONS SET
    //    PASTE FROM lt-ie7.js HERE
    //    simply change var icon = {} 
    //    to var wfmlClassname, wfmlPua = {}
    //    each time you download fonts from IcoMoon
    //----------------------------------------------
      
        var wfmlClassname, wfmlPua = {
            'icon-sec-PRESENTATION' : '&#xe08f;',
            'icon-sec-XBRLINFO' : '&#xe001;',
            'icon-sec-WORKBOOK' : '&#xe090;',
            'icon-sec-SUBCERTIFICATION' : '&#xe003;',
            'icon-sec-SC14DRF' : '&#xe004;',
            'icon-sec-SC14D9C' : '&#xe005;',
            'icon-sec-SC14D1F' : '&#xe006;',
            'icon-sec-SC13E4F' : '&#xe007;',
            'icon-sec-SC_TOT' : '&#xe008;',
            'icon-sec-SC_TOI' : '&#xe009;',
            'icon-sec-SC_TOC' : '&#xe00a;',
            'icon-sec-SC_14F1' : '&#xe00b;',
            'icon-sec-SC_14D9' : '&#xe00c;',
            'icon-sec-SC_13G' : '&#xe00d;',
            'icon-sec-SC_13E3' : '&#xe00e;',
            'icon-sec-SC_13E1' : '&#xe00f;',
            'icon-sec-SC_13D' : '&#xe010;',
            'icon-sec-S11MEF' : '&#xe011;',
            'icon-sec-S11' : '&#xe012;',
            'icon-sec-S8' : '&#xe013;',
            'icon-sec-S6' : '&#xe014;',
            'icon-sec-S4MEF' : '&#xe015;',
            'icon-sec-S4EF' : '&#xe016;',
            'icon-sec-S4' : '&#xe017;',
            'icon-sec-S4_POS' : '&#xe018;',
            'icon-sec-S3MEF' : '&#xe019;',
            'icon-sec-S3DPOS' : '&#xe01a;',
            'icon-sec-S3D' : '&#xe01b;',
            'icon-sec-S3ASR' : '&#xe01c;',
            'icon-sec-S3' : '&#xe01d;',
            'icon-sec-S3_13G' : '&#xe01e;',
            'icon-sec-S1MEF' : '&#xe01f;',
            'icon-sec-S1' : '&#xe020;',
            'icon-sec-RW' : '&#xe021;',
            'icon-sec-RW_WD' : '&#xe022;',
            'icon-sec-PX14A6N' : '&#xe023;',
            'icon-sec-PX14A6G' : '&#xe024;',
            'icon-sec-PRRN14A' : '&#xe025;',
            'icon-sec-PRER14C' : '&#xe026;',
            'icon-sec-PREN14A' : '&#xe027;',
            'icon-sec-PREC14C' : '&#xe028;',
            'icon-sec-PREC14A' : '&#xe029;',
            'icon-sec-PRE_14C' : '&#xe02a;',
            'icon-sec-PRE_14A' : '&#xe02b;',
            'icon-sec-POSASR' : '&#xe02c;',
            'icon-sec-POS8C' : '&#xe02d;',
            'icon-sec-POS_EX' : '&#xe02e;',
            'icon-sec-POS_AM' : '&#xe02f;',
            'icon-sec-POS_8C' : '&#xe030;',
            'icon-sec-OTHER' : '&#xe031;',
            'icon-sec-NTNSAR' : '&#xe032;',
            'icon-sec-NTNCSR' : '&#xe033;',
            'icon-sec-NT_20F' : '&#xe034;',
            'icon-sec-NT_11K' : '&#xe035;',
            'icon-sec-NT_10Q' : '&#xe036;',
            'icon-sec-NT_10K' : '&#xe037;',
            'icon-sec-NT_10D' : '&#xe038;',
            'icon-sec-NQ' : '&#xe039;',
            'icon-sec-NPX' : '&#xe03a;',
            'icon-sec-NCSRS' : '&#xe03b;',
            'icon-sec-NCSR' : '&#xe03c;',
            'icon-sec-N54C' : '&#xe03d;',
            'icon-sec-N54A' : '&#xe03e;',
            'icon-sec-N30D' : '&#xe03f;',
            'icon-sec-N30B2' : '&#xe040;',
            'icon-sec-N8F' : '&#xe041;',
            'icon-sec-N8B4' : '&#xe042;',
            'icon-sec-N8B3' : '&#xe043;',
            'icon-sec-N8B2' : '&#xe044;',
            'icon-sec-N8A' : '&#xe045;',
            'icon-sec-N6F' : '&#xe046;',
            'icon-sec-N6' : '&#xe047;',
            'icon-sec-N4' : '&#xe048;',
            'icon-sec-N2' : '&#xe049;',
            'icon-sec-FWP' : '&#xe04a;',
            'icon-sec-FN' : '&#xe04b;',
            'icon-sec-EXHIBIT' : '&#xe04c;',
            'icon-sec-DFRN14A' : '&#xe04d;',
            'icon-sec-DFAN14A' : '&#xe04e;',
            'icon-sec-DEL_AM' : '&#xe04f;',
            'icon-sec-DEFR14C' : '&#xe050;',
            'icon-sec-DEFR14A' : '&#xe051;',
            'icon-sec-DEFN14A' : '&#xe052;',
            'icon-sec-DEFC14C' : '&#xe053;',
            'icon-sec-DEFC14A' : '&#xe054;',
            'icon-sec-DEFA14C' : '&#xe055;',
            'icon-sec-DEFA14A' : '&#xe056;',
            'icon-sec-DEF_14C' : '&#xe057;',
            'icon-sec-DEF_14A' : '&#xe058;',
            'icon-sec-COVER' : '&#xe059;',
            'icon-sec-CORRESP' : '&#xe05a;',
            'icon-sec-CB' : '&#xe05b;',
            'icon-sec-AW' : '&#xe05c;',
            'icon-sec-AW_WD' : '&#xe05d;',
            'icon-sec-ARS' : '&#xe05e;',
            'icon-sec-ABS15G' : '&#xe05f;',
            'icon-sec-30582' : '&#xe060;',
            'icon-sec-4024B2' : '&#xe061;',
            'icon-sec-4017G' : '&#xe062;',
            'icon-sec-4017F2' : '&#xe063;',
            'icon-sec-4017F1' : '&#xe064;',
            'icon-sec-1515D' : '&#xe065;',
            'icon-sec-1512G' : '&#xe066;',
            'icon-sec-1512B' : '&#xe067;',
            'icon-sec-1012G' : '&#xe068;',
            'icon-sec-1012B' : '&#xe069;',
            'icon-sec-497K' : '&#xe06a;',
            'icon-sec-497J' : '&#xe06b;',
            'icon-sec-497H2' : '&#xe06c;',
            'icon-sec-497AD' : '&#xe06d;',
            'icon-sec-497' : '&#xe06e;',
            'icon-sec-487' : '&#xe06f;',
            'icon-sec-485BXT' : '&#xe070;',
            'icon-sec-485BPOS' : '&#xe071;',
            'icon-sec-485APOS' : '&#xe072;',
            'icon-sec-424B8' : '&#xe073;',
            'icon-sec-424B7' : '&#xe074;',
            'icon-sec-424B5' : '&#xe075;',
            'icon-sec-424B4' : '&#xe076;',
            'icon-sec-424B3' : '&#xe077;',
            'icon-sec-424B2' : '&#xe078;',
            'icon-sec-424B1' : '&#xe079;',
            'icon-sec-424A' : '&#xe07a;',
            'icon-sec-144' : '&#xe07b;',
            'icon-sec-40F' : '&#xe07c;',
            'icon-sec-40APP' : '&#xe07d;',
            'icon-sec-25' : '&#xe07e;',
            'icon-sec-20F' : '&#xe07f;',
            'icon-sec-18K' : '&#xe080;',
            'icon-sec-15F15D' : '&#xe081;',
            'icon-sec-15F12G' : '&#xe082;',
            'icon-sec-15F12B' : '&#xe083;',
            'icon-sec-11KT' : '&#xe084;',
            'icon-sec-11K' : '&#xe085;',
            'icon-sec-10QT' : '&#xe086;',
            'icon-sec-10Q' : '&#xe087;',
            'icon-sec-10KT' : '&#xe088;',
            'icon-sec-10K' : '&#xe089;',
            'icon-sec-10D' : '&#xe08a;',
            'icon-sec-8K' : '&#xe08b;',
            'icon-sec-8A12G' : '&#xe08c;',
            'icon-sec-8A12B' : '&#xe08d;',
            'icon-sec-6K' : '&#xe08e;'
        };
      
    // END ICON SET PASTE FROM ICOMOON


    // Basic Icon Documentation Functionality Enhancements
    //----------------------------------------------

        // find all glyph inputs - no matter which set they are a part of
        var $glyphInputs = $('.wdesk-docs-icomoon-glyphs').find('input');
        $glyphInputs.click(function(e){
            $(this)
                .focus()
                .select();
        });

    // END Basic Icon ...

    //----------------------------------------------
    // Use the ObjectLiterals provided by IcoMoon 
    // to extract classnames / PUA values for our
    // icon example documentation
    // housed within static/_includes/wdesk-icons.html / wdesk-sec-icons.html
    //----------------------------------------------

    var iconExampleDOMupdate = function(classname, pua, $glyphSet, twocolor) {

        var iconclasses = classname + ' icon';

        if(! twocolor) { twocolor = false; }
        var puaValue = pua[classname];
        // find puaValue in the value attribute of the input
        var $glyphInputMatch = $glyphSet.find('input[value="' + puaValue + '"]');
        $glyphInputMatch.parent().append('<small class="classname"><code>.' + classname + '</code></small>');

        if(twocolor) {
            iconclasses = iconclasses + ' icon-two-color';
        } else {
            // don't do this for two-color icons since they tecnically have two pua's
            $glyphInputMatch.before('<label>PUA: </label>');
        }

        if($glyphSet == $wfmlGlyphSet) {
            iconclasses = iconclasses + ' color';
        }

        $glyphInputMatch.parent().find('.fs1').addClass(iconclasses);

        if(twocolor) {
            $glyphInputMatch.remove();
        }

    }; // END iconExampleDOMupdate()


    // add classname info for each icon set

    // MAIN SET
    var $mainGlyphSet = $('#main');
    // don't parse this entire list unless its there :)
    if($mainGlyphSet.length > 0) {
        for (mainClassname in mainPua) {
            iconExampleDOMupdate(mainClassname, mainPua, $mainGlyphSet);
        }
    }

    // TWO COLOR SET
    var $twoColorGlyphSet = $('#two-color');
    // don't parse this entire list unless its there :)
    if($twoColorGlyphSet.length > 0) {
        for (twoColorClassname in twoColorPua) {
            iconExampleDOMupdate(twoColorClassname, twoColorPua, $twoColorGlyphSet, true);
        }
    }

    // WFML DOCTYPE SET
    var $wfmlGlyphSet = $('#wfml');
    // don't parse this entire list unless its there :)
    if($wfmlGlyphSet.length > 0) {
        for (wfmlClassname in wfmlPua) {
            iconExampleDOMupdate(wfmlClassname, wfmlPua, $wfmlGlyphSet);
        }
    }

    // END ICOMOON DOM HELPERS
    // ---------------------------------------------------------------------------

  
});
