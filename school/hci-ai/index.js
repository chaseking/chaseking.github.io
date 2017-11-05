const cursorBlink = 500;
$(".animate-typing").each(function(){
    var div = $(this);
    var contents = div.find(".animate-typing-text");
    var cursor = $("<span class='cursor'></span>");
    var cursorVisible = true;
    var lastType = -1;

    //Save the text in the headings
    var contentsText = [];

    for(var i = 0; i < contents.length; i++){
        let span = contents.eq(i).find("span").eq(0);
        contentsText[i] = span.text();
        span.text("");
    }

    function updateCursor(){
        if(Date.now() - lastType < 500){
            if(!cursorVisible){
                cursorVisible = true;
                cursor.fadeIn(0);
            }
        } else {
            cursorVisible = !cursorVisible;

            if(cursorVisible){
                cursor.fadeIn(cursorBlink);
            } else {
                cursor.fadeOut(cursorBlink);
            }
        }
    }

    setInterval(updateCursor, cursorBlink);
    typeHeading(0);

    function typeHeading(headingIndex){
        if(headingIndex >= contents.length){
            //Add the cursor after the first heading
            cursor.remove();
            contents.eq(0).append(cursor);

            return;
        }

        var heading = contents.eq(headingIndex);
        var span = heading.find("span").eq(0);
        var fullText = contentsText[headingIndex];

        cursor.remove();
        heading.append(cursor);

        setTimeout(function(){
            addText();
        }, 500);

        function addText(){
            span.text(fullText.substring(0, span.text().length + 1));
            lastType = Date.now();
            updateCursor();

            if(span.text().length < fullText.length){
                setTimeout(addText, 65 + Math.random() * 80);
            } else {
                setTimeout(function(){
                    typeHeading(headingIndex + 1);
                }, 250);
            }
        }
    }
});

function setCurrentPage(index){
    var section = $(".section-content[data-page=" + index + "]");

    $(".step[data-page-index=" + index + "]").addClass("active").siblings().removeClass("active");
    section.addClass("active").siblings().removeClass("active");
    $(".line-progress").css("width", ((100 / ($(".section-content").length - 1)) * (index - 1)) + "%");

    $("html, body").animate({
        scrollTop: section.offset().top - 100
    }, 500);
}

$(".step").click(function(){
    setCurrentPage($(this).data("page"));
});

$("button[data-page]").click(function(){
    setCurrentPage($(this).data("page"));
});

var nav = $(".timeline-container");
var navPlaceholder = $("#timeline-container-placeholder");
const navHeight = nav.outerHeight(true); //Include the margin

$(window).scroll(function(){
    // console.log($(window).scrollTop());
    if($(window).scrollTop() >= $("header").outerHeight() + 65){
        nav.addClass("fixed");
        navPlaceholder.height(navHeight);
    } else {
        nav.removeClass("fixed");
        navPlaceholder.height(0);
    }
});
