class LocationsService {
  constructor($firebaseArray, $q) {
    this._$firebaseArray = $firebaseArray;
    this._$q = $q;

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

}

export default LocationsService;
