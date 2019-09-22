import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const params = queryString.parse(location.search);

    socket = io(ENDPOINT);

    socket.emit('join', params, (error) => {
      if(error) {
        alert(error);
      }
    });

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({room, users}) => {
      console.log(room, users)
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    socket.emit('sendMessage', message, () => setMessage(''));
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar />
          <Messages messages={messages} />
          <Input sendMessage={sendMessage} setMessage={setMessage} message={message}/>
      </div>
    </div>
  );
}

export default Chat;
