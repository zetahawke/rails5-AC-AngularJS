var app = angular.module('real-time',['ngActionCable']).run(function (ActionCableConfig){
  ActionCableConfig.debug = true;
})