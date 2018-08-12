var app = angular.module('fundooApp', ['ngMaterial', 'ngAria', 'ngAnimate', 'ui.router','content-editable','angular.filter']);
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

    .state('home.search',{
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'noteController'
    })

    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'noteController'
    })

    .state('home.dashboard',{
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'noteController'
    })

    .state('home.trash',{
      url: '/trash',
      templateUrl: 'templates/trash.html',
      controller: 'noteController'
    })

    .state('home.archive',{
      url: '/archive',
      templateUrl: 'templates/archive.html',
      controller: 'noteController'
    })

    $urlRouterProvider.otherwise('/login');

});
