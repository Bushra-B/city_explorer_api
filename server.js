'use strict';

// Server Dependencies
const express = require('express');

const cors = require('cors');

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

// Handling Location Route

server.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');
  const cityLocation = new LocationData(geoData);
  response.send(cityLocation);
});

// C.F to get location data as instances

function LocationData(geoData) {
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


