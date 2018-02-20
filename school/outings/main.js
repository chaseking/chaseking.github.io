const BACKGROUND_COLORS = [
    "#6D214F", //Dark purple
    "#182C61", //Dark blue
    "#EAB543", //Gold
    "#6ab04c", //Green
    "#22a6b3", //Aqua
    "#e17055", //Orangish
    "#6c5ce7", //Purple
    "#c23616", //Dark red
    "#8c7ae6", //Light purple
    "#ff793f", //Pale-ish orange
    // "#badc58", //Grass green
    "#006266", //Dark aqua
    "#B53471", //Dark purple
    "#D980FA", //Pink
    "#009432", //Green
].sort(() => 0.5 - Math.random()); //Randomize

$(document).ready(function(){
    var slides = $(".outing-slide");
    var header = $("header");

    slides.each(function(n){
        let slide = $(this);
        let color = BACKGROUND_COLORS[n % BACKGROUND_COLORS.length];

        slide.css({
            background: color,
            "border-color": color
        });

        slide.click(function(){
            if(slide.hasClass("expanded")){
                slide.removeClass("expanded");
            } else {
                slides.removeClass("expanded");
                slide.toggleClass("expanded");
            }
        })
    });

    $("main").css("margin-top", (header.height() + 20) + "px");

    $(window).scroll(function(){
        let win = $(window);

        if(win.scrollTop() > 0){
            header.addClass("collapsed");
        } else {
            header.removeClass("collapsed");
        }
    });
});
