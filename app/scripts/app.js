'use strict';

angular.module('neopreneTemplateApp', ['users'])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/users/new', {
        templateUrl: 'views/userCreate.html',
        controller: 'UserCreateCtrl'
      })
      .when('/users/:id', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });