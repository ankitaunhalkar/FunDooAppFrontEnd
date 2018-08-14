app.factory('UserService', function($http) {

  var api = {};

  api.postMethod = function(user, baseurl, header) {
    return $http({
      method: 'POST',
      url: baseurl,
      headers: header,
      data: user
    })
  };

  api.getMethod = function(baseurl, header) {
    return $http({
      method: 'GET',
      url: baseurl,
      headers: header
    });
  }

  api.putMethod = function(user, baseurl, header) {
    return $http({
      method: 'PUT',
      url: baseurl,
      headers: header,
      data: user
    });
  }

  api.deleteMethod = function(baseurl, header) {
    return $http({
      method: 'DELETE',
      url: baseurl,
      headers: header
    });
  }

  api.postImageMethod = function(baseurl, file) {
    var fd = new FormData();
    fd.append('file', file);
    return $http({
      method: 'POST',
      url: baseurl,
      data: fd,
      headers: {'Content-Type': undefined}
    })
  }
  return api;
});
