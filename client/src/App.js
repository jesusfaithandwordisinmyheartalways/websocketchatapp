

import React from 'react'
import { io } from 'socket.io-client'
import {useState} from 'react'
import {useEffect} from 'react'
import './Components/app.css'



  const socket = io('http://localhost:6003')  // establishes a WebSocket connection to a server using the Socket.IO library
 


   function App() {
    const [userMessage, setUserMessage] = useState(""); // to store the current message input by the user
    const [chatMessage, setChatMessage] = useState([]); //  to store an array of chat messages.
        

    useEffect(() => {   //  listens for incoming "message" events from the server updates the chatMessage state by appending the new message with a default type.
          socket.on('message', (newMessage) => {
          setChatMessage((currentData) => [...currentData, {...newMessage, type: 'default'}] )
      })


      socket.on('alert', (alertMessage) => { // listens for an "alert" event from the server,clears the chatMessage state.
          alert(alertMessage)
          setChatMessage([])
      })

      socket.on('reset', () => {    //  listens for a "reset" event from the server ,  clears the chatMessage state
          setChatMessage([])
      })


    return () => {
          socket.off('message')
          socket.off('alert')
          socket.off('reset')
    };
    
  }, []);





  const sendChatMessage = () => { //send a chat message by creating a user message object, updating the local chat message state, emitting the message to the server via the WebSocket, and clearing the input field.
      if(userMessage.trim()) {
           const userResponse = {text: userMessage, timestamp: new Date(), type: 'user' }
           setChatMessage((currentData) => [...currentData, userResponse])
            socket.emit('userResponse', userResponse)
            setUserMessage("")
           }

      }




      return (
        <>

          <div className='Chat-Container'>


            <div className="Chat-Wrapper">
                <div><h3>User Chat App</h3></div>
            </div>



                
            <div className="Chat-Wrapper-Two">
               <div className="para-text">
                  {chatMessage.map((data, index) => {
                    return <div key={index} className={`message-container ${data.type === 'user' ? 'user-message' : 'default-message'}`}>
                        <p>{data.text}</p>
                        <span>{new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  })}
               </div>


            </div>




            <div className="Chat-Wrapper-Three">
                  <div><input onChange={(e) => setUserMessage(e.target.value)} type='text' value={userMessage} placeholder="Enter Message"></input></div>
                  <div onClick={sendChatMessage}><button>Send</button></div>


            </div>




          </div>




        </>
      )


      
  }




  export default App

