$(document).ready(function () {
    function womanClimbingWall() {
        var el = document.querySelector('#womanclimbing-wall-bw');
        var myAnimation = new LazyLinePainter(el, {
            "ease": "easeLinear",
            "strokeWidth": 1,
            "strokeOpacity": 1,
            "strokeColor": "#f9c8c8"
        });

        function completeFn() {
            $(".about-overlay img").fadeIn({ duration: 1500, queue: false });

            $(el).fadeOut({ duration: 1500, queue: false });
        }
        myAnimation.on('complete', completeFn);
        myAnimation.paint();
    }

    function banksy() {
        var el = document.querySelector('#banksy');
        var myAnimation = new LazyLinePainter(el, {
            "ease": "easeLinear",
            "strokeWidth": 3,
            "strokeOpacity": 1,
            "strokeColor": "#ffffff",
            "delay": 0,
            "reverse": true
        });

        function completeFn() {

            $(".img-overlay").fadeIn({ duration: 1500, queue: false });

            setTimeout(function () {
                $(".balloon-overlay").fadeIn(1000, function () {
                    var y = $(this).offset().top + 10;
                    $(this).animate({ top: "-" + y + "px", left: "20%" }, 1000);
                });
            }, 500);


            $(el).fadeOut({ duration: 1500, queue: false });
        }
        myAnimation.on('complete', completeFn);


        el.style.opacity = '1';
        myAnimation.paint();
    }

    //womanClimbingWall();
    banksy();
    var win = $(window);
    var elem = $('#womanclimbing-wall-bw');

    function scrollFn(ev) {
        var y = win.scrollTop();
        var h = win.height();
        var elemTop = elem.offset().top;

        if ((y + h) > elemTop) {
            $(window).off("scroll", scrollFn);
            womanClimbingWall();
        }
    }

    $(window).scroll(scrollFn)


});