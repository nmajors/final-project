class UserService {
  constructor($q, $firebaseAuth){
    this._$q = $q;

    this.ref = new Firebase("https://nms-severe.firebaseio.com/");
    this.auth = $firebaseAuth(this.ref);
  }

  isLoggedIn() {
  return this.auth.$requireAuth();
  }

  login(user) {
      return new this._$q((resolve, reject) => {
        this.auth.$authWithPassword(user)
        .then((response) => {
          this.user = response;
          resolve(this.user);
        })
        .catch((error) => {
          alert(error);
          reject(error);
        });
      });
    }


  logout() {
    return this.auth.$unauth();
  }

  new() {
  return {
    email: "",
    password: "",
    password2: ""
    }
  }

  create(user) {
    return new this._$q((resolve, reject) => {
      this.auth.$createUser(user)
      .then((response) => {
        return this.auth.$authWithPassword(user);
      })
      .then((response) => {
        this.user = response;
        resolve(this.user);
      })
      .catch((error) => {
        alert(error);
        reject(error);
      });
    })
  }

}
export default UserService;
