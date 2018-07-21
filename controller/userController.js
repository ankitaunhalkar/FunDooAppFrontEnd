app.controller('userController', function($scope, $state) {

  $scope.user = {
    
  }

  $scope.home = function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email != null && password != null) {
      $state.go('home');
    } else {
      $state.go('login');
    }
  }

  $scope.register = function() {
    $state.go('register');
  }

  $scope.login = function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    if (email != null && password != null && name != null && phone != null) {
      $state.go('login');
    } else {
      $state.go('register');
    }
  }

});
