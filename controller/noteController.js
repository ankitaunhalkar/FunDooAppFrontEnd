app.controller('noteController', function($rootScope, $scope, $mdSidenav, $state, $sanitize, $mdDialog, $mdPanel, $stateParams, UserService) {

  $scope.getInitials = function(name) {
    var canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.width = '100';
    canvas.height = '100';
    document.body.appendChild(canvas);
    var context = canvas.getContext('2d');
    context.fillStyle = "#999";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "50px Arial";
    context.fillStyle = "#ccc";
    var first;
    first = name.charAt(0);
    var initials = first;
    context.fillText(initials.toUpperCase(), 35, 60);
    var data = canvas.toDataURL();
    document.body.removeChild(canvas);
    return data;
  }

  $scope.refreshPage = function() {
    console.log("inside refresh");
    window.location.reload();
  }

  $scope.labelname = $stateParams.label;

  $rootScope.$state = $state;

  //To Get Notes
  $scope.notes = [];

  $scope.labels = [];

  $scope.toolbar = {
    'background-color': '#fb0'
  };

  //Default check
  homePage();
  //Color Array
  $scope.colors = [
    [{
        color: "#FFFF",
        name: "white"
      },
      {
        color: "#FF5252", //red
        name: "white"
      },
      {
        color: "#FFD740", //yellow
        name: "yellow"
      }
    ],
    [{
        color: '#EEFF41', //lime
        name: "lime"
      },
      {
        color: "pink",
        name: "pink"
      },
      {
        color: "#FF9800", //orange
        name: "orange"
      }
    ],
    [{
        color: '#9E9E9E', //grey
        name: "grey"
      },
      {
        color: "#BCAAA4", //brown
        name: "brown"
      },
      {
        color: "#64FFDA", //teal
        name: "teal"
      }
    ]
  ];

  $rootScope.grid = "grid";
  $rootScope.imageSize = "imageSize";
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
      // $scope.d = response.data.description;
    }, function errorCallback(response) {
      console.log("Error" + response);
    });
  }

  function getlabels() {

    var url = "http://localhost:8080/fundoonotes/getlabels";

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.getMethod(url, token).then(function successCallback(response) {
      $scope.labels = response.data;
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
      var user = loadprofile();
      $scope.image = user.profile;
      $scope.name = user.username;
      getnotes();
      getlabels();
    }
  }

  //Add label to note
  $scope.addlabel = function(note, label) {
    var url = "http://localhost:8080/fundoonotes/addlabel/" + label.id;

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.putMethod(note, url, token).then(function successCallback(response) {
      console.log(response);
      getnotes();
      getlabels();
      // dashboardlabels();
    }, function errorCallback(response) {
      console.log("Error");
    });

  }

  //Add label to note
  $scope.removelabel = function(note, label) {
    var url = "http://localhost:8080/fundoonotes/removelabel/" + label.id;

    var token = {
      'Authorization': localStorage.getItem('loginToken')
    };

    UserService.putMethod(note, url, token).then(function successCallback(response) {
      getnotes();
      getlabels();
      // dashboardlabels();
    }, function errorCallback(response) {
      console.log("Error");
    });

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
        morepanel: $scope.openMorePanelMenu,
        removelabel: $scope.removelabel,
        sc: $scope,
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
  function updateController(updateNote, sc, update, archive, trash, pin, events, $sanitize, removelabel, updateImage, fullScreen, colorbox, colorMenu, colorChange, imageDelete, morepanel, $scope) {
    $scope.newTitle = updateNote.title;
    // console.log();
    $scope.newDescription = $sanitize(updateNote.description);
    $scope.color = updateNote.color;
    $scope.image = updateNote.image;
    $scope.colors = colorbox;
    $scope.note = updateNote;
    // morepanel(event,updateNote);
    // $scope.morepanel = morepanel(event,updateNote);
    // console.log(sc);
    // $scope.morepanel = sc.openMorePanelMenu;
    // console.log($scope.morepanel);

    $scope.moremenu = function(event) {
      morepanel(event, updateNote)
    }

    $scope.removelabelnote = function(label) {
      console.log(label);
      removelabel(updateNote, label);
    }
    $scope.close = function() {
      updateNote.title = $scope.newTitle;
      updateNote.description = $scope.newDescription;
      update(updateNote);
      $mdDialog.hide();
    }

    $scope.imagefullScreen = function() {
      fullScreen(events, updateNote);
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
  getlabels();


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
      locals: {
        dashboardlabels: getlabels
      },
      controller: labelController,
      templateUrl: 'templates/labeldialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  function labelController(dashboardlabels, $scope) {
    $scope.labels = [];
    //Create Label
    $scope.createLabel = function() {

      $scope.labelName = {
        labelname: $scope.addlabel
      }

      var url = "http://localhost:8080/fundoonotes/createlabel";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.postMethod($scope.labelName, url, token).then(function successCallback(response) {
        $scope.addlabel = null;
        $scope.getlabels();
        dashboardlabels();
      }, function errorCallback(response) {
        console.log("Error");
      });
    }

    //Get Labels
    $scope.getlabels = function() {

      var url = "http://localhost:8080/fundoonotes/getlabels";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.getMethod(url, token).then(function successCallback(response) {
        $scope.labels = response.data;
      }, function errorCallback(response) {
        console.log("Error");
      });

    }

    //Default call
    $scope.getlabels();

    //Delete Note
    $scope.deleteLabel = function(label) {
      var id = label.id;
      var url = "http://localhost:8080/fundoonotes/deletelabel/" + id;
      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };
      UserService.deleteMethod(url, token).then(function successCallback(response) {
        $scope.getlabels();
        dashboardlabels();
      }, function errorCallback(response) {
        console.log("Error");
      });
    }

    //Update Note
    $scope.updateLabel = function(label) {
      var url = "http://localhost:8080/fundoonotes/updatelabel";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.putMethod(label, url, token).then(function successCallback(response) {
        $scope.getlabels();
        dashboardlabels();
      }, function errorCallback(response) {
        console.log("Error");
      });
    }

    //clear input text
    $scope.clear = function() {
      $scope.addlabel = null;
    }

    $scope.close = function() {
      $mdDialog.hide();
    }
  }

  $scope.openMorePanelMenu = function(ev, note) {
    var position = $mdPanel.newPanelPosition()
      .relativeTo(ev.target)
      .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

    var config = {
      locals: {
        updateNote: note,
        trash: $scope.isTrash,
        update: $scope.updateNote,
        addlabelnote: $scope.addlabel,
        removelabelnote: $scope.removelabel
      },
      attachTo: angular.element(document.body),
      controller: panelMoreMenuCtrl,
      templateUrl: 'templates/labelpanel.html',
      panelClass: 'more-menu',
      position: position,
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 9999
    };

    $mdPanel.open(config);
  };

  function panelMoreMenuCtrl(mdPanelRef, updateNote, update, addlabelnote, removelabelnote, trash, $scope) {

    $scope.selected = updateNote.notelabel;

    $scope.toggle = function(label, list) {
      var flag = true;
      for (var i = 0; i < list.length; i++) {
        var selectedItem = list[i];
        if (selectedItem.labelName == label.labelname) {
          list.splice(i, 1);
          removelabelnote(updateNote, label);
          flag = false;
        }
      }
      if (flag) {
        list.push(label);
        addlabelnote(updateNote, label);
      }
      // var idx = list.indexOf(label);
      // if (idx > -1) {
      //   list.splice(idx, 1);
      //   removelabelnote(updateNote, label);
      // } else {
      //   list.push(label);
      //   addlabelnote(updateNote, label);
      // }
    };

    $scope.exists = function(label, list) {

      for (var i = 0; i < list.length; i++) {
        var selected = list[i];

        if (selected.labelName == label.labelName) {
          return true;
        }
      }
      return false;
      // return list.indexOf(label) > -1;
    };

    $scope.trash = function() {
      trash(updateNote);
      mdPanelRef && mdPanelRef.close();
    }

    //Get Labels
    $scope.getlabels = function() {

      var url = "http://localhost:8080/fundoonotes/getlabels";

      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.getMethod(url, token).then(function successCallback(response) {
        $scope.labelset = response.data;
      }, function errorCallback(response) {
        console.log("Error");
      });

    }

    //Default call
    $scope.getlabels();
  }

  function loadprofile() {
    $scope.user = JSON.parse(localStorage.getItem('userData'));
    return $scope.user;
    // $scope.showemail = $scope.user.email;
    // $scope.showname = $scope.user.username;

  }

  $scope.openProfilePanel = function(ev) {
    var position = $mdPanel.newPanelPosition()
      .relativeTo(ev.target)
      .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

    var config = {
      locals: {
        dialog: $scope.profileDialog,
        profileInfo: loadprofile,
        initials: $scope.getInitials
      },
      attachTo: angular.element(document.body),
      controller: profileCtrl,
      templateUrl: 'templates/profilepanel.html',
      panelClass: 'profile',
      position: position,
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 10
    };

    $mdPanel.open(config);
  };

  function profileCtrl(profileInfo, mdPanelRef, initials, dialog, $scope) {
    $scope.myImage = '';
    $scope.myCroppedImage = '';


    $scope.user = profileInfo();

    $scope.showname = $scope.user.username;
    $scope.showemail = $scope.user.email;
    $scope.showprofile = $scope.user.profile;


    $scope.getInitials = function(username) {
      return initials(username);
    }

    //User Sign-Out
    $scope.signOut = function() {
      localStorage.removeItem('loginToken');
      localStorage.removeItem('userData');
      mdPanelRef && mdPanelRef.close();
      $state.go('login');
    }

    $scope.updateProfile = function(event) {
      dialog(event);
    }
  }

  $scope.profileDialog = function(ev) {
    $mdDialog.show({
      controller: profileController,
      templateUrl: 'templates/profiledialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
    });
  }

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n) {
      // u8arr[n] = bstr.charCodeAt(n);
      // n--;
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1
    }
    return new File([u8arr], filename, {
      type: mime
    });
  }

  function profileController($scope, $timeout) {
    $scope.myImage = '';
    $scope.myCroppedImage = '';

    $scope.close = function() {
      $mdDialog.hide();
    }

    var file;
    var handleFileSelect = function(evt) {
      file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function($scope) {
          $scope.myImage = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    // angular.element(document.getElementById('fileInput')).on('change',handleFileSelect);
    $timeout(function() {
      console.log("timeout");
      angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    }, 1000, false);

    $scope.saveProfile = function(newfile) {

      $scope.profiledata = {
        profile: newfile
      }
      var url = "http://localhost:8080/fundoonotes/setprofile";
      var token = {
        'Authorization': localStorage.getItem('loginToken')
      };

      UserService.putMethod($scope.profiledata, url, token).then(function successCallback(response) {
        console.log(response);
        localStorage.setItem("userData", JSON.stringify(response.data));
        $mdDialog.hide();
      }, function errorCallback(response) {
        console.log("Error");
      });


    }
    $scope.uploadProfile = function(myCroppedImage) {

      var newfile = dataURLtoFile(myCroppedImage, file.name);
      console.log(newfile);

      var url = "http://localhost:8080/fundoonotes/uploadimage";

      UserService.postImageMethod(url, newfile).then(function successCallback(response) {
        console.log(response.data.message);
        var file = response.data.message;
        console.log(file);
        $scope.saveProfile(file)
      }, function errorCallback(response) {
        console.log("Error");
      });
    }
  }
});
