const cursorBlink = 500;
$(".animate-typing").each(function(){
    var div = $(this);
    var contents = div.find(".animate-typing-text");
    var cursor = $("<span class='cursor'></span>");
    var cursorVisible = true;

    //Save the text in the headings
    var contentsText = [];

    for(var i = 0; i < contents.length; i++){
        let span = contents.eq(i).find("span").eq(0);
        contentsText[i] = span.text();
        span.text("");
    }

    typeHeading(0);

    function typeHeading(headingIndex){
        if(headingIndex >= contents.length){
            //Add the cursor after the first heading
            if(contents.length > 1){
                cursor.remove();
                contents.eq(0).append(cursor);
            }

            var index = 0;
            var fades = div.find(".fade").each(function(){
                $(this).delay(500 + (1000 * index++)).animate({ opacity: 1 }, 500);
            })

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
            cursor.data("lastType", Date.now());
            updateCursor(cursor);

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

//Cursor blink
function updateCursor(cursor){
    var lastType = cursor.data("lastType");
    var cursorVisible = cursor.data("isVisible");

    if(!lastType || Date.now() - lastType < 500){
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

    cursor.data("isVisible", cursorVisible);
}

setInterval(function(){
    $(".cursor").each(function(){
        updateCursor($(this));
    });
}, cursorBlink);

var pageHeadingAnimateIndex = -1;
$(".section-content h2").each(function(){
    var h2 = $(this);
    h2.data("text", h2.text());
    h2.empty();

    var textSpan = $("<span class='text'></span>");
    var cursor = $("<span class='cursor'></span>");
    h2.append(textSpan);
    h2.append(cursor);
});

function setCurrentPage(index, scroll){
    var section = $(".section-content[data-page=" + index + "]");

    $(".step[data-page=" + index + "]").addClass("active").siblings().removeClass("active");
    section.addClass("active").siblings().removeClass("active");
    $(".line-progress").css("width", ((100 / ($(".section-content").length - 1)) * (index - 1)) + "%");

    //Scroll to the top heading
    if(scroll){
        $("html, body").animate({
            scrollTop: section.offset().top - 100
        }, 800);
    }

    //Animate typing of the top heading
    pageHeadingAnimateIndex = index;
    var h2 = section.find("h2");
    var fullText = h2.data("text");
    var textSpan = h2.find("span.text");
    var cursor = h2.find("span.cursor");

    //Clear the header text
    textSpan.text("");

    //Start typing after a 500ms delay
    setTimeout(function(){
        addText();
    }, 500);

    function addText(){
        textSpan.text(fullText.substring(0, textSpan.text().length + 1));
        cursor.data("lastType", Date.now());
        updateCursor(cursor);

        if(textSpan.text().length < fullText.length){
            if(pageHeadingAnimateIndex == index){
                //Only keep typing letters if we're on the same page
                setTimeout(addText, 80 + Math.random() * 80);
            }
        } else {
            //All done!
        }
    }
}

setCurrentPage(1, false);

$(".step").click(function(){
    setCurrentPage($(this).data("page"), true);
});

$("button[data-page]").click(function(){
    setCurrentPage($(this).data("page"), true);
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
