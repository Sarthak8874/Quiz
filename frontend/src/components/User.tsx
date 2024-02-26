import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import CreateProblem from "./CreateProblem";
import QuizControls from "./QuizControls";
import CurrentQuestion from "./CurrentQuestion";
import Leaderboard from "./Leaderboard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

const User = () => {
  const searchParams = new URLSearchParams(document.location.search);

  const [socket, setSocket] = useState<null | Socket>(null);
  const [currentState, setCurrentState] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(String(localStorage.getItem("userId"))|| "");
  const [roomID, setRoomID] = useState("");
  const Navigate = useNavigate();
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    if(!roomId){
      return;
    }
    socket.on("connect", () => {
      socket.emit("join", {
        roomId: roomId,
        userId: userId,
        name: name,
      });
    
      
    });
    socket.on("init", ({ userId, state }) => {

      setUserId(userId);
      localStorage.setItem("userId", userId);
      if (state.problem) {
        setCurrentState("problem");
        setCurrentQuestion(state.problem);
      }
      if (state.leaderboard) {
        setCurrentState("leaderboard");
        setLeaderboard(state.leaderboard);
      }
     
      setCurrentState(state.type);
    });
    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      console.log("dk");
      setLeaderboard(data.leaderboard);
    });
    socket.on("problem", (data) => {
      setCurrentState("problem");
      setCurrentQuestion(data.problem);
    });
   
  }, [roomId]);
  
  if (currentState == "not_started") {
    return (
      <>
        <div>Quiz Not Started</div>
      </>
    );
  }
  if (currentState == "problem" && roomId && socket) {
    return (
      <>
        <CurrentQuestion roomId={roomId} userId = {userId} socket={socket} question={currentQuestion} />
      </>
    );
  }
  if (currentState === "leaderboard") {
    return (
      <>
        <Leaderboard leaderboard={leaderboard} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-[20px] h-[90vh] w-full justify-center items-center">
      {" "}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Enter Your Name"
        />
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          onChange={(e) => {
            setRoomID(e.target.value);
          }}
          type="text"
          placeholder="Enter Room ID"
        />
        <Button
          onClick={() => {
            Navigate(`/user?roomId=${roomID}`);
          }}
          type="submit"
        >
          Join Room
        </Button>
      </div>
    </div>
  );
};

export default User;
