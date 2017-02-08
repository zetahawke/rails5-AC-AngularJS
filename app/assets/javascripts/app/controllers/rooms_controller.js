(function() {
  this.app.controller('RoomsController', ['$scope', 'ActionCableChannel', 'Message', function($scope, ActionCableChannel, Message) {
    $scope.myData = [];
    var consumer = new ActionCableChannel("MessagesChannel");
    var callback = function(message){ $scope.myData.push(message); };
    consumer.subscribe(callback).then(function(){
      $scope.sendToMyChannel = function(message){ consumer.send(message, 'send_a_message'); };
      $scope.$on("$destroy", function(){
        consumer.unsubscribe().then(function(){ $scope.sendToMyChannel = undefined; });
      });
    });

    $scope.roomMessages = function(roomId){
      Message.all(roomId).then(function(data){
        data.forEach(function(message, index){
          $scope.myData.push(message);
        });
      }, function(error){
        console.error(error)
      });
    };
  }]);
}).call(this);