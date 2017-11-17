$("#gcd_calculate").click(function(event){
    event.preventDefault();
    $("#gcd_table tbody").empty();
    var a = $("#gcd_a").val();
    var b = $("#gcd_b").val();

    try {
        a = parseInt(a);
        b = parseInt(b);
    } catch(e){
        alert("Please enter valid numbers.");
        $("#gcd_a").val("");
        $("#gcd_b").val("");
        return;
    }

    //Ensure that a ≥ b
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
        console.log(a);
        console.log(b);
    }

    var initialA = a;
    var initialB = b;

    var quotients = [0, 0];
    var remainders = [a, b];
    var x = [0, 0];
    var y = [0, 0];
    var step = 1;

    var mainTable = $("#gcd_table_euclid tbody");
    mainTable.empty();

    while(true){
        var remainder = a % b;
        var quotient = (a - remainder) / b;

        quotients.push(quotient);
        remainders.push(remainder);

        if(step == 1){
            x.push(1);
            y.push(-quotient);
        } else {
            x.push(x[x.length - 2] - (quotient * x[x.length - 1]));
            y.push(y[y.length - 2] - (quotient * y[y.length - 1]));
        }

        step++;

        var html = "<tr>";
        html += "<td>" + a + " = " + b + "*" + quotient + " + ";

        if(b % remainder == 0){
            html += "<span class='highlight'>" + remainder + "</span>";
        } else {
            html += remainder;
        }

        html += "<td></td>";
        html += "</tr>";

        mainTable.append(html);

        if(remainder == 0){
            $("#gcd_value").text("The GCD of " + initialA + " and " + initialB + " is: " + b);
            break;
        }

        //"Shift" the variables
        a = b;
        b = remainder;
    }

    var tdIndex = 0;
    var currX = 1;
    var currY = 0;
    for(var n = x.length - 2; n > 1; n--){
        var td = mainTable.find("tr").eq(tdIndex++).find("td").eq(1);
        var html = "";
        var isLastStep = n == 2;

        if(n == x.length - 2){
            //First step (include GCD)
            currY = quotients[n];
            html += "<strong>" + remainders[n] + " = " + remainders[n - 2] + "*" + currX + " - " + remainders[n - 1] + "*" + currY + "</strong>";
        } else {
            var modifyLeft = n % 2 == 1;
            html += "= ";

            if(modifyLeft){
                html += "(" + remainders[n - 2] + " - " + remainders[n - 1] + "*" + quotients[n] + ")*" + currX + " - " + remainders[n - 1] + "*" + currY;

                currY += quotients[n] * currX;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += "= <strong>" + remainders[n - 2] + "*" + currX + " - " + remainders[n - 1] + "*" + currY + "</strong>";
                if(isLastStep) html += "</span>";
            } else {
                html += remainders[n - 1] + "*" + currX + " - (" + remainders[n - 2] + " - " + remainders[n - 1] + "*" + quotients[n] + ")" + "*" + quotients[n + 1];

                currX += quotients[n] * currY;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += "<strong>" + remainders[n - 1] + "*" + currX + " - " + remainders[n - 2] + "*" + currY + "</strong>";
                if(isLastStep) html += "</span>";
            }
        }

        if(n == 2){
            //Last step (linear combination variables)
            html += "<br>";
            html += "<strong><em>(Linear combination)</strong></em>";
        }

        td.html(html);
    }

    //Data table
    var dataTable = $("#gcd_table_data tbody");
    dataTable.empty();
    for(var i = 0; i < x.length; i++){
        var tr = "<tr>";

        tr += "<td><strong>" + (i <= 0 ? "" : (i - 1)) + "</strong></td>"; //Step
        tr += "<td>" + quotients[i] + "</td>"; //Quotient

        //Remainder
        if(i == 0){
            tr += "<td><em>a = " + remainders[i] + "</em></td>";
        } else if(i == 1){
            tr += "<td><em>b = " + remainders[i] + "</em></td>";
        } else {
            tr += "<td>" + remainders[i] + "</td>";
        }

        tr += "<td>" + x[i] + "</td>"; //X
        tr += "<td>" + y[i] + "</td>"; //Y

        dataTable.append(tr + "</tr>");
    }
});
