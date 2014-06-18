angular.module('ngCordova.plugins.deviceOrientation', [])

.factory('$cordovaDeviceOrientation', ['$q', function($q) {

  return {
    watchHeading: function(options) {
      var q = $q.defer();

      navigator.compass.watchHeading(function(result) {
        q.notify(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);
angular.module('ngCordova.plugins.geolocation', [])

.factory('$cordovaGeolocation', ['$q', function($q) {

  return {
    getCurrentPosition: function(options) {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    watchPosition: function(options) {
      var q = $q.defer();

      navigator.geolocation.watchPosition(function(result) {
        // Do any magic you need
        q.notify(result);

      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },

    clearWatch: function(watchID) {
      return navigator.geolocation.clearWatch(watchID);
    }
  }
}]);
