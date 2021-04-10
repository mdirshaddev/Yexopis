'use strict'

require('dotenv').config()
const express = require('express')
const http = require('http')
const path = require('path')

class Server{
  constructor(port, app){
    this.port = port
    this.app = app
  }
  socket(){
    const httpServer = http.createServer(this.app)
    require('./socket.io')(httpServer)
  }
  routeGet(url, func){
    this.app.get(url,func)
  }
  routePost(url, func){ 
    this.app.post(url, func)
  }
  frontendServe(){
    this.app.use(express.static(path.join(__dirname, "frontend", "build")))
    this.app.use((req, res) => {
      res.sendFile(path.join(__dirname,"frontend", "build", "index.html"))
    })
  }
  listen(){
    this.app.listen(this.port, ()=>{
      console.log(`Server is up and running at ${this.port}`)
    })
  }
}


const server = new Server(process.env.PORT, express())
server.frontendServe()
server.socket()
server.listen()