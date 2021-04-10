'use strict'

module.exports = (server) => {
  const io = require('socket.io')(server)
  console.log("Socket.io connection is achieved")
  io.on('connection', (socket) => {
    console.log("Socket connection is esablished...")
  })
}