(function() {
  this.app.controller('StatusController', ['$scope', 'ActionCableSocketWrangler', function($scope, ActionCableSocketWrangler) {
    $scope.status= ActionCableSocketWrangler;
  }]);
}).call(this);