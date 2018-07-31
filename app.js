var app = angular.module('fundooApp', ['ngMaterial', 'ui.router','content-editable','angular.filter']);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'userController'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'userController'
    })

    .state('forgotpassword', {
      url: '/forgotpassword',
      templateUrl: 'templates/forgotpassword.html',
      controller: 'userController'
    })

    .state('resetpassword/:token', {
      url: '/resetpassword',
      templateUrl: 'templates/resetpassword.html',
      controller: 'userController'
    })

    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'userController'
    })

    .state('home.dashboard',{
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'noteController'
    })

  $urlRouterProvider.otherwise('/login');

});
