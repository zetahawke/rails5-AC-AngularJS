(function (angular) {
  'use strict';

  angular.module("ngWebSocket", [])
    .factory('$webSocket', ['$window', '$document', '$timeout', '$log', function ($window, $document, $timeout, $log) {

      function ReconnectingWebSocket(url, protocols, options) {

        // Default settings
        var settings = {

          /** Whether this instance should log debug messages. */
          debug: false,

          /** Whether or not the $window.WebSocket should attempt to connect immediately upon instantiation. */
          automatic_open: true,

          /** The number of milliseconds to delay before attempting to reconnect. */
          reconnect_interval: 1000,
          /** The maximum number of milliseconds to delay a reconnection attempt. */
          max_reconnect_interval: 30000,
          /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
          reconnect_decay: 1.5,

          /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
          timeout_interval: 2000,

          /** The maximum number of reconnection attempts to make. Unlimited if null. */
          max_reconnect_attempts: null
        };
        if (!options) { options = {}; }

        // Overwrite and define settings with options if they exist.
        for (var key in settings) {
          if (typeof options[key] !== 'undefined') {
            this[key] = options[key];
          } else {
            this[key] = settings[key];
          }
        }

        // These should be treated as read-only properties

        /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
        this.url = url;

        /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
        this.reconnect_attempts = 0;

        /**
         * The current state of the connection.
         * Can be one of: $window.WebSocket.CONNECTING, $window.WebSocket.OPEN, $window.WebSocket.CLOSING, $window.WebSocket.CLOSED
         * Read only.
         */
        this.readyState = $window.WebSocket.CONNECTING;
        
        /**
         * A string indicating the name of the sub-protocol the server selected; this will be one of
         * the strings specified in the protocols parameter when creating the $window.WebSocket object.
         * Read only.
         */
        this.protocol = null;

        // Private state variables

        var self = this;
        var ws;
        var timeout;
        var timed_out = false;
        var forced_close = false;
        //var eventTarget = angular.element('<div></div>');
        var eventTarget = document.createElement('div'); 

        // Wire up "on*" properties as event handlers

        eventTarget.addEventListener('open', function (event) { self.onopen(event); });
        eventTarget.addEventListener('close', function (event) { self.onclose(event); });
        eventTarget.addEventListener('connecting', function (event) { self.onconnecting(event); });
        eventTarget.addEventListener('message', function (event) { self.onmessage(event); });
        eventTarget.addEventListener('error', function (event) { self.onerror(event); });

        // Expose the API required by EventTarget

        this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
        this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
        this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);

        /**
         * This function generates an event that is compatible with standard
         * compliant browsers and IE9 - IE11
         *
         * This will prevent the error:
         * Object doesn't support this action
         *
         * http://stackoverflow.com/questions/19345392/why-arent-my-parameters-getting-passed-through-to-a-dispatched-event/19345563#19345563
         * @param s String The name that the event should use
         * @param args Object an optional object that the event will use
         */
        function generateEvent(s, args) {
          var evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(s, false, false, args);
          return evt;
        }

        this.open = function (reconnect_attempt) {
          ws = new $window.WebSocket(self.url, protocols || []);

          if (reconnect_attempt) {
            if (this.max_reconnect_attempts && this.reconnect_attempts > this.max_reconnect_attempts) {
              return;
            }
          } else {
            eventTarget.dispatchEvent(generateEvent('connecting'));
            this.reconnect_attempts = 0;
          }

          if (self.debug || ReconnectingWebSocket.debug_all) {
            $log.debug('ReconnectingWebSocket', 'attempt-connect', self.url);
          }

          var localWs = ws;
          timeout = $timeout(function () {
            if (self.debug || ReconnectingWebSocket.debug_all) {
              $log.debug('ReconnectingWebSocket', 'connection-timeout', self.url);
            }
            timed_out = true;
            localWs.close();
            timed_out = false;
          }, self.timeout_interval);

          ws.onopen = function (event) {
            $timeout.cancel(timeout);
            if (self.debug || ReconnectingWebSocket.debug_all) {
              $log.debug('ReconnectingWebSocket', 'onopen', self.url);
            }
            self.protocol = ws.protocol;
            self.readyState = $window.WebSocket.OPEN;
            self.reconnect_attempts = 0;
            var e = generateEvent('open');
            e.isReconnect = reconnect_attempt;
            reconnect_attempt = false;
            eventTarget.dispatchEvent(e);
          };

          ws.onclose = function (event) {
            $timeout.cancel(timeout);
            ws = null;
            if (forced_close) {
              self.readyState = $window.WebSocket.CLOSED;
              eventTarget.dispatchEvent(generateEvent('close'));
            } else {
              self.readyState = $window.WebSocket.CONNECTING;
              var e = generateEvent('connecting');
              e.code = event.code;
              e.reason = event.reason;
              e.wasClean = event.wasClean;
              eventTarget.dispatchEvent(e);
              if (!reconnect_attempt && !timed_out) {
                if (self.debug || ReconnectingWebSocket.debug_all) {
                  $log.debug('ReconnectingWebSocket', 'onclose', self.url);
                }
                eventTarget.dispatchEvent(generateEvent('close'));
              }

              timeout = self.reconnect_interval * Math.pow(self.reconnect_decay, self.reconnect_attempts);
              $timeout(function () {
                self.reconnect_attempts++;
                self.open(true);
              }, timeout > self.max_reconnect_interval ? self.max_reconnect_interval : timeout);
            }
          };
          ws.onmessage = function (event) {
            if (self.debug || ReconnectingWebSocket.debug_all) {
              $log.debug('ReconnectingWebSocket', 'onmessage', self.url, event.data);
            }
            var e = generateEvent('message');
            e.data = event.data;
            eventTarget.dispatchEvent(e);
          };
          ws.onerror = function (event) {
            if (self.debug || ReconnectingWebSocket.debug_all) {
              $log.debug('ReconnectingWebSocket', 'onerror', self.url, event);
            }
            eventTarget.dispatchEvent(generateEvent('error'));
          };
        };

        // Whether or not to create a $window.WebSocket upon instantiation
        if (this.automatic_open === true) {
          this.open(false);
        }

        /**
         * Transmits data to the server over the $window.WebSocket connection.
         *
         * @param data a text string, ArrayBuffer or Blob to send to the server.
         */
        this.send = function (data) {
          if (ws) {
            if (self.debug || ReconnectingWebSocket.debug_all) {
              $log.debug('ReconnectingWebSocket', 'send', self.url, data);
            }
            return ws.send(data);
          } else {
            throw 'INVALID_STATE_ERR : Pausing to reconnect $window.WebSocket';
          }
        };

        /**
         * Closes the $window.WebSocket connection or connection attempt, if any.
         * If the connection is already CLOSED, this method does nothing.
         */
        this.close = function (code, reason) {
          // Default CLOSE_NORMAL code
          if (typeof code == 'undefined') {
            code = 1000;
          }
          forced_close = true;
          if (ws) {
            ws.close(code, reason);
          }
        };

        /**
         * Additional public API method to refresh the connection if still open (close, re-open).
         * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
         */
        this.refresh = function () {
          if (ws) {
            ws.close();
          }
        };
      }

      /**
       * An event listener to be called when the $window.WebSocket connection's readyState changes to OPEN;
       * this indicates that the connection is ready to send and receive data.
       */
      ReconnectingWebSocket.prototype.onopen = function (event) { };
      /** An event listener to be called when the $window.WebSocket connection's readyState changes to CLOSED. */
      ReconnectingWebSocket.prototype.onclose = function (event) { };
      /** An event listener to be called when a connection begins being attempted. */
      ReconnectingWebSocket.prototype.onconnecting = function (event) { };
      /** An event listener to be called when a message is received from the server. */
      ReconnectingWebSocket.prototype.onmessage = function (event) { };
      /** An event listener to be called when an error occurs. */
      ReconnectingWebSocket.prototype.onerror = function (event) { };

      /**
       * Whether all instances of ReconnectingWebSocket should log debug messages.
       * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
       */
      ReconnectingWebSocket.debug_all = false;

      ReconnectingWebSocket.CONNECTING = $window.WebSocket.CONNECTING;
      ReconnectingWebSocket.OPEN = $window.WebSocket.OPEN;
      ReconnectingWebSocket.CLOSING = $window.WebSocket.CLOSING;
      ReconnectingWebSocket.CLOSED = $window.WebSocket.CLOSED;

      return ReconnectingWebSocket;

    }]);
})(angular);