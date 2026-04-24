import { useState } from "react";

const Join = ({ socket, setRoom }) => {
  const [roomInput, setRoomInput] = useState("");
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!roomInput || !name) return;

    socket.emit("join_room", roomInput);
    setRoom(roomInput);
  };

  return (
    <div>
      <h2>Entrar no Chat</h2>

      <input
        placeholder="Seu nome"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Sala"
        onChange={(e) => setRoomInput(e.target.value)}
      />

      <button onClick={handleJoin}>Entrar</button>
    </div>
  );
};

export default Join;