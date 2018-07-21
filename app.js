var app = angular.module('fundooApp',['ngMaterial' , 'ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('register',{
          url : '/register',
          templateUrl : 'templates/register.html',
          controller : 'userController'
  })

  .state('login',{
          url : '/login',
          templateUrl : 'templates/login.html',
          controller : 'userController'
  })

  .state('home',{
          url : '/home',
          templateUrl : 'templates/home.html',
          // controller : 'homeController'
  })

  .state('forgotpassword',{
          url : '/forgotpassword',
          templateUrl : 'templates/forgotpassword.html',
          controller : 'userController'
  })

  .state('resetpassword',{
          url : '/resetpassword',
          templateUrl : 'templates/resetpassword.html',
          controller : 'userController'

  })

  $urlRouterProvider.otherwise('/login');

});
