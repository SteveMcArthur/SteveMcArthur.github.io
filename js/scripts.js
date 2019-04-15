$(function () {
    var nav = $(".navbar");
    var socials = $(".sidebar .socials");
    var balloon = $(".balloon-overlay");
    var postContent = $(".post-content");
    var backToTop = $("#back-to-top");

    var isHome = $("body.home").length > 0;

    var isFixed = false;
    var isVis = false;
    $(window).on("scroll", function () {
        if (!isFixed && this.scrollY > 100) {
            /*   nav.hide();
              nav.addClass("fixed-top");
              //socials.addClass("dark");
              nav.fadeIn(); */
            //nav.animate({backgroundColor: "#fff"}, 'slow');
            nav.addClass("bg-white");
            isFixed = true;
        } else if (isFixed && this.scrollY < 100) {
            isFixed = false;
            nav.removeClass("bg-white");
            //nav.animate({backgroundColor: "transparent"}, 'slow');
            /*  nav.hide();
             nav.removeClass("fixed-top");
             //socials.removeClass("dark");
             nav.fadeIn(1000); */
        }

    });

    var socialVisRange = {}
    function socialsScrollFn() {
        console.log("socialsScrollFn");
        var win = this;
        if ((win.scrollY > socialVisRange.top && win.scrollY < socialVisRange.bottom) && !isVis) {
            socials.fadeIn();
            isVis = true;
        } else if ((win.scrollY < socialVisRange.top || win.scrollY > socialVisRange.bottom) && isVis) {
            socials.fadeOut();
            isVis = false;
        }
    }
    var hasScroll = false;
    function setScrollParams() {
        socialVisRange = {
            top: postContent.offset().top,
            bottom: postContent.offset().top + postContent.height() - 500
        };
        if (!hasScroll) {
            $(window).on("scroll", socialsScrollFn);
            hasScroll= true;
        }
        socialsScrollFn.call(window)

    }

    $(window).resize(function () {
        var w = $(window).width();
        if (w > 767) {
            $(".navbar-collapse").removeClass("show");
        }
    });


    //if its a blog post page do the scroll show thing for socials
    //but only if the width > 767
    if (postContent.length && $(".post-content.blog-post").length > 0) {
        var w = $(window).width();
        if (w > 767) {
            setScrollParams();
        }
        //each time window is resized, check to see if need to do the
        //scroll thing
        $(window).resize(function () {          
            w = $(this).width();
            if (w > 767) {
                setScrollParams();
            } else {              
                $(window).off("scroll",socialsScrollFn);
                socials.hide();
                hasScroll = false;
            }
        });
    }
    var backToTopVis = false
    function backToTopFn() {
        var y = this.scrollY;
        if (y > 500 && !backToTopVis) {
            backToTop.addClass("on");
            backToTopVis = true;
        } else if (y < 500 && backToTopVis) {
            backToTop.removeClass("on");
            backToTopVis = false;
        }
    }
    function scrollToTop() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    if (backToTop.length > 0) {
        $(window).on("scroll", backToTopFn)
        backToTop.click(scrollToTop);
    }

    if (balloon.length) {
        setTimeout(function () {
            var y = balloon.offset().top + 5;
            balloon.animate({ top: "-" + y + "px", left: "20%" }, 1500);

        }, 1500);
    }


});