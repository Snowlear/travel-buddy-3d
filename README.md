# Travel Buddy 3D

Travel Buddy is an app that allows users to perform searches to know the distance of a route that may consist of 2 or more cities, to enable them to plan their travel.
It shows results in 3D graphics.

## Live App

This application instance is not deployed on Heroku. Please run it on your environment.

## Getting Started

- npm install to install the dependencies.
- npm start to start project in development mode.
- npm build to have a build.

### Test

Project contains unit tests.

In order to run them;

- npm test

## Features

- Search form with fields for city of origin, intermediate cities, city of destination, date of trip, and number of passengers
- Searchable dropdowns for cities with asynchronous loading and search
- Ability to add/remove multiple intermediate cities as destinations
- Form validation with error messages and disabled submit button
- Deep-linking for pre-filled form data from URL parameters
- Search results page displaying filled fields and calculated distances between subsequent cities and total distance
- Asynchronous distance calculation with loading indication and error handling

### Test Paths;

#### Main Page
http://localhost:3000/?passengerCount=1&tripDate=20-06-2023&tripDestinations=[%22Montpellier%22,%22Paris%22,%22Aix-en-Provence%22]


#### Results Page
http://localhost:3000/results?passengerCount=1&tripDate=20-06-2023&tripDestinations=[%22Montpellier%22,%22Paris%22,%22Aix-en-Provence%22]

## Technical Details

The app is implemented as a SPA (single page application) using React and TypeScript. 3D views are developed via threejs.

The code above is a fake backend that simulates the delay of requesting cities and calculating distances. The list of cities is hardcoded and the delay is simulated. The fake backend has several functions: searchCities receives a keyword and returns a list of matching cities, isValidCity checks if the input city name is valid, calculateDistances receives a list of cities and calculates the distances between them, and getCities receives a list of city names and returns the corresponding city objects. The delay is simulated using a constant DELAY value in milliseconds.

When a user attempts to find cities using the phrase "fail", the mocked API will fail to return results to demonstrate error handling abilities. When "Dijon" city is involved in the distance calculation, it will fail to demonstrate error handling abilities.