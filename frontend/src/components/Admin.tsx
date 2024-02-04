import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import CreateProblem from "./CreateProblem";
import QuizControls from "./QuizControls";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
      <div className="flex h-[90vh] w-full justify-center items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            onChange={(e) => {
              setroomId(e.target.value);
            }}
            type="email"
            placeholder="Enter Room Id"
          />
          <Button
            onClick={() => {
              socket?.emit("createQuiz", {
                roomId: roomId,
              });
              setQuizId(roomId);
            }}
            type="submit"
          >
            Create Room
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <CreateProblem roomId={roomId} socket={socket} />
      <QuizControls socket={socket} roomId={roomId} />
    </div>
  );
};

export default Admin;
