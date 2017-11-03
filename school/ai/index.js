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

setTimeout(addText, 1500);

function addText(){
    header.text(text.substring(0, header.text().length + 1));
    lastType = Date.now();
    updateCursor();

    if(header.text().length < text.length){
        setTimeout(addText, 85 + Math.random() * 100);
    }
}


$(".step").click(function(){
    // $(this).addClass("active").prevAll().addClass("active");
    // $(this).nextAll().removeClass("active");
    $(this).addClass("active").siblings().removeClass("active");
});

//TODO - Convert to data-step = num

$(".step01").click(function(){
    $(".line-progress").css("width", "0%");
    $(".discovery").addClass("active").siblings().removeClass("active");
});

$(".step02").click(function(){
    $(".line-progress").css("width", "25%");
    $(".strategy").addClass("active").siblings().removeClass("active");
});

$(".step03").click(function(){
    $(".line-progress").css("width", "50%");
    $(".creative").addClass("active").siblings().removeClass("active");
});

$(".step04").click( function() {
    $(".line-progress").css("width", "75%");
    $(".production").addClass("active").siblings().removeClass("active");
});

$(".step05").click( function() {
    $(".line-progress").css("width", "100%");
    $(".analysis").addClass("active").siblings().removeClass("active");
});

$("#color").click( function() {
    $("body").toggleClass("blue")
});
