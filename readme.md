EM. VEE. PEA.

// Pseudo Code 

The app will be called "Am I gonna be late?"

Our idea is to use the TTC API to get the information about the TCC, subway, bus and street car and predict the arrival time the user will get to it's destinations.

The way we envision the app to work is by the user being prompt to select a TCC station they will departure from and this will be done from a drop down menu. Based on that input we will make the API call to get the information about departurs from that station. Once we have that info, the user will be able to select from a second drop down menu the route from that station they will be taking. 

The third interaction will happen when the user will enter the usual commute time in minutes they take the cummuter to arrive to their destination. 

Once we have the inputs from the user we will pull the data from the API call to display on the page the next 3 departures of user's route from the first API return. Once we display that we will calculate arrival time from user's input based on the next departure time for the selected route and the usual commute time.


// Stretch Goals!

1. Pull current weather from weather API
2. Check if raining or snowing
3. If raining, add 50% to commute time
4. If snowing, add 100% to commute time.
5. Display new times for user with funny message about how garbage the TTC is.