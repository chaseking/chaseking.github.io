$(function(){
    var pages = $(".page");
    var header = $("header");

    $(".span-letters").each(function(){
      let elem = $(this);
      let textArray = elem.text().split(""); //Split each letter
      elem.html("");

      for(let i in textArray){
        elem.append("<span class='letter'" + (textArray[i] == " " ? " style='width: 0.3em;'" : "") + ">" + textArray[i] + "</span>");
      }
    });

    $("[data-page]").click(function(event){
        event.preventDefault();

        let targetPage = $("#" + $(this).data("page"));

        //Animate the scroll
        $("html, body").animate({
            scrollTop: targetPage.offset().top - parseInt(targetPage.css("marginTop").replace("px", "")) - header.height() // - parseInt(targetPage.css("paddingTop"))
        }, 750);

        //Close the nav menu
        $("nav").removeClass("active");
    });

    var slider = $(".nav-active-slider");

    function onScroll(){
        var windowTop = $(window).scrollTop() + header.height();

        for(let i = pages.length - 1; i >= 0; i--){ //Start at the bottom first so we only have to check the top of pages
            let page = pages.eq(i);
            let pageTop = page.offset().top;
            let pageHeight = page.height();

            if(pageTop < windowTop + (pageHeight * 0.3)){ //If most of the page is in view
                let pageNavItem = $("nav a[data-page='" + page.attr("id") + "']");
                let pageColor = page.css("border-color");

                if(pageNavItem.length > 0){
                    slider.css({
                        left: pageNavItem.position().left,
                        width: pageNavItem.width(),
                        "background-color": pageColor
                    });
                }

                header.find("h1").css("border-bottom-color", pageColor);

                break;
            }
        }
    }

    $(document).scroll(onScroll);
    onScroll();

    //Masonry imagesLoaded
    $("[data-masonry]").each(function(){
        let grid = $(this);

        grid.imagesLoaded().progress(function(){
            grid.masonry();
        });

        //Make all images zoomable
        grid.find("img").attr("data-action", "zoom");
    });

    $(".tab-title").click(function(){
        let title = $(this);
        let item = title.closest(".tab-item");
        let content = title.siblings(".tab-content");

        if(item.hasClass("expanded")){
            item.removeClass("expanded");
            content.slideUp(250);
            // setTimeout(() => content.slideUp(500), 1000);
        } else {
            item.siblings(".tab-item.expanded").removeClass("expanded").find(".tab-content").slideUp(250);
            item.addClass("expanded");

            content.slideDown(250);
        }
    });
});

function toggleNav(elem){
  elem = $(elem);
  // elem.toggleClass("active");
  $("nav").toggleClass("active");
}
