class LocationsService {
  constructor($firebaseArray, $q, $http) {
    this._$firebaseArray = $firebaseArray;
    this._$q = $q;
    this._$http = $http;

    this.ref = new Firebase("https://nms-severe.firebaseio.com/");
    this.geocoder = new google.maps.Geocoder();

    this.statesList();

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
      editing: false,
      deleting: false
    }
  }


  statesList() {

  let states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  return states;
  }

  getUserLocation(){
    return new this._$q((resolve, reject) => {
      let position;
      let geolocateDone;
      let geoOptions = {
        timeout:(5000),
        maximumAge: (60 * 60 * 1000)
      };

      let geoSuccess = function(userPosition){
        position = userPosition;
        // console.log("YOU MADE IT: " + position);
          resolve(userPosition);
      };

      let geoErrorHandler = function(err){
        // position = userDefault;
        // console.log("Error code: " + err.code);
        reject(geoErrorHandler);
        // console.log("NO MADE IT: " + err);
          // this.geopositionDone=true;
      };


        // this.geopositionDone = true;

        navigator.geolocation.getCurrentPosition(geoSuccess, geoErrorHandler, geoOptions);

      });

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


        function formatState(){
          let stateInput = location.state;
          if(stateInput.length === 2){
            stateInput = stateInput.toUpperCase();
          }
          return stateInput;
        }

        this.locations.$add({
          title: location.title,
          address: location.address,
          city: location.city,
          state: formatState(),
          coords: {
            lat,
            lng
          },
          deleting: false,
          editing: false
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
    return this.locations.$remove(location);
  }

  editLocation(location) {
    this.locations.$save(location);
  }


}




export default LocationsService;
