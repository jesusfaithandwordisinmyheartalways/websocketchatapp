


const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const { Server }  = require('socket.io')

const app = express()
dotenv.config() // loads environment variables from a .env file 
app.use(cors()) // allows the backend server to communicate with the frontend


const backendServer = http.createServer(app) //creates an HTTP server using the http.createServer method, 

const io = new Server(backendServer, { //  initializes a new Socket.IO server, attaching it to the backendServer and configuring Cross-Origin Resource Sharing (CORS) 
    cors: {
        origin: 'http://localhost:6002',
        methods: ["GET", "POST"]
    }
})




const ChatMessages = [
    {text: 'How can we help you', timestamp: new Date() },
    {text:  "Did you want to talk with our support team?", timestamp: new Date() },
    {text:  "Great, one of our members will contact you through email.", timestamp: new Date() }
];





io.on('connection', (socket) => { //  sets up an event listener on the Socket.IO server to handle new client connections
     console.log('user has connected', socket.id)

     let step = 0; //  tracks the current index of the ChatMessages array to manage the flow of messages sent to the client.
     socket.emit('message', {...ChatMessages[step], timestamp: new Date() })

     socket.on('userResponse', () => {
        step += 1
        if(step < ChatMessages.length) {
            setTimeout(() => {
                socket.emit('message', {...ChatMessages[step], timestamp: new Date() })
            }, 100)
        } else {
                setTimeout(() => {
                    socket.emit('alert', 'Our contact team will call with you')
                    step = 0
                    socket.emit('reset')
                }, 900)
        }
     })


        socket.on('disconnect', () => {
                console.log('user has disconnect', socket.id)
        })


})




    const PORT = process.env.PORT || 6003
    backendServer.listen(PORT, () => {
            console.log(`Backend server is on port number: ${PORT}`)
    })