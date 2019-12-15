// App namespace to hold all methods
const app = {};
app.baseUrl = "http://myttc.ca";
app.weatherKey = "e990312509fe5adafa3aa72078a8db3c"

// Smooth scroll to get to the results page
const resultsScroll = $(window).scrollTop();
$('.submit').click(function () {
    $('html, body').animate({ scrollTop: resultsScroll + 1500 })
});

//weather api call to add time to commute
app.getWeather = function() {
    let timeMultiplier = 1;
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather/`,
        method: "GET",
        dataType: "json",
        data: {
            q: `toronto,ca`,
            appid: app.weatherKey
        }
    }).then(function(data) {
        const weatherType = data.weather[0].main;
        if (weatherType.includes("rain")) {
            timeMultiplier = 1.5;
        } else if (weatherType.includes("snow")) {
            timeMultiplier = 2;
        }
    })
    return timeMultiplier;
}

// assigning weather api return to a variable
// this lets us use the return later without having to call the api every time.
app.weatherMultiplier = app.getWeather();

// To collect user input on starting point
app.collectInfo = function() {
    $('form.search').on("submit", function(e) {
        e.preventDefault();
        const inputVal = $('#search').val();
        // api call requires a string with underscores between words.
        const parsedInput = inputVal.replace(/\s/g, '_');
        // pass the input into our api call
        app.getInfo(parsedInput);
    });
}

// wow look it's an api call!
// use the stop search as our query parameters
app.getInfo = function (stationSearch) {
    $('select').html("");
    $.ajax({
        url: 'https://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `${app.baseUrl}/${stationSearch}.json`,
        }
    }).then(function(data) {
        // return data lists 'stops' that don't actually have routes
        // we don't want those stops. .filter() to the rescue!
        const actuallyARoute = data.stops.filter(function(value) {
            return value.routes.length > 0;
        });

        // use the filtered array to populate stop
        app.displayStops(actuallyARoute);

        // start our event listener to pull departure times!
        app.getTimes(actuallyARoute);
    }).fail(function(error) {
        //display an overlay with an error message
        $('.errorMessage').removeClass(`hidden`);
        // event listener to close the message
        $('.errorMessage button').on("click", function(){
            $(this).parent().addClass(`hidden`);
        })
    });
}

// pull stop info and start event listener for changed selection.
app.displayStops = function(stops) {
    stops.forEach(function(stop) {
        const htmlToAppend = `<option>${stop.name}</option>`;
        $('#stop').append(htmlToAppend);
    });
    let stopName = $('#stop').val();
    app.getRoutes(stops[0]);

    $('#stop').on("change", function() {
        stopName = $(`#stop`).val();
        const thisStop = stops.filter(function(value) {
            return value.name === stopName;            
        })
        // console.log(thisStop[0])
        app.getRoutes(thisStop[0]);
    })
}

// pulls route name from stops data object and appends to drop down menu
app.getRoutes = function(stop) {
    $('#route').html("");
    stop.routes.forEach(function(route) {
        const htmlToAppend = `<option>${route.name}</option>`;
        $('#route').append(htmlToAppend);
    })
}

// pulls departure time from stops data object and passes to display function
app.getTimes = function(stops) {
    $('form.finalSubmit').on("submit", function(e){
        e.preventDefault();
        const time = parseInt($('#time').val(), 10) * app.weatherMultiplier;
        const selectedStop = stops.filter(function(value) {
            return value.name === $('#stop').val();
        })
        const routeTaken = selectedStop[0].routes.filter(function(value) {
            return value.name === $('#route').val();
        })
        app.displayInfo(routeTaken[0].stop_times, time);
    })
}

// Display data on the page
app.displayInfo = function(times, commuteTime) {
    $('main .wrapper').removeClass("hidden");
    $('.results').html("").append(`<div class="departures"><p>The next departure time is:</p><ul></ul></div>`);
    // we only want the next 3 departure times, not everything
    // hence: for loop, rather than forEach.
    for(let i = 0; i <= 2; i++) {
        $('ul').append(`<li>${times[i].departure_time}</li>`);
    }
    //convert our estimated commute into seconds for some mathy fun
    const commuteInSeconds = commuteTime * 60;
    // set up a container for our arrival times times!
    $('.results').append(`<div class="arrivals"><p>You will arrive at:</p><ul></ul></div>`)
    for(let i = 0; i <= 2; i++) {
        // working with unix time zones!
        // -18000 to convert to local time
        const unixTime = (commuteInSeconds + times[i].departure_timestamp - 18000)*1000;
        // setting a Date object to work with unix timecodes
        const arrivalTime = new Date(unixTime);
        let hours = (arrivalTime.getUTCHours()) % 12;
        const minutes = arrivalTime.getUTCMinutes();
        let rainSnow = ""; //initializing as empty string for regular weather.

        // fun result of our 12-hour time format returns 0 for 12.
        // so we manually recode it nbd
        if(hours === 0) {
            hours = 12
        }
        
        // SIMILARLY, if minutes is less than 10, it only returns single digit
        // so we manually code it in too. Cool.
        if (minutes < 10) {
            $('.arrivals ul').append(`<li>${hours}:0${minutes}</li>`)
        } else {
            $('.arrivals ul').append(`<li>${hours}:${minutes}</li>`)
        }

        //and throwing on an a or p to match the format from the api return.
        if (arrivalTime.getUTCHours() >= 12) {
            $('.arrivals ul li:last-of-type').append('p')
        } else {
            $('.arrivals ul li:last-of-type').append('a')
        }
    }

    // uses the return from weather API to assign the weather type.
    if (app.weatherMultiplier === 1.5) {
        rainSnow = "rain"
    } else if (app.weatherMultiplier === 2) {
        rainSnow = "snow"
    }

    //and let the nice people know that yes, they will be late.
    if (app.weatherMultiplier > 1) {
    $(`.results`).append(`<div class="delays"><p>It looks like it's ${rainSnow}ing out, so we've added time to your commute because the TTC can be trash in the ${rainSnow}</p></div>`);
    };
}

// Start app
app.init = function() {
    app.collectInfo();
}

$(function() {
    app.init();
});