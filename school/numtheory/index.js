function getIntegerInput(input){
    try {
        return parseInt(input.val());
    } catch(e){
        alert("Please enter a valid number.");
        input.val("");
        return false;
    }
}

$("#gcd_calculate").click(function(event){
    event.preventDefault();
    $("#gcd table").show();
    $("#gcd_table tbody").empty();
    var a = getIntegerInput($("#gcd_a"));
    var b = getIntegerInput($("#gcd_b"));

    //Ensure that a ≥ b
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
        console.log(a);
        console.log(b);
    }

    var originalA = a;
    var originalB = b;

    var quotients = [0, 0];
    var remainders = [a, b];
    var x = [0, 0]; //X[0] = 0
    var y = [0, 1]; //Y[0] = 1
    var step = 1;

    var mainTable = $("#gcd_table_euclid tbody");
    mainTable.empty();

    while(true){
        var remainder = a % b;
        var quotient = (a - remainder) / b;

        quotients.push(quotient);
        remainders.push(remainder);

        if(step == 1){
            x.push(1); //X[1] = 0
            y.push(-quotient); //Y[1] = -Q[1]
        } else {
            x.push(x[x.length - 2] - (quotient * x[x.length - 1]));
            y.push(y[y.length - 2] - (quotient * y[y.length - 1]));
        }

        step++;

        var html = "<tr>";
        html += "<td>" + a + " = " + b + "*" + quotient + " + ";

        if(b % remainder == 0){
            html += "<span class='highlight'>" + remainder + "</span>";
            html += "<br><strong><em>(GCD)</em></strong>";
        } else {
            html += remainder;
        }

        html += "<td></td>";
        html += "</tr>";

        mainTable.append(html);

        if(remainder == 0){
            $("#gcd_value").html("The GCD of " + originalA + " and " + originalB + " is <span class='highlight'>" + b + "</span>."
                + "<br>" + originalA + "*<span class='highlight'>" + x[x.length - 2] + "</span> + " + originalB + "*<span class='highlight'>" + y[y.length - 2] + "</span> = " + b
            );
            console.log(x[x.length - 1]);
            break;
        }

        //"Shift" the variables
        a = b;
        b = remainder;
    }

    var tdIndex = 0;
    var currX = 1;
    var currY = 0;
    // for(var n = x.length - 2; n > 1; n--){
    for(var i = 0; i < x.length - 3; i++){
        var td = mainTable.find("tr").eq(tdIndex++).find("td").eq(1);
        var html = "";
        var n = x.length - 2 - i; //The current index
        var isLastStep = i == x.length - 4;

        if(i == 0){
            //First step (include GCD)
            currY = quotients[n];
            html += remainders[n] + " = " + remainders[n - 2] + "*" + currX + " - " + remainders[n - 1] + "*" + currY;
        } else {
            var modifyLeft = i % 2 == 0;
            html += "= ";

            if(modifyLeft){
                html += "(" + remainders[n - 2] + " - " + remainders[n - 1] + "*" + quotients[n] + ")*" + currX + " - " + remainders[n - 1] + "*" + currY;

                currY += quotients[n] * currX;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += remainders[n - 2] + "*" + currX + " - " + remainders[n - 1] + "*" + currY;
                if(isLastStep) html += "</span>";
            } else {
                html += remainders[n - 1] + "*" + currX + " - (" + remainders[n - 2] + " - " + remainders[n - 1] + "*" + quotients[n] + ")" + "*" + currY;

                currX += quotients[n] * currY;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += remainders[n - 1] + "*" + currX + " - " + remainders[n - 2] + "*" + currY;
                if(isLastStep) html += "</span>";
            }
        }

        if(n == 2){
            //Last step (linear combination variables)
            html += "<br>";
            html += "<strong><em>(Linear Combination)</strong></em>";
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
            tr += "<td>";
            if(i == x.length - 2) tr += "<span class='highlight'>";
            tr += remainders[i] + "</td>";
        }

        //X
        tr += "<td>";
        if(i == x.length - 2) tr += "<span class='highlight'>";
        tr += x[i];
        tr += "</td>";

        //Y
        tr += "<td>";
        if(i == x.length - 2) tr += "<span class='highlight'>";
        tr += y[i] + "</td>";

        dataTable.append(tr + "</tr>");
    }
});

$("#triangle_area_graphupdate").click(function(e){
    e.preventDefault();

    var x1 = getIntegerInput($("#triangle_area_x1")), y1 = getIntegerInput($("#triangle_area_y1")),
        x2 = getIntegerInput($("#triangle_area_x2")), y2 = getIntegerInput($("#triangle_area_y2")),
        x3 = getIntegerInput($("#triangle_area_x3")), y3 = getIntegerInput($("#triangle_area_y3"));

    var minX = Math.min(x1, Math.min(x2, x3));
    var maxX = Math.max(x1, Math.max(x2, x3));
    var minY = Math.min(y1, Math.min(y2, y3));
    var maxY = Math.max(y1, Math.max(y2, y3));

    var plotData = [
        //The original triangle
        {
            fnType: "points",
            graphType: "polyline",
            // closed: true,
            color: "blue",
            points: [
                [x1, y1],
                [x2, y2],
                [x3, y3],
                [x1, y1] //Reconnect it to the beginning
            ]
        },

        //The square surrounding the triangle
        {
            fnType: "points",
            graphType: "polyline",
            color: "black",
            points: [
                [minX, minY],
                [minX, maxY],
                [maxX, maxY],
                [maxX, minY],
                [minX, minY],
            ]
        }
    ];

    var points = [ [x1, y1], [x2, y2], [x3, y3] ];

    for(let i = 0; i < points.length; i++){
        let x = points[i][0];
        let y = points[i][1];

        if((x == minX && y == minY) //Lower left corner
            || (x == minX && y == maxY) //Upper left corner
            || (x == maxX && y == minY) //Upper right corner
            || (x == maxX && y == minY)){ //Lower right corner
            //If the point is on a corner of the cube, then it can be translated to the origin
            console.log("Point " + (i + 1) + " (" + x + ", " + y + ") can be translated to the origin."); //Could get the midpoint of the two other points to determine which quadrant the triangle would be in

            //Translate all points
            for(let j in points){
                points[j][0] -= x;
                points[j][1] -= y;
            }

            //Add the translated triangle to the graph
            plotData.push({
                fnType: "points",
                graphType: "polyline",
                // closed: true,
                color: "red",
                points: [
                    [points[0][0], points[0][1]],
                    [points[1][0], points[1][1]],
                    [points[2][0], points[2][1]],
                    [points[0][0], points[0][1]],
                ]
            });

            //Calculate area
            let a = 0, b = 0, c = 0, d = 0;

            for(let j = 0; j < points.length; j++){
                if(j != i){
                    if(a == 0 && b == 0){
                        a = points[j][0];
                        b = points[j][1];
                    } else {
                        c = points[j][0];
                        d = points[j][1];
                    }
                }
            }

            //Result text
            $("#triangle_area_value").text("The area of the triangle is " + (Math.abs((a * d) - (b * c)) / 2) + ".");

            //Translate back
            for(let j in points){
                points[j][0] += x;
                points[j][1] += y;
            }
        }
    }

    //Update the graph
    functionPlot({
        target: "#triangle_area_graph",
        data: plotData,
        width: 800,
        height: 500
    });
});
