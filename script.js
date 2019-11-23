// JS file starts here 

// App namespace to hold all methods
const app = {};

// To collect user input
app.collectInfo = function() {
    $('form.search').on("submit", function(e) {
        e.preventDefault();
        const inputVal = $('#search').val();
        // api call requires a string with underscores between words.
        const parsedInput = inputVal.replace(/\s/g, '_');

        app.getInfo(parsedInput);
    });
}

// Make AJAX request with user inputted data
app.baseUrl = "https://myttc.ca";
app.weatherKey = "e990312509fe5adafa3aa72078a8db3c"

// wow look it's an api call!
app.getInfo = function (stationSearch) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `${app.baseUrl}/${stationSearch}.json`,
        }
    }).then(function(data) {
        // return data lists 'stops' that don't actually have routes
        // we don't want those stops.
        data.stops.forEach(function(stop) {
            if (stop.routes.length !== 0) {
                app.getRoutes(stop.routes);
            }
        });
        app.getTimes(data.stops);
    });
}

// pulls route name from stops data object and appends to drop down menu
app.getRoutes = function(routes) {
    routes.forEach(function(route) {
        const htmlToAppend = `<option>${route.name}</option>`;
        $('select').append(htmlToAppend);
    })
}

// Smooth scroll to get to the results page
const wisdomScroll = $(window).scrollTop();
$('.submit').click(function () {
    $('html, body').animate({ scrollTop: wisdomScroll + 1500 })
});

// pulls departure time from stops data object and passes to display function
app.getTimes = function(stops) {
    $('form.finalSubmit').on("submit", function(e){
        e.preventDefault();
        const time = parseInt($('#time').val(), 10) * app.getWeather();
        const routeTaken = $('#route').val();
        stops.forEach(function(stop) {
            if (stop.routes.length !== 0) {
                stop.routes.forEach(function(route){
                    if (route.name === routeTaken) {
                        const nextDepartures = route.stop_times;
                        app.displayInfo(nextDepartures, time);
                    }
                })
            }
        })
    })
}

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
        console.log(timeMultiplier)
    })
    return timeMultiplier;
}

// Display data on the page
app.displayInfo = function(times, arrival) {

    $('main .wrapper').append('<section class="results"></section>');

    const commuteInSeconds = arrival * 60;

    $('.results').append(`<div class="departures"><p>The next departure time is:</p><ul></ul></div>`);
    for(let i = 0; i <= 2; i++) {
        $('ul').append(`<li>${times[i].departure_time}</li>`);
    }

    $('.results').append(`<div class="arrivals"><p>You will arrive at:</p><ul></ul></div>`)
    for(let i = 0; i <= 2; i++) {
        const unixTime = (commuteInSeconds + times[i].departure_timestamp - 18000)*1000;
        const arrivalTime = new Date(unixTime);
        let hours = (arrivalTime.getUTCHours()) % 12;
        const minutes = arrivalTime.getUTCMinutes();
        let rainSnow = "";

        // fun result of our 12-hour time format returns 0 for 12.
        //manually recode it nbd
        if(hours === 0) {
            hours = 12
        }
        
        //if minutes is less than 10, it only returns single digit
        //so we manually code it in nbd.
        if (minutes < 10) {
            $('.arrivals ul').append(`<li>${hours}:0${minutes}</li>`)
        } else {
            $('.arrivals ul').append(`<li>${hours}:${minutes}</li>`)
        }

        if (arrivalTime.getUTCHours() >= 12) {
            $('.arrivals ul li:last-of-type').append('p')
        } else {
            $('.arrivals ul li:last-of-type').append('a')
        }
    }
    if (app.getWeather() === 1.5) {
        rainSnow = "rain"
    } else if (app.getWeather() === 2) {
        rainSnow = "snow"
    }

    if (app.getWeather() > 1) {
    $(`.results`).append(`<div class="delays"><p>It looks like it's ${rainSnow}ing out, so we've added time to your commute because the TTC can be trash in the ${rainSnow}</p></div>`)
    }
}

// Start app
app.init = function() {
    app.collectInfo();
}

$(function() {
    app.init();
});