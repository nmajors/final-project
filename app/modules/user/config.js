function config($stateProvider) {
  $stateProvider
  .state('register', {
    url: '/register',
    controller: 'RegisterController as registerCtrl',
    template: require('./views/register.html')
  })
  .state('login', {
    url: '/login',
    controller: 'LoginController as loginCtrl',
    template: require ('./views/login.html')
  });
}

export default config;
