import angular from 'angular';
// import angular-google-maps from 'angular-google-maps';

import config from './config';

import locationsController from './controller';
import locationsService from './service';

let locations = angular.module('tiy.locations', []);

locations.config(config);
locations.controller('LocationsController', locationsController);
locations.service('LocationsService', locationsService);

export default locations;
