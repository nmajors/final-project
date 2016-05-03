function config($stateProvider) {
  $stateProvider
  .state('profile', {
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
