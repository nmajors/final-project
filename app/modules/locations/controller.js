class LocationsController {
  constructor($state, UserService, LocationsService, $scope, $http, $q) {
    this._$http = $http;
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this._$q = $q;

    this.demoMode = false;
    this.showWindow = true;
    this.deleteLocation = false;
    this.markers = [];

    this.newLocation = this._LocationsService.new();


  $scope.onClick = function(marker, eventName, model) {
      model.show = !model.show;
    };


    this.map = {
      center: {
        latitude: 32.7476539,
        longitude: -82.2650471
      },
      zoom: 8
    };


    this._UserService
      .isLoggedIn()
      .then((response) => {

        this.user = response;
        navigator.geolocation.getCurrentPosition((position ) => {
          //add a marker to the user's current location.
          this.currentPosition = {
              id: position.timestamp.toString(),
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              options: {
                icon: '../assets/images/home-icon.png'
              },
              title: "Your current Location"
            }
            //ng-if on ui-gmap-marker prevents marker add attempts before geolocation is complete
        });
        this._LocationsService.getLocations(this.user)
          .then((response) => {
            this.locations = response;
            this.showMarkers();
          });

      })
      .catch((error) => {
        this._$state.go("login");
      });

  }


  addLocation() {
    this._LocationsService
      .createLocation(this.newLocation)
      .then((response) => {
        this.locations = response;
        this.showMarkers();
      });
  }



  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }

  toggleDemo() {
    this.demoMode = !this.demoMode;
    showMarkers();
  }

  showMarkers() {
    this.markers = [];

    this.locations.forEach((location) => {

      let latitude = location.coords.lat;
      let longitude = location.coords.lng;
      this._$http
        .get(`http://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
        .then((response) => {
          let weather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

          location.weather = weather;
          location.icon = iconUrl;

          //set icon using switch?

          if (this.demoMode) {
            // location.weather = CRAZY SHIT
            // location.icon = poop guy
            // make array of bad stuff, random it
          }

          this.marker = {
            id: location.$id,
            coords: {
              latitude: location.coords.lat,
              longitude: location.coords.lng
            },
            name: location.title,
            address: location.address,
            city: location.city,
            state: location.state,
            icon: location.icon,
            temp: location.weather.main.temp,
            condition: location.weather.weather[0].description,
            weather: location.weather
          }
          console.log(this.marker);
          this.markers.push(this.marker);

        })

    });

  }


}

export default LocationsController;
