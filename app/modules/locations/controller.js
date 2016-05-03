class LocationsController {
  constructor($state, UserService) {
    this._$state = $state;
    this._UserService = UserService;


    this.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    this._UserService
      .isLoggedIn()
      .then((response) => {
        this.user = response;
        console.log(this.user);
      })
      .catch((error) => {
        this._$state.go("login");
      });
  }


  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }

}

export default LocationsController;
