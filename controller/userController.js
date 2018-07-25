app.controller('userController', function($scope, $state, $location, $mdSidenav, UserService) {

  $scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

  $scope.register = function() {
    $state.go('register');
  }

  $scope.login = function() {
    $scope.userData = {
      email: $scope.email,
      password: $scope.password
    }

    var url = "http://localhost:8080/fundoonotes/login";

    UserService.postMethod($scope.userData, url).then(function successCallback(response) {
      console.log(response.headers('Authorization'));
      $state.go('home');
    }, function errorCallback(response) {
      console.log("Error");
      $state.go('login');
    });
  }

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

});
