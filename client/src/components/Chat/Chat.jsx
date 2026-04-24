import style from "./Chat.module.css";

import { Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";

const Chat = ({ socket, room }) => {
  const [messageList, setMessageList] = useState([]);

  const bottomRef = useRef(null);
  const messageRef = useRef(null);

  // 🔌 Receber mensagens do servidor
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((current) => [...current, data]);
    });

    if (messageRef.current) {
      messageRef.current.focus();
    }

    return () => socket.off("receive_message");
  }, [socket]);

  // 📩 Enviar mensagem
  const handleSubmit = () => {
    const message = messageRef.current.value;

    if (!message.trim()) return;

    const messageData = {
      text: message,
      room: room,
      author: socket.id,
      authorId: socket.id,
    };

    socket.emit("send_message", messageData);

    // adiciona a própria mensagem na tela
    setMessageList((current) => [...current, messageData]);

    messageRef.current.value = "";
    messageRef.current.focus();
  };

  // ⌨️ Enter para enviar
  const getEnterKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // 🔽 Scroll automático
  const scrollDown = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollDown();
  }, [messageList]);

  return (
    <div className={style.chat_container}>
      <div className={style.chat_body}>
        {messageList.map((message, index) => (
          <div
            key={index}
            className={`${style.message_container} ${
              message.authorId === socket.id && style.message_mine
            }`}
          >
            <div className={style.message_author}>
              <strong>
                {message.authorId === socket.id ? "Você" : message.author}
              </strong>
            </div>

            <div className={style.message_text}>{message.text}</div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className={style.chat_footer}>
        <Input
          inputRef={messageRef}
          placeholder="Mensagem"
          onKeyDown={getEnterKey}
          fullWidth
        />

        <SendIcon
          sx={{ m: 1, cursor: "pointer" }}
          style={{ color: "#129d93" }}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Chat;