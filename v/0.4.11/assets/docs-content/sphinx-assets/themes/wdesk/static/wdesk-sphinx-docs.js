!function ($) { $(function() {
    var $sidenav = $('.wdesk-docs-sidenav');
    var $navbar = $('.wdesk-docs-navbar');
    var navHeight =
        sideBarMargin =
        navRibbonHeight = 0;


    function getAffixOffset () {
        // measurement helpers
        sideBarMargin        = sideBarMargin || parseInt($sidenav.css('margin-top'), 10);
        navHeight            = navHeight || $navbar.outerHeight(true) + navRibbonHeight;
        var sideBarOffsetTop = $sidenav.offset().top;

        return sideBarOffsetTop - navHeight - sideBarMargin - 15;
    }

    $sidenav
        .affix({
            offset: {
                top: function () {
                    return (this.top = getAffixOffset());
                }
              , bottom: function () {
                    return (this.bottom = $('.wdesk-docs-footer').outerHeight(true));
                }
            }
        })
        .addClass('in');
});}(jQuery);