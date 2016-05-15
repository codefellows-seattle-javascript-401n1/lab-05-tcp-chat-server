![cf](https://i.imgur.com/7v5ASc8.png) lab-05-tcp-chat-server
======

[![](https://img.shields.io/badge/Issues%3F-Ask%20for%20Help!-55cbe0.svg)](https://github.com/codefellows/seattle-javascript-401n1/issues/new)
[![Build Status](https://travis-ci.org/codefellows-seattle-javascript-401n1/lab-03-fs-async.svg?branch=master)](https://travis-ci.org/codefellows-seattle-javascript-401n1/lab-03-fs-async)

## To Submit this Assignment
  * fork this repository
  * write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
  * push to your repository
  * submit a pull request to this repository
  * submit a link to your PR in canvas
  * write a question and observation on canvas

## Directions
* Create a TCP Server use using the net module
* Create a ClientPool object constructor module that manages connected sockets 
 * The ClientPool should inherit from node's EventEmitter Constructor on the _events_ module
 * The ClientPool should have a property named `pool` that is of type _object_, for storing references to connected sockets
* When sockets connect to the server they should be added to an instance of ClientPool by emitting a `register` event
* When a socket emits the `close` event the socket should be removed from the ClientPool
* When sockets are registered with the ClientPool they should be given a randomly generated `id` that will be used as their key on the ClientPool's `pool` property, 
 * **e.g.** `user_230948023948` 
* When sockets are registered with the ClientPool they should be given a randomly generated `nickname` that should be used to identify who typed a message in the chat
 * **e.g.** `guest-43`
* When sockets are registered with the ClientPool they should be given event listeners for `data`, `error`, and `close` events
* The ClientPool should have a `broadcast` event that writes a messages to each client on the ClientPool's `pool` property
* When a socket sends a message (emits a data event) to the server, their message should be broadcast to all of the sockets in the ClientPool, by using the ClientPool's `broadcast` event that you created
* Every time a message is written to a socket it should print the `nickname` of the user who wrote the message 
 * **e.g** `guest-43: whats up?`

## Bonus
* **2pts** create an event that will rename a user when they type `\nick new-name` and broadcast to all users the updated name change

