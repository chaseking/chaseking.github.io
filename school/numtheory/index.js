$("#gcd_calculate").click(function(event){
    event.preventDefault();
    $("#gcd_table tbody").empty();
    var a = $("#gcd_a").val();
    var b = $("#gcd_b").val();

    if(a < b){
        console.log("A is less than B");
        var temp = a;
        a = b;
        b = temp;
    }

    console.log(a);
    console.log(b);

    var quotients = [0, 0];
    var remainders = [a, b];
    var x = [0, 1];
    var y = [0];

    while(true){
        var remainder = a % b;
        var coefficient = (a - remainder) / b;

        console.log(a + " = " + b + "*" + coefficient + " + " + remainder);

        $("#gcd_table tbody").append("<tr><td>" + (a + " = " + b + "*" + coefficient + " + " + remainder) + "</td></tr>");

        quotients.push(coefficient);
        remainders.push(remainder);

        a = b;
        b = remainder;

        if(remainder == 0){
            $("#gcd_value").text("The GCD is: " + a);
            break;
        }
    }
});
