const SCHOOLS = [
    {
        name: "Yale University",
        url: "https://admissions.yale.edu/application-deadlines",
        date: "2018-03-28"
    },
    {
        name: "Stanford University",
        date: "2018-04-01"
    },
    {
        name: "Princeton University",
        url: "https://admission.princeton.edu/how-apply/application-dates-deadlines/regular-decision",
        dateText: "Late March/Early April"
    },
    {
        name: "UC Berkeley",
        url: "http://admissions.berkeley.edu/datesdeadlines",
        date: "2018-03-29"
    },
    {
        name: "Carnegie Mellon University",
        url: "https://admission.enrollment.cmu.edu/pages/application-plans-deadlines",
        date: "2018-04-15",
        dateText: "(at the latest)"
    },
    {
        name: "UC San Diego",
        url: "http://www.ucsd.edu/catalog/front/UgrdPol.html"
    }
];

var mySchools = SCHOOLS.map(school => school.name);

//Make the date for each school a moment object
SCHOOLS.forEach(school => {
    if(school.date){
        school.date = moment(school.date, "YYYY-MM-DD");
    }
});

$(function(){
    var mySchoolsDiv = $("#my-schools");
    var mySchoolsNone = $("#my-schools-none");
    var container = mySchoolsDiv.find(".schools-container");

    if(mySchools.length == 0){
        mySchoolsNone.show();
    } else {
        mySchoolsNone.hide();
    }

    container.empty();

    for(let i = 0; i < SCHOOLS.length; i++){
        let school = SCHOOLS[i];

        if(mySchools.includes(school.name)){
            container.append(createSchoolDiv(school));
            mySchoolsDiv.find(".schools-container-boxed").append(createSchoolDivBox(school));
        }
    }

    setInterval(function(){
        var now = moment();

        for(let i = 0; i < SCHOOLS.length; i++){
            let school = SCHOOLS[i];

            if(!school.date) continue;

            let entry = $("[data-school='" + school.name + "']");

            if(entry.length > 0){
                let timeUntil = getTimeUntil(moment.duration(school.date.diff(now)));

                entry.find(".countdown").html(timeUntil);
            }
        }
    }, 1000);
});

function getTimeUntil(duration){
    let str = "";

    str += getTimeUntilPart(duration.months(), "month");
    str += getTimeUntilPart(duration.days(), "day");
    str += getTimeUntilPart(duration.hours(), "hour");
    str += getTimeUntilPart(duration.minutes(), "minute");
    str += getTimeUntilPart(duration.seconds(), "second");

    return str.trim();
}

function getTimeUntilPart(num, str, space = true){
    if(num > 0){
        return num + " " + "<small>" + str + (num == 1 ? "" : "s") + "</small>" + (space ? " " : "");
    } else {
        return "";
    }
}

function createSchoolDiv(school){
    let schoolName = school.name;
    let schoolDate = (school.date ? school.date.format("MMMM D, YYYY") : "N/A");

    if(school.url){
        schoolName = '<a href="' + school.url + '">' + schoolName + "</a>";
    }

    if(school.dateText){
        schoolDate += "<br>";
        schoolDate += "<small>";
        schoolDate += school.dateText;
        schoolDate += "</small>";
    }

    return $('<div class="school-entry" data-school="' + school.name + '">\
        <div class="entry-title">\
            ' + schoolName + '\
        </div>\
        <div class="date">\
            ' + schoolDate + '\
        </div>\
        <div class="countdown"></div>\
    </div>');
}

function createSchoolDivBox(school){
    let schoolDate = (school.date ? school.date.format("MMMM D, YYYY") : "");

    if(school.dateText){
        if(school.dateText.startsWith("(")){
            if(school.date){
                schoolDate += " <small>" + school.dateText + "</small>";
            } else {
                schoolDate = "<em>" + school.dateText + "</em>";
            }
        } else {
            if(school.date){
                schoolDate += " <small>" + school.dateText + "</small>";
            } else {
                schoolDate = school.dateText;
            }
        }
    } else {
        if(!school.date){
            schoolDate += "N/A";
        }
    }

    return $('<div class="school-box" data-school="' + school.name + '">\
        <div class="title">\
            ' + school.name + '\
            ' + (school.url ? '<a class="button" href="' + school.url + '" title="' + school.name + ' Admissions Page">' + '<i class="fas fa-fw fa-link"></i>' + "</a>" : "") + '\
        </div>\
        <div class="box-body">\
            <div class="date">Date: <strong>' + schoolDate + '</strong></div>\
            <div class="countdown"></div>\
        </div>\
        <div class="box-buttons">\
            <a class="button" data-action="remove" title="Remove from my schools."><i class="fas fa-fw fa-star"></i></a>\
        </div>\
    </div>');
}
