class LocationsController {
  constructor($state, UserService, LocationsService, $scope) {
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this.newLocation = this._LocationsService.new();

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
          console.log(response);
          this.locations = response;
          this.showMarkers();
        });
    }


    logout() {
      this._UserService.logout();
      this._$state.go("login");
    }

    showMarkers() {
      this.markers = [];

      this.locations.forEach((location) => {
        this.marker = {
          id: location.$id,
          coords: {
            latitude: location.coords.lat,
            longitude: location.coords.lng
          },
          address: `${location.address} ${location.city} ${location.state}`,
        }
        this.markers.push(this.marker);
      });
    }


}

export default LocationsController;
