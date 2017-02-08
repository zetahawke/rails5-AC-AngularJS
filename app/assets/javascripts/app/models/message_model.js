'use strict';

/**
* @name: COMMUNE
* @description: Maintains COMMUNE data
* @attributes:
*
* | Name                  | Type           |
* |-----------------------|----------------|
* | @id                   | integer        |
* | @created_at           | datetime       |
* | @updated_at           | datetime       |
*
**/
(function() {
  this.app.factory('Message', ['$http', '$q', function($http, $q) {
    return {
      all: function(roomId) {
        var defer = $q.defer();
        $http({
          url: '/rooms/' + roomId + '/messages',
          method: 'GET',
        }).then(function(model) {
          defer.resolve(model.data);
        }, function(model) {
          defer.reject(model.data);
        });
        return defer.promise;
      }
    };
  }]);
}).call(this);
