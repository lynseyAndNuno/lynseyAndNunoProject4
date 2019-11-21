// JS file starts here 

// Create app namespace to hold all methods
const app = {};

// Collect user input
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

//route name has to be the index of routes
app.getTimes = function(stops) {
    //take the routeName selection from drop-down
    //correlate with routeName.stop_times
    $('form.finalSubmit').on("submit", function(e){
        e.preventDefault();
        const time = parseInt($('#time').val(), 10);
        const routeTaken = $('#route').val();
        stops.forEach(function(stop) {
            if (stop.routes.length !== 0) {
                stop.routes.forEach(function(route){
                    if (route.name === routeTaken) {
                        const nextDepartures = route.stop_times;
                        app.displayInfo(nextDepartures);
                    }
                })
            }
        })
    })
}



// Display data on the page
app.displayInfo = function(comingDepartures) {

}

// Start app
app.init = function() {
app.collectInfo();
}

$(function() {
    app.init();
});