// JS file starts here 

// Create app namespace to hold all methods
const app = {};

// Collect user input
app.collectInfo = function() {
    $('form').on("submit", function(e) {
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
                console.log(stop.routes);
                app.getRoutes(stop.routes);
            }
        });
    });
}
// make a function that takes the data.stops as a parameter
// for each route on the stops, pull the route.name to display
// use route.name to build html element to append to selection

app.getRoutes = function(routes) {
    routes.forEach(function(route) {
        const htmlToAppend = `<option>${route.name}</option>`;
        $('select').append(htmlToAppend);
    })
}



// Display data on the page
app.displayInfo = function() {

}

// Start app
app.init = function() {
app.collectInfo();
}

$(function() {
    app.init();
});