$(".dtDateFormItem").each(function () {
    var $this = $(this);
    if ($this.data("minlimit").default) {
        $this.attr("data-minlimit", '{"default":"changed","date":"-999y-0m-0d", "time":"00:00"}');
    }
    if ($this.data("maxlimit").default) {
        $this.attr("data-maxlimit", '{"default":"changed","date":"+999y-0m-0d", "time":"00:00"}')
    }
});
$(".dateFormItem").each(function () {
    var $this = $(this);
    if ($this.data("minlimit").default) {
        $this.attr("data-minlimit", '{"default":"changed","date":"-999y-0m-0d"}')
    }
    if ($this.data("maxlimit").default) {
        $this.attr("data-maxlimit", '{"default":"changed","date":"+999y-0m-0d"}')
    }
});
$("#pageResult").addClass("scrollDiv");