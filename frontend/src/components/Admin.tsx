import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import CreateProblem from "./CreateProblem";

const Admin = () => {
  const [roomId, setroomId] = useState("");
  const [socket, setSocket] = useState<null | Socket>(null);
  const [quizId, setQuizId] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    // client-side
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD",
      });
    });
  }, []);
  if (!quizId) {
    return (
      <div>
        <input
          type="text"
          onChange={(e) => {
            setroomId(e.target.value);
          }}
        />
        <button
          onClick={() => {
            socket?.emit("createQuiz");
            setQuizId(roomId);
          }}
        >
          Create Room
        </button>
      </div>
    );
  }
  return (
    <div>
      <CreateProblem roomId={roomId} socket={socket} />
    </div>
  );
};

export default Admin;
