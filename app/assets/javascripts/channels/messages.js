// app/assets/javascripts/channels/messages.js
// app/assets/javascripts/channels/room.js

//= require cable
//= require_self
//= require_tree .

//this.App = {};

//App.cable = ActionCable.createConsumer();  
//App.messages = App.cable.subscriptions.create('MessagesChannel', {  
//  received: function(data) {
//    debugger;
//    $("#messages").removeClass('hidden')
//    return $('#messages').append(this.renderMessage(data));
//  },

//  renderMessage: function(data) {
//    return  "<p>"+
//              "<b>" + data.user_id + ": </b>" 
//              + data.content + 
//            "</p>";
//  }
//});