Socket.io is a javascript library which works by establishing a web socket connection. WebSocket is a communication protocol that provides full-duplex communication between users.

Socket.io is built around an event-driven architecture. Both the server and the clients can emit and listen for events, allowing for a flexible and modular approach to handling different types of messages.

Server side code for socket will be like below. We can observe that first initialization of socket is we are creating an instance of socket in server, we can do this in another way from docs. Next, we create out io variable from instance with proper options.

```javascript
const express = require("express");
const cors = require("cors");
const socket = require("socket.io");


const app = express();
app.use(express.json());
app.use(cors());

  
const server = app.listen(8080, () => console.log("Connected"));
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

  
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  
  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`user joined: ${socket.id} to room ${data}`);
  });

  socket.on("send-msg", (data) => {
    socket.to(data.room).emit("onreceive-msg", data);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });

});
```

Later after we enabled connection using `connection` namespace we have our socket and we can observe various events, when we write send-msg in client side it checks for the event send-msg in server side and does the function, that is to send data to `data.room` by emitting.

Now for client side, 
```jsx
//Chat.jsx
import { io } from "socket.io-client";
import { useState } from "react";
import Message from "./Message";

  
const socket = io("http://localhost:8080"); //io.connect(host) can also be used

const Chat = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  
  const handleRoom = (event) => {
    event.preventDefault();
    console.log(name);
    socket.emit("join-room", room);
  };

  return (
    <div>
      <form onSubmit={handleRoom}>
      {/*input*/}
        <button type="submit">Join Room</button>
      </form>
      <Message socket={socket} name={name} room={room} />
    </div>
  );
};




//Msg.jsx
import { useState, useEffect, useRef } from "react";

const Message = ({ socket, name, room }) => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const msgRef = useRef();

  const triggerMsg = async () => {
    if (msg !== "") {
      const metaData = {
        room: room,
        author: name,
        message: msg,
      };
      await socket.emit("send-msg", metaData);
    }
  };

  
  useEffect(() => {
    msgRef.current = (data) => {
      setMsgList((prev) => [...prev, data]);
    };
    
    socket.on("onreceive-msg", msgRef.current);
    
    return () => {
      socket.off("onreceive-msg", msgRef.current);
    };
  }, [socket]);

 /**
 another way to tackle re-render
 
  useMemo(() => {
    socket.on("onreceive-msg", (data) => {
      setMsgList((prev) => [...prev, data]);
    });
  }, [socket]);
   
  */

  return (
    <div>
      <div className="header">
        <h3>Live Chat Section</h3>
      </div>
      <div className="body">
        {msgList.map((msg) => {
          return <h1 key={msg.author}>{msg.message}</h1>;
          {/*it's advisable to use uuid to give unique ids for key prop*/}
        })}
      </div>

      <div className="footer">
       {/*input*/}
        <button onClick={triggerMsg}>&#9658;</button>
      </div>
    </div>
  );
};

```

Here we are using msgRef to tackle strict mode in react from pushing a msg twice into msgList, as it discards one state/render. Else we will get each message twice. Also, useMemo can be used to tackle the twice rendering.

#ref 
[scribble-clone](https://github.com/saipavan2702/scribble)



#tips
*There wont be any http request while doing these socket things that's the beauty*
