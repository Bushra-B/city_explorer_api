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

// C.F to get location data as instances

function LocationData(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// Handling Weather Route

server.get('/weather', (request, response) => {
  const weatherData = require('./data/weather.json');
  const data = weatherData.data;
  let weatherArr = data.map((element, index) => {
    return new Weather(data, index);
  });
  //send response
  response.send(weatherArr);
});

// C.F to get weather data

function Weather(data, index) {
  this.forecast = data[index].weather.description;
  this.time = data[index].datetime;
  // weatherArr.push(this);
}

// Handle 'Not Found'
server.use('*', (request, response) => {
  response.status(404).send('ERROR 404: PAGE NOT FOUND');
});

// Handle 'Errors'
server.use((error, request, response) => {
  response.status(500).send('Error 500: Sorry, something went wrong');
});


