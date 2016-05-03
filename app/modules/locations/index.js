import angular from 'angular';

import config from './config';

import locationsController from './controller';
import locationsService from './service';

let locations = angular.module('tiy.locations', []);

locations.config(config);
locations.controller('LocationsController', locationsController);
locations.service('LocationsService', locationsService);

export default locations;
