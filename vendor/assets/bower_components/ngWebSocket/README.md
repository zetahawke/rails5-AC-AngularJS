# ngWebSocket

A small JavaScript library that decorates the WebSocket API to provide a WebSocket connection that will automatically reconnect if the connection is dropped.

It is API compatible, so when you have:

```javascript
var ws = new WebSocket('ws://....');
```

you can replace with:

```javascript
var ws = new $webSocket('ws://....');
```

Minified library with gzip compression is less than 600 bytes.

## Installing

You can install this package locally with `bower`.

> Please note that Angular WebSocket requires **Angular 1.3.x** or higher.

```shell
# To get the latest stable version, use bower from the command line.
bower install angular-rws

# To get the most recent, last committed-to-master version use:
bower install 'angular-rws#master'

# To save the bower settings for future use:
bower install angular-rws --save

# Later, you can use easily update with:
bower update
```

## Using the library

Now that you have installed the Angular libraries, simply include the scripts and stylesheet in your main HTML file, in the order shown in the example below. Note that npm  will install the files under `/bower_components/angular-rws/`.

```html
<!DOCTYPE html>
<html>
<head>
</head>
    <body ng-app="YourApp">
    <div ng-controller="YourController">
    </div>

    <script src="/bower_components/angular/angular.js"></script>
    <script src="/bower_components/angular-rws/angular-rws.js"></script>
    <script>

        // Include app dependency on ngWebSocket

        angular.module( 'YourApp', [ 'ngWebSocket' ] )
            .controller("YourController", YourController );

    </script>

</body>
</html>
```

## How reconnections occur

With the standard `WebSocket` API, the events you receive from the WebSocket instance are typically:

    onopen
    onmessage
    onmessage
    onmessage
    onclose // At this point the WebSocket instance is dead.

With a `$webSocket`, after an `onclose` event is called it will automatically attempt to reconnect. In addition, a connection is attempted repeatedly (with a small pause) until it succeeds. So the events you receive may look something more like:

    onopen
    onmessage
    onmessage
    onmessage
    onclose
    // Attempts to reconnect
    onopen
    onmessage
    onmessage
    onmessage
    onclose
    // Attempts to reconnect
    onopen
    onmessage
    onmessage
    onmessage
    onclose

This is all handled automatically for you by the library.

### Parameters

```javascript
var socket = new $webSocket(url, protocols, options);
```

#### `url`

- The URL you are connecting to.
- <https://html.spec.whatwg.org/multipage/comms.html#network>

#### `protocols`

- Optional string or array of protocols per the WebSocket spec.
- <https://tools.ietf.org/html/rfc6455>

#### `options`

- Options (see below)

### Options

Options can either be passed as the 3rd parameter upon instantiation or set directly on the object after instantiation:

```javascript
var socket = new $webSocket(url, null, {debug: true, reconnectInterval: 3000});
```

or

```javascript
var socket = new $webSocket(url);
socket.debug = true;
socket.timeout_interval = 5400;
```

#### `debug`

- Whether this instance should log debug messages or not. Debug messages are printed to `console.debug()`.
- Accepts `true` or `false`
- Default value: `false`

#### `automatic_open`

- Whether or not the websocket should attempt to connect immediately upon instantiation. The socket can be manually opened or closed at any time using ws.open() and ws.close().
- Accepts `true` or `false`
- Default value: `true`

#### `reconnect_interval`

- The number of milliseconds to delay before attempting to reconnect.
- Accepts `integer`
- Default: `1000`

#### `max_reconnect_interval`

- The maximum number of milliseconds to delay a reconnection attempt.
- Accepts `integer`
- Default: `30000`

#### `reconnect_decay`

- The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist.
- Accepts `integer` or `float`
- Default: `1.5`

#### `timeout_interval`

- The maximum time in milliseconds to wait for a connection to succeed before closing and retrying.
- Accepts `integer`
- Default: `2000`

#### `max_reconnect_attempts`

- The maximum number of reconnection attempts that will be made before giving up. If null, reconnection attempts will be continue to be made forever.
- Accepts `integer` or `null`.
- Default: `null`

#### `binary_type`

- The binary type is required by some applications.
- Accepts strings `'blob'` or `'arraybuffer'`.
- Default: `'blob'`

---

### Methods

#### `ws.open()`

- Open the Reconnecting Websocket

#### `ws.close(code, reason)`

- Closes the WebSocket connection or connection attempt, if any. If the connection is already CLOSED, this method does nothing.
- `code` is optional the closing code (default value 1000). [https://tools.ietf.org/html/rfc6455#section-7.4.1](https://tools.ietf.org/html/rfc6455#section-7.4.1)
- `reason` is the optional reason that the socket is being closed. [https://tools.ietf.org/html/rfc6455#section-7.1.6](https://tools.ietf.org/html/rfc6455#section-7.1.6)

#### `ws.refresh()`

- Refresh the connection if still open (close and then re-open it).

#### `ws.send(data)`

- Transmits data to the server over the WebSocket connection.
- Accepts @param data a text string, ArrayBuffer or Blob

Like this? Check out [angular-rws](https://github.com/ajsb85/angular-rws) for the simplest way to create WebSocket backends from any programming language.