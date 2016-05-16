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
      editing: false
    }
  }

  statesList() {

  let states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  return states;


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

        // function formatState() {
        //   let stateDisplay;
        //   let stateInput = location.state;
        //   let stateInputArray = location.state.split(" ");
        //
        //   if (stateInputArray.length > 2) {
        //     stateInputArray = stateInputArray.slice(0, 2);
        //     stateDisplay = stateInputArray.join(" ");
        //     console.log(stateDisplay);
        //   } else {
        //     stateDisplay = location.state;
        //   }
        //   return stateDisplay;
        // }

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
