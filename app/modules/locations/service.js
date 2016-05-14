class LocationsService {
  constructor($firebaseArray, $q, $http) {
    this._$firebaseArray = $firebaseArray;
    this._$q = $q;
    this._$http = $http;

    this.ref = new Firebase("https://nms-severe.firebaseio.com/");
    this.geocoder = new google.maps.Geocoder();

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
      icon: "",
      editing: false
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

//format state to be max 2 words, so input like "North Carolina (NC) only prints as "North Carolina"
          let stateInput = location.state;
          let stateInputArray = location.state.split(" ");

          if (stateInputArray.length > 2){
            stateInputArray = stateInputArray.slice(0, 2);
            let stateDisplay = stateInputArray.join(" ");
            console.log(stateDisplay);
          }

        this.locations.$add({
          title: location.title,
          address: location.address,
          city: location.city,
          state: stateDisplay,
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
            location.state = "";
          })
          .catch((error) => {
            reject(error);
          });
      }.bind(this));
    });
  }

  removeLocation(location) {
    this.locations.$remove(location);
  }

  editLocation(location) {
    this.locations.$save(location);
  }


}




export default LocationsService;
