$("#gcd_calculate").click(function(event){
    event.preventDefault();
    var a = $("#gcd_a").val();
    var b = $("#gcd_b").val();

    console.log(a);
    console.log(b);

    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }

    var q = [0, 0];
    var r = [a, b];
    var x = [0, 1];
    var y = [0];

    while(true){
        var remainder = a % b;
        var coefficient = (a - remainder) / b;

        q.push(coefficient);
        r.push(remainder);

        a = b;
        b = remainder;

        if(remainder == 0){
            $("#gcd_value").text("The GCD is: " + a);
            break;
        }
    }
});
