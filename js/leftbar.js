$(".sidebar-dropdown > a").click(function() {
    $(".sidebar-submenu").slideUp(200);
    if (
        $(this)
            .parent()
            .hasClass("active")
    ) {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
            .parent()
            .removeClass("active");
    } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
            .next(".sidebar-submenu")
            .slideDown(200);
        $(this)
            .parent()
            .addClass("active");
    }
});
$(".sidebar-submenu ul li a").click(function() {
    if (
        $(this).hasClass("is-active")
    ) {
        $(".sidebar-submenu ul li").removeClass("is-active");
        $(this).removeClass("is-active");
    } else {
        $(".sidebar-submenu ul li").removeClass("is-active");
        $(this).parent().addClass("is-active");
    }
});
$(".sidebar-menu ul li").click(function() {
    if (
        ($(this).hasClass("active")) && (!$(this).hasClass("sidebar-dropdown"))
    ) {
        $(".sidebar-menu ul li").removeClass("active");
        $(this)
            .removeClass("active");
    } else {
        $(".sidebar-menu ul li").removeClass("active");
        $(this)
            .next(".sidebar-menu ul li a")
        $(this)
            .addClass("active");
    }
});

$("#show-sidebar").click(function() {
    $(".page-wrapper").toggleClass("toggled");
});

