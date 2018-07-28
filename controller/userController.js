app.controller('userController', function($scope, $state, $mdSidenav, $location, UserService, $timeout) {

  //Side Bar
  $scope.toggleLeft = buildToggler('left');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  };

  //Profile Account
  $scope.isProfileVisible = false;
  $scope.profile = function() {
    $scope.isProfileVisible = $scope.isProfileVisible ? false : true;
  }

  //Register Form
  $scope.register = function() {
    $state.go('register');
  }

  //Login
  $scope.login = function() {

    $scope.userData = {
      email: $scope.email,
      password: $scope.password
    }

    var url = "http://localhost:8080/fundoonotes/login";

    UserService.postMethod($scope.userData, url).then(function successCallback(response) {

      localStorage.setItem("loginToken", response.headers('Authorization'));
      localStorage.setItem("userData", JSON.stringify(response.data));

      $state.go('home.dashboard');
    }, function errorCallback(response) {
      console.log("Error");
      $state.go('login');
    });
  }


  //Registration
  $scope.userRegistration = function() {
    $scope.userData = {
      name: $scope.name,
      email: $scope.email,
      password: $scope.password,
      phone: $scope.phone
    };

    var url = "http://localhost:8080/fundoonotes/register";

    UserService.postMethod($scope.userData, url).then(function successCallback(response) {

      console.log("Success", response);
      $state.go('login');
    }, function errorCallback(response) {
      console.log("Error");
      $state.go('register');
    });
  }

  //Forgot Password
  $scope.forgotpassword = function() {
    $scope.userData = {
      emailId: $scope.email
    }

    var url = "http://localhost:8080/fundoonotes/forgotpassword";

    UserService.postMethod($scope.userData, url).then(function successCallback(response) {

      console.log("Success", response);
      //  $state.go('resetpassword');
    }, function errorCallback(response) {
      console.log("Error");
      $state.go('forgotpassword');
    });
  }

  //Reset Password
  $scope.resetpassword = function() {

    var token = $location.search().token;
    console.log("token", token);
    var password = $scope.password;
    var cpassword = $scope.cpassword;
    if (password === cpassword) {

      $scope.userData = {
        newPassword: $scope.cpassword
      }
      var url = "http://localhost:8080/fundoonotes/changepassword/" + token;

      UserService.putMthod($scope.userData, url).then(function successCallback(response) {
        console.log("Success", response);
        $state.go('login');
      }, function errorCallback(response) {
        console.log("Error");
        $state.go('forgotpassword');
      });

    } else {
      alert("Password doesn't match");
    }
  }

  //User Sign-Out
  $scope.signOut = function() {
    localStorage.removeItem('loginToken');
    $state.go('login');
  }

  //Default call for Home Page
  homePage();

  function homePage() {
    if (localStorage.getItem("loginToken") === null) {
      $state.go('login');
    } else {
      $scope.user = JSON.parse(localStorage.getItem("userData"));

      $scope.showemail = $scope.user.email;
      $scope.showname = $scope.user.username;

      $state.go('home.dashboard');
    }
  }
});
