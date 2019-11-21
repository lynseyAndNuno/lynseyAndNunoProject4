// JS file starts here 

// App namespace to hold all methods
const app = {};

// To collect user input
app.collectInfo = function() {
    $('form.search').on("submit", function(e) {
        e.preventDefault();
        const inputVal = $('#search').val();
        const parsedInput = inputVal.replace(/\s/g, '_');

        app.getInfo(parsedInput);
    });
}

// Make AJAX request with user inputted data
app.baseUrl = "https://myttc.ca";

app.getInfo = function (stationSearch) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: `${app.baseUrl}/${stationSearch}.json`,
        }
    }).then(function(data) {
        data.stops.forEach(function(stop) {
            if (stop.routes.length !== 0) {
                app.getRoutes(stop.routes);
            }
        });
        app.getTimes(data.stops);
    });
}

app.getRoutes = function(routes) {
    routes.forEach(function(route) {
        const htmlToAppend = `<option>${route.name}</option>`;
        $('select').append(htmlToAppend);
    })
}

app.getTimes = function(stops) {
    $('form.finalSubmit').on("submit", function(e){
        e.preventDefault();
        const time = parseInt($('#time').val(), 10);
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

// Display data on the page
app.displayInfo = function(times, arrival) {
    const commuteInSeconds = arrival * 60;

    $('.results').append(`<p>The next departure time is:</p><ul></ul>`);
    for(let i = 0; i <= 2; i++) {
        $('ul').append(`<li>${times[i].departure_time}</li>`);
    }

    $('.results').append(`<p>You will arrive at:</p><ul></ul>`)
    for(let i = 0; i <= 2; i++) {
        const arrivalTime = new Date((commuteInSeconds + times[i].departure_timestamp)*1000)
        const hours = arrivalTime.getUTCHours();
        const minutes = arrivalTime.getUTCMinutes();

        $('ul:nth-of-type(2)').append(`<li>${hours}:${minutes}</li>`)
    }   
}

// Start app
app.init = function() {
    app.collectInfo();
}

$(function() {
    app.init();
});