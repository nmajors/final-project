class LocationsController {
  constructor($state, UserService, LocationsService) {
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this.newLocation = this._LocationsService.new();



    this.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    this.markers = [];

    this._UserService
      .isLoggedIn()
      .then((response) => {
        this.user = response;
        // console.log(this.user);
        this.locations = this._LocationsService.getLocations(this.user);
      })
      .catch((error) => {
        this._$state.go("login");
      });
  }


  addLocation() {
    this._LocationsService.createLocation(this.newLocation);
    console.log(this.newLocation);
  }


  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }

}

export default LocationsController;
