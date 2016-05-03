import angular from 'angular';

import config from './config';

import loginController from './controllers/login';
import registerController from './controllers/register';
import userService from './service';


let user = angular.module('tiy.user', []);

user.config(config);
user.controller('LoginController', loginController);
user.controller('RegisterController', registerController);
user.service('UserService', userService);

export default user;
