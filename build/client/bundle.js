(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Client = /** @class */ (function () {
    function Client(io) {
        var _this = this;
        this.connected = false;
        this.socket = io;
        this.socket.on('connect', function () {
            console.log('connected');
            document.getElementById('ico-conn').style.visibility = '';
            document.getElementById('pin_display').style.visibility = '';
            _this.connected = true;
        });
        this.socket.on('pin', function (data) {
            console.log(data);
            if (_this.pin) {
                document.getElementById('connect?').style.display = '';
            }
            _this.pin = data.pin;
            document.getElementById('pin_display').textContent = _this.pin.toString();
        });
        this.socket.on('disconnect', function () {
            console.log('disconnected');
            document.getElementById('ico-good').style.visibility = 'hidden';
            document.getElementById('ico-conn').style.visibility = 'hidden';
            document.getElementById('input').style.visibility = 'hidden';
            document.getElementById('data').style.visibility = 'hidden';
            document.getElementById('connector').style.display = 'none';
            document.getElementById('directions').style.visibility = 'hidden';
            _this.connected = false;
        });
        this.socket.on('bc', function (data) {
            console.log(data);
            if (data.conn) {
                document.getElementById('connector').style.display = 'none';
                document.getElementById('connect?').style.display = 'none';
                document.getElementById('ico-good').style.visibility = '';
                document.getElementById('input').style.visibility = '';
                // reshow pin now that we connected to elsewhere
                document.getElementById('directions').textContent = _this.pin.toString();
            }
        });
        this.socket.on('err', function (e) {
            console.log('err: ', e);
            if (e.pin) {
                console.log('pin error');
            }
        });
        var data_list = [];
        this.socket.on('data', function (data) {
            console.log('data: ', data);
            if (data.text) {
                if (data_list.length > 5) {
                    data_list.pop();
                }
                data_list.unshift(data.text);
                document.getElementById('data').style.visibility = '';
                var list = document.getElementById('data_list');
                list.innerHTML = '';
                data_list.forEach(function (el) {
                    var n = document.createElement('li');
                    n.innerHTML = el;
                    list.appendChild(n);
                });
            }
            else {
                console.log('unsupported data');
            }
        });
    }
    Client.prototype.connect_show = function () {
        document.getElementById('connect?').style.display = 'none';
        document.getElementById('connector').style.display = '';
        document.getElementById('connector').style.visibility = '';
        document.getElementById("pin_connect").value = '';
        document.getElementById('directions').textContent = "enter other pin";
    };
    Client.prototype.connect_begin = function (inp) {
        if (!inp) {
            console.log('begin!');
            this.socket.emit('pin', { pin: this.pin });
        }
        else {
            var p = document.getElementById(inp).value;
            p = parseInt(p);
            if (typeof p === 'number') {
                console.log('begin!');
                this.socket.emit('pin', { pin: p });
                this.pin = p;
            }
        }
    };
    Client.prototype.send_data = function (inp) {
        if (!this.connected) {
            console.log('not connected');
            return;
        }
        var data = document.getElementById(inp).value;
        this.socket.emit('data', { text: data });
        document.getElementById(inp).value = '';
        document.getElementById('input_send').style.visibility = 'hidden';
        console.log('sent', data);
    };
    return Client;
}());
exports.Client = Client;

},{}],2:[function(require,module,exports){
(function (global){
"use strict";
exports.__esModule = true;
var client_1 = require("./client");
function App(io) {
    return new client_1.Client(io);
}
;
global.window.App = App;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./client":1}]},{},[2]);
