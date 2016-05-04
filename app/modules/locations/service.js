class LocationsService {
  constructor($firebaseArray) {
    this._$firebaseArray = $firebaseArray;

    this.ref = new Firebase("https://nms-severe.firebaseio.com/");

    this.geocoder = new google.maps.Geocoder();


  }

  //get locations for logged in user
  getLocations(user) {
    this.locations = this._$firebaseArray(this.ref.child('users').child(user.uid).child('locations'));
    return this.locations;
  }

  new() {
    return {
      address: "",
      city: "",
      state: ""
      }
  }

  createLocation(location){
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
            lat,
            lng
          });
    }.bind(this));

  }





}

export default LocationsService;
