class LoginController {
  constructor($state, UserService){
    this._$state = $state;
    this._UserService = UserService;

    this.user = this._UserService.new();
  }


  login() {
    this._UserService.login(this.user)
    .then((response) =>{
      this._$state.go("locations");
    })
  }

  guestLogin() {
    this.isGuest = true;
    this.user.email = "test@test.com"
    this.user.password = "password"
    this._UserService.login(this.user)
    .then((response) =>{
      this._$state.go("locations");
    })
  }



}


export default LoginController;
