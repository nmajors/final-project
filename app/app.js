import angular from 'angular';
import uiRouter from 'angular-ui-router';

import firebase from 'firebase';
import angularFire from 'angularfire';
import nemLogging from 'angular-simple-logger';
import googMapos from 'angular-google-maps';

import user from './modules/user';
import locations from './modules/locations';


let App = angular.module('app', [
  'ui.router',
  'firebase',
  'nemLogging',
  'uiGmapgoogle-maps',

  'tiy.user',
  'tiy.locations'
]);

function config($urlRouterProvider, uiGmapGoogleMapApiProvider) {
  $urlRouterProvider.otherwise("/");

  uiGmapGoogleMapApiProvider
    .configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });

}

App.config(config);
