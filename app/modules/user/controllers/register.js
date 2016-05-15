class RegisterController {
  constructor($state, UserService) {
    this._$state = $state;
    this._UserService = UserService;
    this.newUser = this._UserService.new();
    this.passwordFail = false;

  }


  register() {
    if (this.newUser.password !== "" && this.newUser.password===this.newUser.password2){
      this.passwordFail = false;
    this._UserService.create(this.newUser)
      .then((response) => {
        console.log(response);
        this._$state.go('locations');
      })
  }
  else{
    this.passwordFail = true;
  }

}

}


export default RegisterController;
