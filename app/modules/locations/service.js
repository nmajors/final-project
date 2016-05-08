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
      title: "",
      address: "",
      city: "",
      state: "",
      coords: {},
      weather: {},
      icon: ""
    }
  }

  createLocation(location) {
    return new this._$q((resolve, reject) => {

      this.geocoder.geocode({
        "address": `${location.address}, ${location.city}, ${location.state}`
      }, function(results) {
        // console.log(results);
        let loc = results[0].geometry.location,
          lat = loc.lat(),
          lng = loc.lng();

        this.locations.$add({
          title: location.title,
          address: location.address,
          city: location.city,
          state: location.state,
          coords: {
            lat,
            lng
          }
        })

        .then((ref) => {
            resolve(this.locations);

            //clear form input fields after add
            location.title = "";
            location.address = "";
            location.city = "";
            location.state="";

          })
          .catch((error) => {
            reject(error);
          });

      }.bind(this));

    });
  }

  // removeLocation(location) {
  //   console.log('deleting' + location);
  //   this.locations.$remove(location);
  // }


}




export default LocationsService;
