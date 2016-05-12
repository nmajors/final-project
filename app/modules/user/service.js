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
          console.error("Error " + error);
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
    password: ""
    }
  }

  create(user) {
    return new this._$q((resolve, reject) => {
      // console.log("creating");
      this.auth.$createUser(user)
      .then((response) => {
        console.log(this.auth.$authWithPassword(user));
        return this.auth.$authWithPassword(user);
      })
      .then((response) => {
        // console.log("in response 2");
        this.user = response;
        resolve(this.user);
        console.log(this.user);
      })
      .catch((error) => {
        console.error("Error " + error);
        reject(error);
      });
    })
  }

}
export default UserService;
