// JS file starts here 

// Create app namespace to hold all methods
const app = {};

// Collect user input
app.collectInfo = function() {
    $('input').on("click", function(e) {
        e.preventDefault();
        const inputVal = $('#search').val();
        const parsedInput = inputVal.replace(/\s/g, '_');
        console.log(parsedInput);

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
        console.log(data);
    });
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