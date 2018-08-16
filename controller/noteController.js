app.controller('noteController', function($rootScope, $scope, $mdSidenav, $state, $mdDialog, $mdPanel, $window, UserService) {

  $rootScope.$state = $state;

  //To Get Notes
  $scope.notes = [];

  $scope.toolbar = {
    'background-color': '#fb0'
  };
  //Default check
  homePage();
  //Color Array
  $scope.colors = [
    [{
        color: "#FFFF"
      },
      {
        color: "#FF5252" //red
      },
      {
        color: "#FFD740" //yellow
      }
    ],
    [{
        color: '#EEFF41' //lime

      },
      {
        color: "pink"
      },
      {
        color: "#FF9800" //orange
      }
    ],
    [{
        color: '#9E9E9E' //grey

      },
      {
        color: "#BCAAA4" //brown
      },
      {
        color: "#64FFDA" //teal
      }
    ]
  ];

  $rootScope.grid = "grid";
  $rootScope.imageSize ="imageSize";
  //Side Bar
  $scope.toggleLeft = buildToggler('left');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
      var isOpen = $mdSidenav(componentId).isOpen();
      if (isOpen) {
        document.getElementById('container').style.marginLeft = "200px"
      } else {
        document.getElementById('container').style.marginLeft = "50px"
      }
    }
  };

  //Back to dashboard
  $scope.goback = function() {
    $scope.toolbar = {
      'background-color': '#fb0'
    };
    $state.go('home.dashboard');
  }

  //To search state
  $scope.search = function() {
    $scope.toolbar = {
      'background-color': '#3e50b4'
    };
    $state.go('home.search');
  }

  //to clear search text box
  $scope.clear = function() {
    $scope.searchText = null;
  }

  //grid View
  $scope.girdView = function() {
    $rootScope.grid = "list";
    $rootScope.imageSize = "imageBigSize";
  }

  //list View
  $scope.listView = function() {
    $rootScope.grid = "grid";
    $rootScope.imageSize = "imageSize";
  }

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
  $scope.isRestore = function(note) {
    note.trash = false;
    $scope.updateNote(note);
  }

  //Archive
  $scope.isArchive = function(note) {
    if (note == undefined) {
      $scope.archive = true;
      $scope.pin = false;
    } else {
      note.archive = true;
      note.pin = false;
      $scope.updateNote(note);
    }
  }

  //unarchive
  $scope.isUnarchive = function(note) {
    note.archive = false;
    $scope.updateNote(note);
  }

  //Pin
  $scope.isPin = function(note) {
    if (note == undefined) {
      $scope.pin = $scope.pin ? false : true;
      $scope.archive = false;
    } else {
      note.pin = note.pin ? false : true;
      note.archive = false;
      $scope.updateNote(note);
    }
  }

  //Color
  $scope.updateColor = function(note, color) {

    if (note == undefined) {
      $scope.colored = color;
    } else {
      note.color = color;
      $scope.updateNote(note);
    }
  }

  function getnotes() {

    var url = "http://localhost:8080/fundoonotes/getnotes";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.getMethod(url, token).then(function successCallback(response) {
      $scope.notes = response.data;
      $scope.d = response.data.description;
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

  //Note Create
  $scope.createNote = function() {

    if ($scope.title != undefined || $scope.description != undefined || $scope.title != null || $scope.description != null || $scope.imageshow != undefined) {
      $scope.noteData = {
        title: $scope.title,
        description: $scope.description,
        color: $scope.colored,
        archive: $scope.archive,
        pin: $scope.pin,
        reminder: $scope.reminder,
        image: $scope.imageshow
      };

      var url = "http://localhost:8080/fundoonotes/createnote";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.postMethod($scope.noteData, url, token).then(function successCallback(response) {
        $scope.title = null;
        $scope.description = null;
        $scope.colored = "white";
        $scope.pin = false;
        $scope.archive = false;
        $scope.imageshow = null;

        // document.getElementById('description').innerText = response.data.description;
        getnotes();
      }, function errorCallback(response) {
        console.log("Error");
      });
    } else {
      $scope.title = null;
      $scope.description = null;
      $scope.colored = "white";
      $scope.pin = false;
      $scope.archive = false;

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
  $scope.updateNote = function(noteData) {
    console.log(noteData + "updatenote");
    var url = "http://localhost:8080/fundoonotes/updatenote";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.putMethod(noteData, url, token).then(function successCallback(response) {
      $scope.title = null;
      $scope.description = null;
      console.log("success");
      getnotes();
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

  //Add Image
  $scope.uploadImage = function(element, note) {
    var file = element;
    console.log(file.name);
    var url = "http://localhost:8080/fundoonotes/uploadimage";

    UserService.postImageMethod(url, file).then(function successCallback(response) {
      if (note == undefined) {
        $scope.imageshow = response.data.message;
      } else {
        note.image = response.data.message;
        $scope.updateNote(note);
      }
    }, function errorCallback(response) {
      console.log("Error");
    });
  }

  $scope.deleteImage = function(note) {
    if (note == undefined) {
      $scope.imageshow = null;
    } else {
      note.image = null;
      $scope.updateNote(note);
    }
  }
  //Home Page method
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

  $scope.fullScreenImage = function(ev, note) {
    $mdDialog.show({
      locals: {
        imageNote: note
      },
      controller: imageController,
      templateUrl: 'templates/imagedialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  function imageController(imageNote, $scope) {
    $scope.image = imageNote.image
  }

  //Update dialog box
  $scope.showDialog = function(ev, note) {
    $mdDialog.show({
      locals: {
        updateNote: note,
        update: $scope.updateNote,
        archive: $scope.isArchive,
        trash: $scope.isTrash,
        pin: $scope.isPin,
        updateImage: $scope.uploadImage,
        colorMenu: $scope.openMoreMenu,
        imageDelete: $scope.deleteImage,
        colorChange: $scope.updateColor,
        colorbox: $scope.colors,
        fullScreen: $scope.fullScreenImage,
        events: ev
      },
      controller: updateController,
      templateUrl: 'templates/updatedialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  //dailog's controller
  function updateController(updateNote, update, archive, trash, pin, events, updateImage, fullScreen, colorbox, colorMenu, colorChange, imageDelete, $scope) {
    $scope.newTitle = updateNote.title;
    $scope.newDescription = updateNote.description;
    $scope.color = updateNote.color;
    $scope.image = updateNote.image;
    $scope.colors = colorbox;

    $scope.close = function() {
      updateNote.title = $scope.newTitle;
      updateNote.description = $scope.newDescription;
      update(updateNote);
      $mdDialog.hide();
    }

    $scope.imagefullScreen = function () {
      fullScreen(events,updateNote);
    }

    $scope.more = function($mdMenu) {
      $scope.openMoreMenu($mdMenu, events);
    }

    $scope.archive = function() {
      archive(updateNote);
      $mdDialog.hide();
    }

    $scope.trash = function() {
      trash(updateNote);
      $mdDialog.hide();
    }

    $scope.pin = function() {
      pin(updateNote);
      $mdDialog.hide();
    }

    $scope.updateImage = function(file) {
      updateImage(file, updateNote);
      $mdDialog.hide();
    }

    $scope.colorMenu = function($mdMenu, $event) {
      colorMenu($mdMenu, $event);
    }

    $scope.updateColor = function(color) {
      $scope.color = color;
      colorChange(updateNote, color);
    }

    $scope.deleteImage = function() {
      updateNote.image = null;
      $scope.image = null;
      imageDelete(updateNote);
    }

  }

  $scope.removeReminder = function(note) {
    note.reminder = null;
    $scope.updateNote(note);
  }

  $scope.showReminderMenu = function(ev, note) {
    var position = $mdPanel.newPanelPosition()
      .relativeTo(ev.target)
      .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelMenuCtrl,
      templateUrl: 'templates/reminder.html',
      panelClass: 'reminder-menu',
      locals: {
        reminderNote: note,
        update: $scope.updateNote
      },
      position: position,
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 2
    };

    $mdPanel.open(config);
  };

  function PanelMenuCtrl(mdPanelRef, update, reminderNote, $scope) {

    $scope.todayDate = new Date();

    console.log($scope.time);

    $scope.save = function() {
      reminderNote.reminder = $scope.date;
      update(reminderNote);
      mdPanelRef && mdPanelRef.close();
    }

    $scope.today = function() {
      reminderNote.reminder = $scope.todayDate;
      update(reminderNote);
      mdPanelRef && mdPanelRef.close();
    }

    $scope.tomorrow = function() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      reminderNote.reminder = currentDate;
      update(reminderNote);
      mdPanelRef && mdPanelRef.close();
    }

    $scope.week = function() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      reminderNote.reminder = currentDate;
      update(reminderNote);
      mdPanelRef && mdPanelRef.close();
    }
  }

  $scope.labelDialog = function(ev) {
    $mdDialog.show({
      controller: labelController,
      templateUrl: 'templates/labeldialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  function labelController($scope) {
  }

});
