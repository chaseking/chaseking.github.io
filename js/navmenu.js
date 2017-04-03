var nav = $(".navigation");
var trigger = $(".navigation .navigation-trigger");

//Close menu if clicked elsewhere
$(document).click(function(event){
    if(!$(event.target).is(".navigation") && nav.hasClass("active")){
        toggleMenu();
    }
});

function toggleMenu(){
    if(nav.hasClass("animating")) return; //No spam-clicking

    nav.toggleClass("active");
    nav.addClass("animating");
    var active = nav.hasClass("active");
    //list.slideToggle(400);
    var offset = 50;
    var animationTime = 500;

    $(".navigation .navigation-option").each(function(){
        $(this).css("transition", "all " + animationTime + "ms cubic-bezier(0.680, -0.550, 0.265, 1.550)")
        if(active){
            $(this).css("visibility", "visible");
            $(this).css("transform", "translate(0, " + offset + "px)")
        } else {
            $(this).css("transform", "initial")
        }
        offset += 65;
    });

    //trigger.html("<i class=\"fa fa-" + (active ? "close" : "bars") + "\" aria-hidden=\"true\"></i>");
    //Callback for when the animation is complete
    setTimeout(function(){
        nav.removeClass("animating");
        if(!active){
            $(".navigation .navigation-option").each(function(){
                //$(this).hide();
                $(this).css("visibility", "hidden");
            });
        }
    }, animationTime);
}
