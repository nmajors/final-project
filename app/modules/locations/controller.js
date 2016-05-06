class LocationsController {
  constructor($state, UserService, LocationsService, $scope, $http) {
    this._$http = $http;
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;

    this.demoMode = false;
    this.showWindow = true
    this.markers = [];
    // this.currentPosition = {};

    this.newLocation = this._LocationsService.new();

    $scope.onClick = function(marker, eventName, model) {
      model.show = !model.show;
      console.log(model);
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
        // console.log(this.user);
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
        // console.log(response);
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
    this.currentPosition = {};

    this.locations.forEach((location) => {

      let latitude = location.coords.lat;
      let longitude = location.coords.lng;
      this._$http
        .get(`http://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
        .then((response) => {
          // console.log(response);
          let weather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

          location.weather = weather;
          location.icon = iconUrl;

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
            condition: location.weather.weather[0].description
          }
          console.log(this.marker);
          this.markers.push(this.marker);

        })



    });
    navigator.geolocation.getCurrentPosition((position ) => {
      this.currentPosition = {
          id: "1",
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }
        // $scope.$digest();
      console.log(this.currentPosition);
    });

  }




}

export default LocationsController;
