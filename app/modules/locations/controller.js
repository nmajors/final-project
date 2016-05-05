class LocationsController {
  constructor($state, UserService, LocationsService, $scope, $http) {
    this._$http = $http;
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this.newLocation = this._LocationsService.new();

    // this.showAlerts = this._LocationsService.getAlerts();

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

        navigator.geolocation.getCurrentPosition((position) => {
          this.map.center.latitude = position.coords.latitude;
          this.map.center.longitude = position.coords.longitude;
          $scope.$digest();
        })

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


    showMarkers(){

      this.markers = [];

      this.locations.forEach((location) =>{
        let latitude = location.coords.lat;
        let longitude = location.coords.lng;
        this._$http
        .get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=97e2a65458fa6ffa369e9f2c945bd316&units=imperial`)
        .then((response) =>{
          console.log(response);
          let weather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

          location.weather = weather;
          location.icon = iconUrl;
          console.log(location.icon);

          this.marker = {
            id: location.$id,
            coords: {
              latitude: location.coords.lat,
              longitude: location.coords.lng
            },
            address: `${location.address} ${location.city} ${location.state}`,
            options: {
              icon: location.icon
              }
          }
          console.log(this.marker);
          this.markers.push(this.marker);


          // let location.weather = response;
          // console.log(location);
          // this.iconCode = response.data.weather[0].icon;
          // this.iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;


        })

      });
    }




}

export default LocationsController;
