(function () {
    /**
     * Patch TOC menus
     *
     *    Mutate all sphinx navigation elements to have the
     *    correct nesting level / classnames for wdesk skinning
     *
     */

    var $globalTOC, $localTOC, $sidebarTOC;
    var ddMenuClass       = 'dropdown-menu';
    var ddSubMenuClass    = 'dropdown dropdown-submenu';
    var hitareaClass      = 'hitarea'; // all links in navs have to have this class to receive styling.
    var sphinxActiveClass = 'current';
    var wdeskActiveClass  = 'active';

    function patchToc ($menu, maxLevel) {

        var isSidebar = $menu.is('.wdesk-docs-sidenav') || $menu.closest('.wdesk-docs-sidenav').length > 0;

        // STEP 1
        // -------------------------
        // Remove the extra wrapper ul that sphinx uses
        // that screws up our recursive parsing in step 2
        function removeExtraUl () {
            var $menus = $menu.find('> ul');
            $.each($menus, function (index, extraUL) {
                var $extraUL = $(extraUL);
                var listDOM  = $extraUL.html();
                $extraUL.closest('.toc').append(listDOM);
                $extraUL.remove();
            });
        }

        // STEP 2
        // -------------------------
        // resursively traverse the menus, ensuring that nested ULs
        // are converted to dropdown-submenus
        var findA, baseLevel = 0;
        findA = function($menu, level) {
            var newLevel = level;
            var $items = $menu.find('> li > a.internal, > ul, > li > ul');

            // Iterate everything in order.
            $items.each(function (index, item) {
                var $item       = $(item),
                    tag         = item.tagName.toLowerCase(),
                    $childrenLi = $item.children('li'),
                    $parentLi   = $item.closest('li');

                    if (tag === 'ul' && $childrenLi.length > 0) {
                        if(! isSidebar) {
                            // Add dropdowns if more children and above minimum level.
                            $parentLi.addClass(ddSubMenuClass)
                                     .children('a').first().attr('tabindex', -1);
                            $item.addClass(ddMenuClass);
                        } else {
                            $item.addClass('nav');
                        }
                    }

                $($item.filter('a'), $item.find('a')).addClass(hitareaClass);

                findA($item, level + 1);
                finalTocCleanup($menu);
            });
        };

        removeExtraUl();
        findA($menu, baseLevel);
        // END STEP 2
        // -------------------------

    } // END patchToc()

    // STEP 3
    // -------------------------
    // traverse the newly generated/parsed navs
    // and add class information we need to style them via wdesk
    function finalTocCleanup ($menu) {
        var isTopnav = $menu.closest('.navbar-nav').length > 0;

        function parseMenuLinks () {
            var $links = $menu.find('a');
            $.each($links, function (index, link) {
                var $link = $(link);
                $link.addClass(hitareaClass);
                // find any links with "Indices and tables"
                // as the text and remove them.
                if($link.text() == 'Indices and tables') {
                    $link.closest('li').remove();
                }
            }); // END .each $menu a
        }

        function parseMenuItems () {
            var $menuItems = $menu.find('li');
            $.each($menuItems, function (index, menuItem) {
                var $menuItem = $(menuItem);
                $menuItem.filter('.' + sphinxActiveClass).addClass(wdeskActiveClass);

                if(index + 1 == $menuItems.length) {
                    parseMenuLinks();
                }
            }); // END .each $menu li
        }

        // trigger the cleanup
        parseMenuItems();

    }
    // END STEP 3
    // -------------------------


    /**
     * Patch all tables to remove ``docutils`` class and add wdesk table classes
     */
    function patchTables () {
        $('table.docutils')
            .removeClass('docutils')
            .addClass('table table-striped table-bordered');
    }


    /**
     * Patch all buttons so they look like Web Skin buttons
     */
    function patchButtons () {
        $('input[type=button], input[type=submit], input[type=reset], button')
            .addClass('btn');
    }

    $(document).ready(function () {
        $globalTOC  = $('.navbar ul.globaltoc');
        $localTOC   = $('.navbar ul.localtoc');
        $sidebarTOC = $('.wdesk-docs-sidebar ul.wdesk-docs-sidenav');

        // Patch TOC MENUS.
        patchToc($globalTOC, 2, false);
        patchToc($localTOC, 2, false);
        patchToc($sidebarTOC, 2, true);

        // Patch buttons.
        patchButtons();

        // Patch tables.
        patchTables();
    });

}());