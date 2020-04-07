'use strict';

// Server Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// Load Enviroumnet Variables from the .env file

require('dotenv').config();

// Initial Server Setup

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// Handle any Route

server.get('/', (request, response) => {
  response.status(200).send('Working');
});

// Route Definitions
server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
server.get('/trails', trailsHandler);

// Handling Location Route

function locationHandler(request, response) {
  const city = request.query.city;
  getLocation(city).then(cityLocation => response.status(200).json(cityLocation));
}

function getLocation(city) {
  const LOCATION_KEY = process.env.GEOCODE_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${LOCATION_KEY}&q=${city}&format=json`;
  return superagent.get(url).then(geoData => {
    const cityLocation = new LocationData(city, geoData.body);
    return cityLocation;
  });

}

var locationsArr =[];

// C.F to get location data as instances

function LocationData(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  locationsArr.push(this);
}

// Handling Weather Route

function weatherHandler(request, response) {
  const city = request.query.search_query;
  getWeather(city).then(weatherData => response.status(200).json(weatherData));
}

//*********Lab07-Feature#1: Data Formatting************/
// server.get('/weather', (request, response) => {
//   const weatherData = require('./data/weather.json');
//   const data = weatherData.data;
//   let weatherArr = data.map((element, index) => {
//     return new Weather(data, index);
//   });
//   //send response
//   response.send(weatherArr);
// });
//****************************************************/

let weatherArr =[];

function getWeather(city) {
  const WEATHER_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_KEY}`;
  return superagent.get(url)
    .then(weatherData => {
      weatherData.body.data.forEach(element => {
        var weatherData = new Weather(element);
        weatherArr.push(weatherData);
      });
      return weatherArr;
    });
}

// C.F to get weather data

function Weather(dailyWeather) {
  this.forecast = dailyWeather.weather.description;
  this.time = dailyWeather.valid_date;
}

// Handling Trail Route

function trailsHandler(request, response) {
  let lat = locationsArr.lat;
  let lon = locationsArr.lon;
  getTrails(lat, lon).then(trailsData => response.status(200).json(trailsData));
}

function getTrails(lat, lon) {
  const TRAILS_KEY = process.env.TRAIL_API_KEY;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${TRAILS_KEY}`;
  return superagent.get(url).then(trailsData => {
    const trailsInfo = new Trails(lat, lon, trailsData.body);
    return trailsInfo;
  });
}

// C.F

function Trail(lat, lon, )

// Handle 'Not Found'
server.use('*', (request, response) => {
  response.status(404).send('ERROR 404: PAGE NOT FOUND');
});

// Handle 'Errors'
server.use((error, request, response) => {
  response.status(500).send('Error 500: Sorry, something went wrong');
});


