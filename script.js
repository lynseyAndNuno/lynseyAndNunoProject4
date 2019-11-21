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
app.baseUrl = "http://myttc.ca";

// $.ajax({
//     url: 'http://proxy.hackeryou.com',
//     dataType: 'json',
//     method: 'GET',
//     data: {
//         reqUrl: 'http://myttc.ca/',
//         params: {
//             p: `${stationSeach}`,
//         },
//         // proxyHeaders: {
//         //     'Some-Header': 'goes here'
//         // },
//         xmlToJSON: false,
//         useCache: false
//     }
// }).then(function(data) {
// 	console.log(data);
// });

app.getInfo = function(stationSearch) {
    $.ajax({
        url: `${app.baseUrl}/${stationSearch}`,
        method: 'GET',
        dataType: 'json'
    }).then(function(data) {
        console.log(data);
    });
};


// Display data on the page
app.displayInfo = function () {

}

// Start app
app.init = function () {
app.collectInfo();
}

$(function () {
    app.init();
});