function getIntegerInput(input){
    try {
        return parseInt(input.val());
    } catch(e){
        alert("Please enter a valid number.");
        input.val("");
        return false;
    }
}

function gcd(a, b, stepCallback){
    //Ensure that a ≥ b
    var swapped = a < b;
    if(swapped){
        var temp = a;
        a = b;
        b = temp;
    }

    var originalA = a;
    var originalB = b;

    var quotients = [0, 0];
    var remainders = [a, b];
    var x = [0, 0]; //X[0] = 0
    var y = [0, 1]; //Y[0] = 1
    var step = 1;

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

        if(stepCallback){
            stepCallback({
                a: a,
                b: b,
                quotient: quotient,
                remainder: remainder,
                x: x,
                y: y,
                step: step,
            });
        }

        if(remainder == 0){
            break;
        }

        //"Shift" the variables
        a = b;
        b = remainder;
    }

    return {
        a: originalA,
        b: originalB,
        quotients: quotients,
        remainders: remainders,
        x: x,
        y: y,
        xSolution: (swapped ? y[y.length - 2] : x[x.length - 2]),
        ySolution: (swapped ? x[x.length - 2] : y[y.length - 2]),
        gcd: remainders[remainders.length - 2],
        swapped: swapped,
    };
}

$("#gcd_calculate").click(function(event){
    $("#gcd_table tbody").empty();
    $("#gcd_data").show();
    var a = getIntegerInput($("#gcd_a"));
    var b = getIntegerInput($("#gcd_b"));
    var mainTable = $("#gcd_table_euclid tbody");
    mainTable.empty();

    var data = gcd(a, b, function(data){
        var html = "<tr>";
        html += "<td>" + data.a + " = " + data.b + "*" + data.quotient + " + ";

        if(data.b % data.remainder == 0){
            html += "<span class='highlight'>" + data.remainder + "</span>";
            html += "<br><strong><em>(GCD)</em></strong>";
        } else {
            html += data.remainder;
        }

        html += "<td></td>";
        html += "</tr>";

        mainTable.append(html);
    });

    $("#gcd_value").html("The GCD of " + a + " and " + b + " is <span class='highlight'>" + data.gcd + "</span>."
        + "<br>" + a + "*<span class='highlight'>" + data.xSolution + "</span> + " + b + "*<span class='highlight'>" + data.ySolution + "</span> = " + data.gcd
    );

    var tdIndex = 0;
    var currX = 1;
    var currY = 0;

    for(var i = 0; i < data.x.length - 3; i++){
        var td = mainTable.find("tr").eq(tdIndex++).find("td").eq(1);
        var html = "";
        var n = data.x.length - 2 - i; //The current index
        var isLastStep = i == data.x.length - 4;

        if(i == 0){
            //First step (include GCD)
            currY = data.quotients[n];
            html += data.remainders[n] + " = " + data.remainders[n - 2] + "*" + currX + " - " + data.remainders[n - 1] + "*" + currY;
        } else {
            var modifyLeft = i % 2 == 0;
            html += "= ";

            if(modifyLeft){
                html += "(" + data.remainders[n - 2] + " - " + data.remainders[n - 1] + "*" + data.quotients[n] + ")*" + currX + " - " + data.remainders[n - 1] + "*" + currY;

                currY += data.quotients[n] * currX;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += data.remainders[n - 2] + "*" + currX + " - " + data.remainders[n - 1] + "*" + currY;
                if(isLastStep) html += "</span>";
            } else {
                html += data.remainders[n - 1] + "*" + currX + " - (" + data.remainders[n - 2] + " - " + data.remainders[n - 1] + "*" + data.quotients[n] + ")" + "*" + currY;

                currX += data.quotients[n] * currY;

                html += "<br>";
                html += "= ";

                if(isLastStep) html += "<span class='highlight'>";
                html += data.remainders[n - 1] + "*" + currX + " - " + data.remainders[n - 2] + "*" + currY;
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

    for(var i = 0; i < data.x.length; i++){
        var tr = "<tr>";

        tr += "<td><strong>" + (i <= 0 ? "" : (i - 1)) + "</strong></td>"; //Step
        tr += "<td>" + data.quotients[i] + "</td>"; //Quotient

        //Remainder
        if(i == 0){
            tr += "<td><em>a = " + data.remainders[i] + "</em></td>";
        } else if(i == 1){
            tr += "<td><em>b = " + data.remainders[i] + "</em></td>";
        } else {
            tr += "<td>";
            if(i == data.x.length - 2) tr += "<span class='highlight'>";
            tr += data.remainders[i] + "</td>";
        }

        //X
        tr += "<td>";
        if(i == data.x.length - 2) tr += "<span class='highlight'>";
        tr += data.x[i];
        tr += "</td>";

        //Y
        tr += "<td>";
        if(i == data.x.length - 2) tr += "<span class='highlight'>";
        tr += data.y[i] + "</td>";

        dataTable.append(tr + "</tr>");
    }
});

//https://www.desmos.com/api/v1.0/docs/index.html
var triangleAreaDesmosCalculator = Desmos.GraphingCalculator(document.getElementById("triangle_area_graph"), {
    keypad: false,
    expressions: false,
    settingsMenu: false,
    expressionsTopbar: false
});

$("#triangle_area_graphupdate").click(function(e){
    var points = [
        [ getIntegerInput($("#triangle_area_x1")), getIntegerInput($("#triangle_area_y1")) ],
        [ getIntegerInput($("#triangle_area_x2")), getIntegerInput($("#triangle_area_y2")) ],
        [  getIntegerInput($("#triangle_area_x3")), getIntegerInput($("#triangle_area_y3"))]
    ];

    var minX = Math.min(points[0][0], Math.min(points[1][0], points[2][0]));
    var maxX = Math.max(points[0][0], Math.max(points[1][0], points[2][0]));
    var minY = Math.min(points[0][1], Math.min(points[1][1], points[2][1]));
    var maxY = Math.max(points[0][1], Math.max(points[1][1], points[2][1]));

    function drawPolygon(id, points, color, style){
        for(let i = 0; i < points.length; i++){
            let point1 = points[i];
            let point2 = points[i == points.length - 1 ? 0 : i + 1];
            let latex;

            if(point1[0] == point2[0]){
                //Vertical line
                latex = "x = " + point1[0] + " \\left\\{ " + Math.min(point1[1], point2[1]) + " <= y <= " + Math.max(point1[1], point2[1]) + " \\right\\}";
            } else {
                let slope = (point2[1] - point1[1]) / (point2[0] - point1[0]);

                latex = "y - " + point1[1] + " = " + slope + " * (x - " + point1[0] + ") \\left\\{" + Math.min(point1[0], point2[0]) + " <= x <= " + Math.max(point1[0], point2[0]) + " \\right\\}";
            }

            triangleAreaDesmosCalculator.setExpression({
                id: id + i,
                latex: latex,
                color: color,
                style: style
            });
        }
    }

    //Draw the original triangle
    drawPolygon("originalTriangle", points, Desmos.Colors.BLUE, Desmos.Styles.DOTTED);

    //Draw the square surrounding the triangle
    drawPolygon("originalSquare", [
        [minX, minY],
        [minX, maxY],
        [maxX, maxY],
        [maxX, minY]
    ], Desmos.Colors.BLACK, Desmos.Styles.DOTTED);

    for(let i = 0; i < points.length; i++){
        let x = points[i][0];
        let y = points[i][1];

        if((x == minX && y == minY) //Lower left corner
            || (x == minX && y == maxY) //Upper left corner
            || (x == maxX && y == maxY) //Upper right corner
            || (x == maxX && y == minY)){ //Lower right corner
            //If the point is on a corner of the cube, then it can be translated to the origin
            console.log("Point " + (i + 1) + " (" + x + ", " + y + ") can be translated to the origin."); //Could get the midpoint of the two other points to determine which quadrant the triangle would be in

            //Translate all points
            for(let j in points){
                points[j][0] -= x;
                points[j][1] -= y;
            }

            //Draw the translated triangle
            drawPolygon("translatedTriangle", points, Desmos.Colors.RED, Desmos.Styles.SOLID);

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
            $("#triangle_area_value").text("The area of the triangle is " + (Math.abs((a * d) - (b * c)) / 2));

            //Translate back
            for(let j in points){
                points[j][0] += x;
                points[j][1] += y;
            }
        }
    }
});

//=============================
//      Vigenere Cipher
//=============================
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const LETTER_FREQUENCY = {
    a: 8.167,
    b: 1.492,
    c: 2.782,
    d: 4.253,
    e: 12.702,
    f: 2.228,
    g: 2.015,
    h: 6.094,
    i: 6.966,
    j: 0.153,
    k: 0.772,
    l: 4.025,
    m: 2.406,
    n: 6.749,
    o: 7.507,
    p: 1.929,
    q: 0.095,
    r: 5.987,
    s: 6.327,
    t: 9.056,
    u: 2.758,
    v: 0.978,
    w: 2.360,
    x: 0.150,
    y: 1.974,
    z: 0.074
};

// noUiSlider.create(document.getElementById("vigenere_slider"), {
// 	start: [ 1 ],
// 	step: 1,
// 	range: {
// 		min: [ 1 ],
// 		max: [ 26 ]
// 	},
// 	format: {
// 	  to: function(value){
// 		return ALPHABET[value - 1].toUpperCase();
// 	  },
// 	  from: function(value){
// 		return ALPHABET.indexOf(value.toLowerCase()) + 1;
// 	  }
// 	}
// });

function getIndices(child, parent){
    var regex = new RegExp(child, "g");
    var result;
    var indices = [];

    while((result = regex.exec(parent)) != null){
        indices.push(regex.lastIndex - child.length);
    }

    return indices;
}

const RAINBOW_BORDERS = [
    "255, 99, 132",
    "255, 159, 64",
    "255, 206, 86",
    "75, 192, 192",
    "54, 162, 235",
    "153, 102, 255"
];

var vigenereFrequencyChart = new Chart($("#vigenere_alphabetfrequency"), {
    type: "bar",
    data: {
        labels: ALPHABET.toUpperCase().split(""),
        datasets: [{
            label: "English Letter Frequency",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 1,
            data: ALPHABET.toLowerCase().split("").map(function(letter){
                return LETTER_FREQUENCY[letter];
            })
        }]
    },
    // options: {
    //     scales: {
    //         yAxes: [{
    //             ticks: {
    //                 beginAtZero:true
    //             }
    //         }]
    //     }
    // }
});

var cipherText;

//Factors: Put in numbers 2-20
for(let factor = 2; factor <= 20; factor++){
    $("#vigenere_factors thead tr").eq(1).append("<th>" + factor + "</th>");
}

$("#vigenere_update").click(function(){
    cipherText = $("#vigenere_ciphertext").val();

    if(!cipherText){
        alert("Please enter ciphertext!");
        return;
    }

    //Show and clear data
    $("#vigenere_data").show();
    $("#vigenere table tbody").empty();

    cipherText = cipherText.replace(/\s+/g, ""); //Remove spaces //https://stackoverflow.com/questions/5964373/is-there-a-difference-between-s-g-and-s-g
    var repetitions = cipherText.match(/(.{3,})(?=.*?\1)/g); //https://regexr.com <3

    repetitions.sort(function(a, b){
        if(a.length == b.length){
            return a < b ? -1 : 1;
        } else {
            return b.length - a.length;
        }
    });

    repetitions = repetitions.map(function(phrase){
        let data = {
            phrase: phrase,
            indices: getIndices(phrase, cipherText),
            distances: []
        };

        //Distances
        for(let i = 1; i < data.indices.length; i++){
            data.distances.push(data.indices[i] - data.indices[i - 1]);
        }

        return data;
    });

    console.log("Repetitions in ciphertext:");
    console.log(repetitions);

    //Update repetitions table
    var repetitionsTable = $("#vigenere_repetitions tbody");

    for(let i in repetitions){
        let repetition = repetitions[i];
        let tr = "<tr>";

        tr += "<td>" + repetition.phrase + "</td>";
        tr += "<td>" + repetition.indices.length + "</td>";
        tr += "<td>" + repetition.indices.join(", ") + "</td>";
        tr += "<td>" + repetition.distances.join(", ") + "</td>";

        tr += "</tr>";
        repetitionsTable.append(tr);
    }

    //Factors table
    var factorsTable = $("#vigenere_factors");
    var factorsTableTheadTr = factorsTable.find("thead tr");
    var factorsTableTbody = factorsTable.find("tbody");

    //Factors: Organize distances
    var distances = [];

    for(let i in repetitions){
        for(let d in repetitions[i].distances){
            let distance = repetitions[i].distances[d];

            if(!distances.includes(distance)){
                distances.push(distance);
            }
        }
    }

    distances.sort(function(a, b){
        return b - a;
    });

    for(let i in distances){
        let distance = distances[i];
        let tr = "<tr>";

        tr += "<td>" + distance + "</td>";

        //Check factors
        for(let factor = 2; factor <= 20; factor++){
            tr += "<td>";
            if(distance % factor == 0){
                tr += "X";
            } else {
                // tr += " ";
            }
            tr += "</td>";
        }

        tr += "</tr>";
        factorsTableTbody.append(tr);
    }

    //Factors: total row
    var trTotal = "<tr><th>Total</th>";
    var totalFactors = [];
    var highestFactor = 0;
    var highestFactorTotal = 0;

    for(let factor = 2; factor <= 20; factor++){
        let total = 0;

        for(let i in distances){
            if(distances[i] % factor == 0){
                total++;
            }
        }

        if(total > highestFactorTotal){
            highestFactor = factor;
            highestFactorTotal = total;
        }

        totalFactors.push(total);
    }

    totalFactors.sort(function(a, b){
        return b - a;
    });

    console.log(totalFactors);

    var totalFactorThreshold = totalFactors[Math.min(totalFactors.length, 2)]; //The top three get highlighted

    for(let factor = 2; factor <= 20; factor++){
        let total = 0;

        for(let i in distances){
            if(distances[i] % factor == 0){
                total++;
            }
        }

        trTotal += "<td>";

        if(total >= totalFactorThreshold){
            trTotal += "<span class='highlight'>" + total + "</span>";
        } else {
            trTotal += total;
        }

        trTotal += "</td>";
    }

    trTotal += "</tr>";
    factorsTableTbody.append(trTotal);

    //Display bar chart
    $("#vigenere_keylength").val(highestFactor).trigger("change");
});

$("#vigenere_keylength").on("change", function(){
    let keyLength = parseInt($("#vigenere_keylength").val());

    if(!keyLength || keyLength <= 0){
        alert("Please enter a valid length!");
        return;
    }

    //Empty all previous values
    while(vigenereFrequencyChart.data.datasets.length > 1){
        vigenereFrequencyChart.data.datasets.pop(1);
    }

    //Clear sliders
    $("#vigenere_sliders").empty();

    for(let keyIndex = 0; keyIndex < keyLength; keyIndex++){
        let data = {
            label: "L" + (keyIndex + 1) + " Frequency",
            backgroundColor: "rgba(" + RAINBOW_BORDERS[keyIndex % RAINBOW_BORDERS.length] + ", 0.2)",
            borderColor: "rgba(" + RAINBOW_BORDERS[keyIndex % RAINBOW_BORDERS.length] + ", 1)",
            borderWidth: 1,
            hidden: keyIndex != 0 //Only show the first letter for clarity
        };

        let slider = buildVigenereSlider(keyIndex);
        let shift = 0;
        updateLetterData();

        slider.on("change", function(){
            shift = slider.val();
            updateLetterData();

            for(let i in vigenereFrequencyChart.data.datasets){
                if(i > 0){
                    vigenereFrequencyChart.data.datasets[i].hidden = (i - 1 != keyIndex);
                }
            }

            vigenereFrequencyChart.update(0);
        });

        function updateLetterData(){
            //Calculate frequencies of each letter
            let frequencies = ALPHABET.split("").map(function(letter){
                return 0;
            }); //Array of length 26

            let total = 0;

            for(let i = keyIndex; i < cipherText.length; i = i + keyLength){
                let alphabetIndex = (ALPHABET.indexOf(cipherText[i].toLowerCase()) - shift + ALPHABET.length) % ALPHABET.length;
                frequencies[alphabetIndex]++;
                total++;
            }

            //Get percent frequency as opposed to number of occurrences
            frequencies = frequencies.map(function(frequency){
                return frequency / total * 100;
            });

            data.data = frequencies;
        }

        vigenereFrequencyChart.data.datasets.push(data);
    }

    vigenereFrequencyChart.update();
});

//Slider updates
$("#vigenere_sliders").on("change", "input", function(){
    //Update the key
    let key = "";

    $("#vigenere_sliders input").each(function(){
        key += ALPHABET[$(this).val()].toUpperCase();
    });

    $("#vigenere_key").text(key);

    //Update the plaintext
    let plaintext = "";
    let keyIndex = 0;

    for(let i = 0; i < cipherText.length; i++){
        let cipherTextLetter = cipherText[i].toLowerCase();

        if(cipherTextLetter == " "){ //TODO - Punctuation too? Anything not a letter?
            plaintext += cipherTextLetter;
        } else {
            let keyLetter = key[keyIndex++ % key.length].toLowerCase();
            let keyShift = ALPHABET.indexOf(keyLetter);

            plaintext += ALPHABET[(ALPHABET.indexOf(cipherTextLetter) - keyShift + 26) % ALPHABET.length];
        }
    }

    $("#vigenere_plaintext").text(plaintext);
});

function buildVigenereSlider(letterIndex){
    let elem = $('<div class="col s12 m6">' + '<p class="range-field" style="margin-top: 0; margin-bottom: 0;">\
        <label for="vigenere_shift' + letterIndex + '">Letter ' + (letterIndex + 1) + ' Shift</label>\
        <input type="range" min="0" max="25" value="0" id="vigenere_shift' + letterIndex + '">\
    </p>' + '</div>');

    $("#vigenere_sliders").append(elem);

    return elem.find("input");
}


















//================================================
//  LINEAR CONGRUENCES
var linCongA = $("#linear_congruence_a");
var linCongB = $("#linear_congruence_b");
var linCongMod = $("#linear_congruence_modulus");

function linCongUpdateCalculation(){
    let a = getIntegerInput(linCongA);
    let b = getIntegerInput(linCongB);
    let mod = getIntegerInput(linCongMod);

    if(!a || !b || !mod){
        // $("#linear_congruence_calculation").text("Invalid input");
    } else {
        $("#linear_congruence_calculation").html(a + "x = " + b + " <em>(mod " + mod + ")</em>");
    }
}

linCongUpdateCalculation();
linCongA.on("input", linCongUpdateCalculation);
linCongB.on("input", linCongUpdateCalculation);
linCongMod.on("input", linCongUpdateCalculation);

$("#linear_congruence_update").click(function(){
    let a = getIntegerInput(linCongA);
    let b = getIntegerInput(linCongB);
    let mod = getIntegerInput(linCongMod);

    //Calculuate the GCD
    var data = gcd(a, -mod);

    console.log(data);

    $("#linear_congruence_data").show();
    $("#linear_congruence_info").empty().append("<div>"
        + "Finding solutions to: " + a + "x = " + b + " (mod " + mod + ")" + "<br>"
        + a + "x - " + b + " = " + mod + "y" + "<br>"
        + a + "x - " + mod + "y = " + b + "<br>"
        + "</div>");

    if(b % data.gcd != 0){
        alert("There are no solutions since the GCD does not divide into B (" + b + ")!")
        return;
    }

    //Scale the solution up
    data.xSolution *= b / data.gcd;
    data.ySolution *= b / data.gcd;

    $("#linear_congruence_info").append("<div>"
        + "The GCD of (a, -mod) = (" + a + ", " + -mod + ") = " + data.gcd + "<br><br>"
        + "Initial solution: " + "<span class='bold'>" + a + "(" + data.xSolution + ") - " + mod + "(" + data.ySolution + ") = " + b + "</span>" + "<br><br>"
        + "</div>");

    var modSolution = data.xSolution;

    // while(modSolution < 0) modSolution += mod;
    // while(modSolution > mod) modSolution -= mod;

    var ttable = $("#linear_congruence_t_table tbody");
    ttable.empty();

    if(data.gcd == 1){
        //Hide the table
        $("#linear_congruence_t_table").hide();

        //Only one solution
        $("#linear_congruence_info").append("<div style='font-size: 18px;'>The modular inverse of <strong>" + a + " (mod " + mod + ") = " + data.xSolution + " = " + "<span class='highlight'>" + modSolution + "</span>" + "</strong></div>")
    } else {
        $("#linear_congruence_info").append("<div style='font-size: 18px;'>\
        x = x<sub>0</sub> + (|b| / d)t\
         <br> = " + data.xSolution + " + (" + Math.abs(mod) + " / " + data.gcd + ")t\
         <br> = " + data.xSolution + " + " + (Math.abs(mod) / data.gcd) + "t\
        <br>\
        y = y<sub>0</sub> + (|a| / d)t\
         <br>    = " + data.ySolution + " - (" + Math.abs(a) + " / " + data.gcd + ")t\
         <br>    = " + data.ySolution + " - " + (Math.abs(a) / data.gcd) + "t\
         </div>");

        for(let t = 0; t < data.gcd; t++){
            let tr = "<tr>";
            tr += "<th>" + t + "</th>";

            //X
            tr += "<td>";
            let solution = data.xSolution + (Math.abs(mod) / data.gcd) * t
            tr += data.xSolution + " + " + (Math.abs(mod) / data.gcd) + "(" + t + ")";
            tr += "<br> = <span class=''>" + solution + "</span>";
            tr += "</td>";

            //Y
            // tr += "<td>";
            // tr += data.ySolution + " - " + (Math.abs(a) / data.gcd) + "(" + t + ")";
            // tr += "<br> = " + (data.ySolution - (Math.abs(a) / data.gcd) * t);
            // tr += "</td>";

            //Solution
            tr += "<td>";
            tr += "= " + solution + " <em>(mod " + mod + ")</em><br>"

            //Wrap within bounds of [0, mod)
            while(solution < 0) solution += mod;
            while(solution > mod) solution -= mod;

            tr += "= <span class='highlight bold'>" + solution + "</span>";

            // tr += a + "*(" + (data.xSolution + (Math.abs(mod) / data.gcd) * t) + ") - " + mod + "*(" + -(data.ySolution - (Math.abs(a) / data.gcd) * t) + ") = " + data.gcd;
            tr += "</td>";

            tr += "</tr>";
            ttable.append(tr);
        }
    }
});

/**
 * Converts a number to a certain base
 */
function numToBase(num, base){
    let data = {
        num: num,
        base: base,
        steps: [],
        result: []
    };

    while(num > 0){
        let coefficient = Math.floor(num / base);
        let remainder = num - (base * Math.floor(num / base));

        data.steps.push({
            num: num,
            coefficient: coefficient,
            remainder: remainder
        });

        data.result.unshift(remainder); //Add remainder to beginning of array (larger power) (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)

        //"Shift" it
        num = coefficient;
    }

    return data;
}

$("#num_to_base_update").click(function(){
    let num = getIntegerInput($("#num_to_base_num"));
    let base = getIntegerInput($("#num_to_base_base"));
    if(!num || !base) return;
    let data = numToBase(num, base);
    let div = $("#num_to_base_data");
    div.empty();
    div.show();
    // let table = $("#num_to_base_table");
    // table.empty();

    div.append("<h5>" + num + " (Base-10) = " + "<span class='highlight'>" + data.result.join("") + "</span>" + " (Base-" + base + ")" + "</h5>");

    for(let i = 0; i < data.steps.length; i++){
        let step = data.steps[i];

        div.append("<p>" + step.num + " = " + base + "*" + step.coefficient + " + " + "<span class='highlight'>" + step.remainder + "</span>" + "</p>");
    }
});

//TODO - Use a math library for pretty printing?
var modExpNum = $("#modular_exponentiation_num");
var modExpExp = $("#modular_exponentiation_exponent");
var modExpMod = $("#modular_exponentiation_modulus");

function modularExponentiationUpdateCalculation(){
    let num = getIntegerInput(modExpNum);
    let exp = getIntegerInput(modExpExp);
    let mod = getIntegerInput(modExpMod);

    if(!num || !exp || !mod){
        // $("#modular_exponentiation_calculation").text("Invalid input");
    } else {
        $("#modular_exponentiation_calculation").html(num + " ^ " + exp + " = ? <em>(mod " + mod + ")</em>");
    }
}

modularExponentiationUpdateCalculation();
modExpNum.on("input", modularExponentiationUpdateCalculation);
modExpExp.on("input", modularExponentiationUpdateCalculation);
modExpMod.on("input", modularExponentiationUpdateCalculation);

$("#modular_exponentiation_update").click(function(){
    let num = getIntegerInput(modExpNum);
    let exp = getIntegerInput(modExpExp);
    let mod = getIntegerInput(modExpMod);

    if(!num || !exp || !mod){
        alert("Please enter valid numbers.");
        return;
    }

    var dataDiv = $("#modular_exponentiation_data");
    dataDiv.empty().show();

    dataDiv.append("<h5>Step 1: Convert to binary (see above)</h5>");
    let binary = numToBase(exp, 2);
    let elem = "<p>" + exp + " = " + binary.result.join("") + " base-2 = ";

    for(let i = 0; i < binary.result.length; i++){
        if(binary.result[i] == 1){
            elem += Math.pow(2, binary.result.length - 1 - i);

            if(i != binary.result.length - 1){
                elem += " + ";
            }
        }
    }

    dataDiv.append(elem + "</p>");

    dataDiv.append("<h5>Step 2: Find least residue of powers of " + num + " <em>(mod " + mod + ")</em></h5>");

    elem = "<table class='bordered striped'>\
    <thead>\
    <th>k</th>\
    <th>" + num + "<sup>k</sup> <em>(mod " + mod + ")</em></th>\
    </thead>\
    <tbody>";

    let leastResidues = [];

    for(let k = 0; k < binary.result.length; k++){
        let leastResidue = (leastResidues.length == 0 ? num : Math.pow(leastResidues[leastResidues.length - 1], 2)) % mod;
        leastResidues.push(leastResidue);

        elem += "<tr>";

        elem += "<td>" + "2<sup>" + k + "</sup> = <span class='highlight bold'>" + Math.pow(2, k) + "</span></td>";
        elem += "<td><strong>" + num + "<sup>" + Math.pow(2, k) + "</sup></strong> <em>(mod " + mod + ")</em> = ";

        let lastResidue = (k == 0 ? leastResidue : leastResidues[leastResidues.length - 1]);

        if(k == 0){
            elem += "<span class='highlight bold'>" + leastResidue + "</span>";
        } else {
            let lastResidue = leastResidues[leastResidues.length - 2]; //-2 since we already added it

            elem += "<strong>" + lastResidue + "<sup>2</sup></strong> <em>(mod " + mod + ")</em> = " + Math.pow(lastResidue, 2) + " = <span class='highlight bold'>" + leastResidue + "</span>";
        }

        elem += "</td>";
        elem += "</tr>";
    }

    console.log(leastResidues);
    console.log(elem);

    dataDiv.append(elem + "</tbody></table>");

    dataDiv.append("<h5>Step 3: Calculate least residue</h5>");

    let total = 1;
    elem = "<p>" + num + "<sup>" + exp + "</sup> <em>(mod " + mod + ") = ";

    for(let i = 0; i < binary.result.length; i++){
        if(binary.result[i] == 1){
            elem += num + "<sup>" + Math.pow(2, binary.result.length - 1 - i) + "</sup>";

            if(i != binary.result.length - 1){
                elem += " * ";
            }
        }
    }

    dataDiv.append(elem + " <em>(mod " + mod + ")</p>");
    elem = "<p> = ";

    for(let i = 0; i < binary.result.length; i++){
        let k = binary.result.length - i - 1; //The actual power of 2
        if(binary.result[i] == 1){
            console.log("2^" + k + " = " + Math.pow(2, k), leastResidues[k]);
            total *= leastResidues[k];
            elem += leastResidues[k];

            if(i != binary.result.length - 1){
                elem += " * ";
            }
        }
    }

    dataDiv.append(elem + " <em>(mod " + mod + ")</em> = " + total + " <em>(mod " + mod + ")</em> = <span class='highlight bold'>" + (total % mod) + "</span></p>");
});

function modularExponentiation(number, power, modulo){
    //Step 1 - Convert to binary
    let binary = numToBase(power, 2);

    console.log(number + " in binary: " + binary.result.join(""));

    //Step 2 - Table: k | a^k (mod n)
    let leastResidues = [];

    for(let k = 0; k < binary.result.length; k++){
        let leastResidue = (leastResidues.length == 0 ? number : Math.pow(leastResidues[leastResidues.length - 1], 2)) % modulo;
        console.log("2^" + k + " = " + Math.pow(2, k),
        k == 0 ? leastResidue : leastResidues[leastResidues.length - 1] + "^2 = " + Math.pow(leastResidues[leastResidues.length - 1], 2) + " = " + leastResidue + " (mod " + modulo + ")");
        leastResidues.push(leastResidue);
    }

    console.log(leastResidues);

    let total = 1;

    for(let i = 0; i < binary.result.length; i++){
        let k = binary.result.length - i - 1; //The actual power of 2
        if(binary.result[i] == 1){
            console.log("2^" + k + " = " + Math.pow(2, k), leastResidues[k]);
            total *= leastResidues[k];
        }
    }

    console.log(number + "^" + power + " = " + (total % modulo) + " (mod " + modulo + ")");
    return total % modulo;
}












const FIRST_PRIMES = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ];
// const FIRST_PRIMES = []

function getPrimes(size, primes){
    if(!primes) primes = FIRST_PRIMES.slice(0, size); //Clones array

    while(primes.length < size){
        let num = primes[primes.length - 1];

        for(let i = primes.length; i < size; i++){
            do {
                num += 2;
            } while(!isPrime(num, primes));

            primes.push(num);
        }
    }

    return primes;
}

function getPrimesStopAt(end){
    let primes = [ 2, 3 ];

    while(primes[primes.length - 1] < end){
        let prime = primes[primes.length - 1];

        do {
            prime += 2;
        } while(!isPrime(prime, primes));

        if(prime <= end) primes.push(prime);
        else break;
    }

    return primes;
}

$("#prime_list_update").click(function(){
    let resultText = $("#prime_list_result");
    let primes;

    if($("#prime_list_upto").val()){
        primes = getPrimesStopAt(parseInt($("#prime_list_upto").val()));
    } else {
        primes = getPrimes(Math.max(getIntegerInput($("#prime_list_size")), 0) || 100);
    }

    resultText.val(primes.join(($("#prime_list_joiner").val() || " ").replace(/\\n/g, "\n"))); //Replace all occurrences of \n
});

function isPrime(number, prevPrimes){
    let sqrt = Math.sqrt(number); //Only run once to increase efficiency

    for(let i in prevPrimes){
        let prime = prevPrimes[i];

        if(prime > sqrt || prime == 0){
            return true;
            break;
        }

        if(number % prime == 0){
            //Number is composite
            return false;
        }
    }

    //If not all primes were in the list, then assume it is composite
    return false;
}








function getPrimeFactorization(number, primes){
    let factorization = [];
    let i = 0;

    while(number > 1){
        let prime = primes[i++];
        let power = 0;

        while(number % prime == 0){
            number /= prime;
            power++;
        }

        if(power > 0){
            factorization.push({
                prime: prime,
                power: power
            });
        }

        if(i == primes.length){
            primes = getPrimes(primes.length + 1);
        }
    }

    return factorization;
}

$("#tau_phi_update").click(function(){
    let number = getIntegerInput($("#tau_phi_number"));
    let data = $("#tau_phi_data");
    data.show().empty();

    //Tau
    let primes = getPrimesStopAt(Math.sqrt(number));
    let factorization = getPrimeFactorization(number, primes);

    console.log(factorization);

    let primeExpansion = "";
    let tau = 1;
    let tauData = "&tau;(" + number + ") = ";
    let phi = 1;
    let phiData = "&phi;(" + number + ") = ";

    for(let i = 0; i < factorization.length; i++){
        let comp = factorization[i]; //Component

        if(primeExpansion) primeExpansion += " * ";
        primeExpansion += comp.prime + "<sup>" + comp.power + "</sup>";

        tau *= comp.power + 1;

        if(i != 0) tauData += " * ";
        tauData += "(" + comp.power + " + 1)";

        if(comp.power > 1){
            if(i != 0) phiData += " * ";
            phiData += comp.prime + "<sup>" + (comp.power - 1) + "</sup>";
            phi *= Math.pow(comp.prime, comp.power - 1);
        }

        if(i != 0) phiData += " * ";
        phiData += "&Phi;(" + comp.prime + ")";
        phi *= comp.prime - 1;
    }

    data.append("<h5>" + number + " = " + primeExpansion + "</h5>");
    data.append("<h5>&tau;(" + number + ") = " + "<span class='highlight bold'>" + tau + "</span>" + "</h5>");
    data.append("<div style='margin-left: 1em;'><p>" + tauData + "<br>" + "= " + tau + "</p></div>");
    data.append("<h5>&Phi;(" + number + ") = " + "<span class='highlight bold'>" + phi + "</span>" + "</h5>");
    data.append("<div style='margin-left: 1em;'><p>" + phiData + "<br>" + "= " + phi + "</p></div>");

    console.log(number + " = " + primeExpansion);
    console.log("Tau of " + number + " = " + tau);
    console.log(phiData);
    console.log("Phi of " + number + " = " + phi);
});
