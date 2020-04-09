'use strict';


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
  this.city = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

