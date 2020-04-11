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

let lat, lon;

// C.F to get location data as instances

function LocationData(city, geoData) {
  this.city = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  lat = this.latitude;
  this.longitude = geoData[0].lon;
  lon = this.longitude;
}


// Handling Weather Route

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

function weatherHandler(request, response) {
  const city = request.query.city;
  getWeather(city).then(weatherData => response.status(200).json(weatherData));
}

function getWeather(city) {
  const WEATHER_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_KEY}`;
  return superagent.get(url)
    .then(weatherData => {
      let weatherInfo = weatherData.body.data.map(element => {
        return new Weather(element);
      });
      return weatherInfo;
    })
    .catch(error => {
      console.error(error);
    });
}

// C.F to get weather data

function Weather(dailyWeather) {
  this.forecast = dailyWeather.weather.description;
  this.time = dailyWeather.valid_date;
}

// Handling Trail Route

function trailsHandler(request, response) {
  // let lat = locationsArr.lat;
  // let lon = locationsArr.lon;
  getTrails(lat, lon).then(trailsData => response.status(200).json(trailsData));
}

function getTrails(lat, lon) {
  const TRAILS_KEY = process.env.TRAIL_API_KEY;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${TRAILS_KEY}`;
  return superagent.get(url).then(trailsData => {
    let trailsInfo = trailsData.body.trails.map(element => {
      return new Trails(element);
    });
    return trailsInfo;
  });
}

// C.F

function Trails(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.split(" ")[0];
  this.condition_time = trail.conditionDate.split(" ")[1];
}

// Handle 'Not Found'
server.use('*', (request, response) => {
  response.status(404).send('ERROR 404: PAGE NOT FOUND');
});

// Handle 'Errors'
server.use((error, request, response) => {
  response.status(500).send('Error 500: Sorry, something went wrong');
});


