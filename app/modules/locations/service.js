class LocationsService {
  constructor($firebaseArray, $q, $http) {
    this._$firebaseArray = $firebaseArray;
    this._$q = $q;
    this._$http = $http;

    this.ref = new Firebase("https://nms-severe.firebaseio.com/");
    this.geocoder = new google.maps.Geocoder();

    this.markers = [];
  }

  //get locations for logged in user
  getLocations(user) {
    this.locations = this._$firebaseArray(this.ref.child('users').child(user.uid).child('locations'));

    return this.locations.$loaded();
  }

  new() {
    return {
      address: "",
      city: "",
      state: "",
      coords: {}
      }
  }

  createLocation(location){
    return new this._$q((resolve, reject) => {

      this.geocoder.geocode( { "address": `${location.address}, ${location.city}, ${location.state}` }, function(results) {
            console.log(results);
              let loc = results[0].geometry.location,
                  lat      = loc.lat(),
                  lng      = loc.lng();
            console.log("Latitude: " + lat);
            console.log("Longitude: " + lng);
            this.locations.$add({
              address: location.address,
              city: location.city,
              state: location.state,
              coords: { lat, lng }
            })

            .then((ref) => {
              resolve(this.locations);
            })
            .catch((error) => {
              reject(error);
            });

      }.bind(this));

    });
  }

  // getAlerts(){
  //   this._$http
  //   .get(`http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.lat}&lon=${location.coords.lng}&appid=97e2a65458fa6ffa369e9f2c945bd316&units=imperial`)
  //   .then((response) =>{
  //     console.log(response);
  //   })
  // }

// getSevereAlerts(){
//   let baseUrl = "http://api.openweathermap.org/data/2.5/";
//   let apiKey = "97e2a65458fa6ffa369e9f2c945bd316";
//   this._$http
//     .get(`${baseUrl}weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=imperial`)
//
//
// }

}

export default LocationsService;
