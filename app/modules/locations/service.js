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
    this.geocoder.geocode( { "address": 'location' }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
            let location = results[0].geometry.location,
                lat      = location.lat(),
                lng      = location.lng();
          console.log("Latitude: " + lat);
          console.log("Longitude: " + lng);
          console.log(results);
        }
    });

    this.locations.$add(location);
  }





}

export default LocationsService;
