var div = $("div.animate");
var header = div.find("span");
var text = header.text();
header.text("");

var cursor = $("<span class='cursor'></span>");
div.append(cursor);
var cursorVisible = true;
const cursorBlink = 550;
var lastType = -1;

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
setTimeout(addText, 1000);

function addText(){
    header.text(text.substring(0, header.text().length + 1));
    lastType = Date.now();
    updateCursor();

    if(header.text().length < text.length){
        setTimeout(addText, 85 + Math.random() * 100);
    }
}


$(".step").click(function(){
    setCurrentPage($(this).data("page-index"));
});

function setCurrentPage(index){
    $(".step[data-page-index=" + index + "]").addClass("active").siblings().removeClass("active");
    $(".section-content[data-page-index=" + index + "]").addClass("active").siblings().removeClass("active");
    $(".line-progress").css("width", ((100 / ($(".section-content").length - 1)) * (index - 1)) + "%");
}

//TODO - Convert to data-step = num

// $(".step01").click(function(){
//     $(".line-progress").css("width", "0%");
//     $(".discovery").addClass("active").siblings().removeClass("active");
// });
//
// $(".step02").click(function(){
//     $(".line-progress").css("width", "25%");
//     $(".strategy").addClass("active").siblings().removeClass("active");
// });
//
// $(".step03").click(function(){
//     $(".line-progress").css("width", "50%");
//     $(".creative").addClass("active").siblings().removeClass("active");
// });
//
// $(".step04").click( function() {
//     $(".line-progress").css("width", "75%");
//     $(".production").addClass("active").siblings().removeClass("active");
// });
//
// $(".step05").click( function() {
//     $(".line-progress").css("width", "100%");
//     $(".analysis").addClass("active").siblings().removeClass("active");
// });

$("#color").click( function() {
    $("body").toggleClass("blue")
});

var nav = $(".timeline-container");
var navPlaceholder = $("#timeline-container-placeholder");
const navHeight = nav.outerHeight(true); //Include the margin

$(window).scroll(function(){
    // console.log($(window).scrollTop());
    if($(window).scrollTop() >= 240){
        nav.addClass("fixed");
        navPlaceholder.height(navHeight);
    } else {
        nav.removeClass("fixed");
        navPlaceholder.height(0);
    }
});
