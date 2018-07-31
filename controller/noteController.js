app.controller('noteController', function($scope, UserService) {

//To Get Notes
$scope.notes = [];
getnotes();

 function getnotes() {

    var url = "http://localhost:8080/fundoonotes/getnotes";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.getHeaderMethod(url,token).then(function successCallback(response) {
      $scope.notes=response.data;
      console.log($scope.notes);
      console.log("Success");
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

//Note Create
  $scope.createNote = function() {

    if ($scope.title != undefined || $scope.description != undefined) {
      $scope.noteData = {
        title: $scope.title,
        description: $scope.description,
        color: $scope.color,
        archive: $scope.archive,
        pin: $scope.pin
      };

      var url = "http://localhost:8080/fundoonotes/createnote";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.postHeaderMethod($scope.noteData, url, token).then(function successCallback(response) {
        getnotes();
      }, function errorCallback(response) {
        console.log("Error");
      });
    }
  }

});
