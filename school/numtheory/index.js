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
    $("#gcd_table tbody").empty();
    $("#gcd_data").show();
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
    var points = [
        [ getIntegerInput($("#triangle_area_x1")), getIntegerInput($("#triangle_area_y1")) ],
        [ getIntegerInput($("#triangle_area_x2")), getIntegerInput($("#triangle_area_y2")) ],
        [  getIntegerInput($("#triangle_area_x3")), getIntegerInput($("#triangle_area_y3"))]
    ];

    var minX = Math.min(points[0][0], Math.min(points[1][0], points[2][0]));
    var maxX = Math.max(points[0][0], Math.max(points[1][0], points[2][0]));
    var minY = Math.min(points[0][1], Math.min(points[1][1], points[2][1]));
    var maxY = Math.max(points[0][1], Math.max(points[1][1], points[2][1]));

    var plotData = [
        //The original triangle
        {
            fnType: "points",
            graphType: "polyline",
            // closed: true,
            color: "blue",
            points: [
                [points[0][0], points[0][1]],
                [points[1][0], points[1][1]],
                [points[2][0], points[2][1]],
                [points[0][0], points[0][1]] //Reconnect it to the beginning
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
            $("#triangle_area_value").text("The area of the triangle is " + (Math.abs((a * d) - (b * c)) / 2));

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
    "255, 140, 0",
    "255, 206, 86",
    "75, 192, 192",
    "54, 162, 235",
    "153, 102, 255",
    "255, 159, 64",
];

var vigenereFrequencyChart = new Chart($("#vigenere_alphabetfrequency"), {
    type: "bar",
    data: {
        labels: ALPHABET.toUpperCase().split(""),
        datasets: []
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
    $("#vigenere_sliders").empty();
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

    for(let factor = 2; factor <= 20; factor++){
        let total = 0;

        for(let i in distances){
            if(distances[i] % factor == 0){
                total++;
            }
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
    //TODO
    var datasets = [
        {
            label: "English Letter Frequency",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderColor: "rgba(0, 0, 0, 1)",
            borderWidth: 1,
            data: ALPHABET.toLowerCase().split("").map(function(letter){
                return LETTER_FREQUENCY[letter];
            })
        }
    ];

    //TODO - Let the user input the length of the factor and this should be in another method
    var keyLength = 5;
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
                    console.log(keyIndex);
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

            for(let i = keyIndex; i < cipherText.length; i += keyLength){
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

        datasets.push(data);
    }

    vigenereFrequencyChart.data.datasets = datasets;
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
    let elem = $('<p class="range-field">\
        <label for="vigenere_shift' + letterIndex + '">L' + (letterIndex + 1) + ' Shift</label>\
        <input type="range" min="0" max="25" value="0" id="vigenere_shift' + letterIndex + '">\
    </p>');

    $("#vigenere_sliders").append(elem);

    return elem.find("input");
}
