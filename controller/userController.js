app.controller('userController', function($scope, $state, $location, UserService) {

  //Register Form
  // $scope.register = function() {
  //   console.log("register");
  //  $state.go("register");
  // }

  //Login
  $scope.login = function() {

    $scope.userData = {
      email: $scope.email,
      password: $scope.password
    }

    var url = "http://localhost:8080/fundoonotes/login";

    UserService.postMethod($scope.userData, url, null).then(function successCallback(response) {

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

    UserService.postMethod($scope.userData, url, null).then(function successCallback(response) {

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

    UserService.postMethod($scope.userData, url, null).then(function successCallback(response) {

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
    var password = $scope.password;
    var cpassword = $scope.cpassword;
    if (password === cpassword) {

      $scope.userData = {
        newPassword: $scope.cpassword
      }
      var url = "http://localhost:8080/fundoonotes/changepassword/" + token;

      UserService.putMethod($scope.userData, url, null).then(function successCallback(response) {
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

});
