(function ($) {
    $(document).ready(function () {

        /*漢堡選單*/
        $('.menu-btn').click(function () {
            $('.menu-btn').toggleClass('open');
            $('body').toggleClass('height100');
        });
        $('.site-overlay').click(function () {
            $('.menu-btn').removeClass('open');
            $('body').removeClass('height100');
        });
        //修正ios的mobile menu
        $('.site-overlay,.pushy').on('touchmove', function (e) {
            e.preventDefault();
        });

        /*main_btn 主選單*/
        $(".main_btn").click(function(){
            var subMenu = $(this).find(".sub_menu").hasClass("sub_menu");
            if(subMenu == true){
                $(this).find(".sub_menu").toggleClass("none");
            }else{
                $(this).addClass("active").siblings().removeClass("active");
            }
        })
        /*newsTable 最新消息*/
        $(".newsTable li").click(function(){
            $(this).addClass("active").siblings().removeClass("active")
        })

        /*Iframe*/
        $('a.main_btn, .main_btn a, .changeSrc, .sidebar-menu a').on('click',function(e){
            e.preventDefault();
            var srcLink = $(this).attr("href");
            $('#myIframe', window.parent.document).attr("src", srcLink)
            // /*移除漢堡選單效果*/
            // $('.menu-btn').removeClass('open');
            // $('body').removeClass('height100');
        });
        
        /*checkbox*/
        $(".checkboxAll").click(function(){
            console.log($(this).hasClass("checked"))
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
                $(".checkbox").removeClass("checked");
            }else{
                $(this).addClass("checked");
                $(".checkbox").addClass("checked");
            }
        });
        $(".checkbox").click(function(){
            $(this).toggleClass("checked");
            
        });

        /*將檢視畫面可輸入地方關閉*/
        $(".onlyRead input,.onlyRead select,.onlyRead textarea").attr("disabled",true);
        $(".onlyRead .subData .choiceBox input").attr("disabled",false);

    });  

})(this.jQuery);