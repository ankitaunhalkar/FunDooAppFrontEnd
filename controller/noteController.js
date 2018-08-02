app.controller('noteController', function($scope, $mdSidenav, $state, UserService) {

  //Default check
  homePage();

  //Side Bar
  $scope.toggleLeft = buildToggler('left');
  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  };

  //More menu
  $scope.openMoreMenu = function($mdMenu, ev) {
    $mdMenu.open(ev);
  };

  //Profile Account
  $scope.isProfileVisible = false;
  $scope.profile = function() {
    $scope.isProfileVisible = $scope.isProfileVisible ? false : true;
  }

  //User Sign-Out
  $scope.signOut = function() {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('userData');
    $state.go('login');
  }

  //Trash
  $scope.isTrash = function(note) {
    note.trash = true;
    note.pin = false;
    note.archive = false;
    $scope.updateNote(note);
  }

  //Restore
  $scope.restore = function (note) {
    note.trash = false;
    $scope.updateNote(note);
  }

  //Archive
  $scope.isArchive = function (note) {
    console.log(note);
    note.archive = true;
    note.pin = false;
    $scope.updateNote(note);
    console.log(note);
  }

  //To Get Notes
  $scope.notes = [];

  function getnotes() {

    var url = "http://localhost:8080/fundoonotes/getnotes";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.getMethod(url, token).then(function successCallback(response) {
      $scope.notes = response.data;
      console.log($scope.notes);
      console.log("Success");
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

  //Note Create
  $scope.createNote = function() {

    if ($scope.title != undefined || $scope.description != undefined || $scope.title != null || $scope.description != null) {
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

      UserService.postMethod($scope.noteData, url, token).then(function successCallback(response) {
        $scope.title = null;
        $scope.description = null;
        getnotes();
      }, function errorCallback(response) {
        console.log("Error");
      });
    }
  }

  //Delete Note
  $scope.deleteNote = function(note) {
    var id = note.id;
    var url = "http://localhost:8080/fundoonotes/deletenote/" + id;
    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };
    UserService.deleteMethod(url, token).then(function successCallback(response) {
      getnotes();
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

  //Update Note
  $scope.updateNote = function (noteData) {

    var url = "http://localhost:8080/fundoonotes/updatenote";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.putMethod(noteData, url, token).then(function successCallback(response) {
      $scope.title = null;
      $scope.description = null;
      getnotes();
    }, function errorCallback(response) {
      console.log("Error");
    });
  }


  function homePage() {
    if ((localStorage.getItem("loginToken") === null) && (localStorage.getItem("userData") === null)) {
      $state.go('login');
    } else {
      $scope.user = JSON.parse(localStorage.getItem('userData'));
      $scope.showemail = $scope.user.email;
      $scope.showname = $scope.user.username;
      getnotes();
    }
  }

});
