app.factory('UserService',function ($http) {
var api = {};

api.postMethod = function (user, baseurl) {
  return $http({
    method : 'POST',
    url : baseurl,
    data : user
  })
};

api.getMethod = function (baseurl) {
  return $http({
    method : 'GET',
    url : baseurl
  });
}

api.putMthod = function (user, baseurl) {
  return $http({
    method : 'PUT',
    url : baseurl,
    data : user
  });
}
return api;
});
