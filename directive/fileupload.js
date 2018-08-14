app.directive('validFile',[function() {
  return {
    require : 'ngModel',
    scope : {format: '@', upload : '&upload'},
    link : function(scope, el, attrs, ngModel) {
      // change event is fired when file is selected
      el.bind('change', function(event) {
        // console.log(event.target.files[0]);
        scope.upload({file:event.target.files[0]});
        scope.$apply(function() {
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      })
    }
  }
}]);
