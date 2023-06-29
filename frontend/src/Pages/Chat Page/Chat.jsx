import React, { useEffect, useState } from "react";
import "./Chat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import constants from "../../constants/constants";
import axios from "axios";
import ChatUserName from "../../components/chat-user-name/ChatUserName";
import encryptData from "../../security/encrypt"

const Chat = ({ name, roomId, setShowChat, setName, setRoomId, socket }) => {
  const back = () => {
    setName("");
    setRoomId("");
    setShowChat(false);
    const data = {
      room: roomId,
      name,
    };
    socket.emit("leave_room", data);
  };
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState([]);
  const roomName = roomId.toUpperCase();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const timestamp =
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes();
      if (currentMessage.startsWith("#chatgpt")) {
        const messageData = {
          room: roomId,
          author: name,
          message: currentMessage,
          tag:"chatgpt",
          time: timestamp,
        };
        setMessageList((list) => [...list, messageData]);
        socket.emit("send_message", messageData);
        const slicedMessage = currentMessage.slice("#chatgpt".length);
        setCurrentMessage("");
        axios
          .post(
            constants.OPEN_AI_URL,
            {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: `${slicedMessage}` }],
            },
            {
              headers: {
                Authorization: `Bearer ${constants.OPEN_AI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const timestamp =
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes();
            const messageData = {
              room: roomId,
              author: "ChatGPT",
              message: response.data.choices[0].message.content,
              tag:"chatgpt",
              time: timestamp,
            };
            setMessageList((list) => [...list, messageData]);
            socket.emit("send_message", messageData);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const messageData = {
          room: roomId,
          author: name,
          message: currentMessage,
          tag: "user",
          time: timestamp,
        };
        
        const stringMessage = JSON.stringify(messageData);
        const encryptedMessage = encryptData(stringMessage, process.env.PUBLIC_KEY);
        
        socket.emit("send_message", encryptedMessage);
        
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    socket.on("new-user", (users) => {
      setUsers(users);
      console.log(users);
    });
    socket.on("left-user", (users) => {
      setUsers(users);
      console.log(users);
    });
  }, [socket, users]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <>
      <div className="chat-room-parent">
        <div className="chat-room-navbar">
          <p>CampusHive</p>
        </div>
        <div className="chat-room-body">
          <div className="chat-container">
            <div className="chat-header">
              <span>{roomName}</span>
              <button onClick={back}>X</button>
            </div>
            <div className="chat-body">
              <ScrollToBottom className="message-container">
                {messageList &&
                  messageList.map((messageContent, i) => {
                    return (
                      <>
                        <div
                          key={i}
                          className="message"
                          id={name === messageContent.author ? "you" : "other"}
                        >
                          <div className="message-author">
                            {messageContent.author}
                          </div>
                          <div className="message-body">
                            {messageContent.message}
                          </div>
                          <div className="message-time">
                            {messageContent.time}
                          </div>
                        </div>
                      </>
                    );
                  })}
              </ScrollToBottom>
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="To use ChatGPT, use #chatgpt in first....."
                value={currentMessage}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
          <div className="chat-online-box">
            <div className="online-div">Online</div>
            <div className="user-online-area">
              {users &&
                users.map((name, i) => {
                  return <ChatUserName key={i} name={name} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
