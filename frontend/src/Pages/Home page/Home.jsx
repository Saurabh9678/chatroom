import React, { useState } from "react";
import Chat from "../Chat Page/Chat";

const Home = ({ socket }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showChat, setShowChat] = useState(false);

  const submit = () => {
    if (name !== "" && roomId !== "") {
      const data = {
        room: roomId,
        name: name,
      };
      socket.emit("join_room", data);
      setShowChat(true);
    } else alert("Please give name and roomid to join");
  };

  return (
    <>
      {!showChat ? (
        <div className="join-chat">
          <h1>Join chat </h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="room id"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />

          <button onClick={submit}>Join Room</button>
        </div>
      ) : (
        <Chat
          name={name}
          roomId={roomId}
          setShowChat={setShowChat}
          setName={setName}
          setRoomId={setRoomId}
          socket={socket}
        ></Chat>
      )}
    </>
  );
};

export default Home;
