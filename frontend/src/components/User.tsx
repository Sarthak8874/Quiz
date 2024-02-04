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
  const [userId, setUserId] = useState(searchParams.get("userId") || "");
  const [roomID, setRoomID] = useState("");
  const Navigate = useNavigate();
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    // client-side
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId: roomId,
        userId: String(localStorage.getItem("userId")),
        name: "Sarthak",
      });
    });
    socket.on("joined", (data) => {
      console.log(data);
    });

    socket.on("init", ({ userId, state }) => {
      setUserId(userId);
      localStorage.setItem("userId", userId);
      if (state.question) {
        setCurrentQuestion(state.question);
      }
      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }

      socket.on("leaderboard", (data) => {
        setCurrentState("leaderboard");
        console.log("dk");
        setLeaderboard(data.leaderboard);
      });
      socket.on("problem", (data) => {
        setCurrentState("problem");
        setCurrentQuestion(data.problem);
      });
      setCurrentState(state.type);
    });
  }, [roomId]);

  if (currentState == "not_started") {
    return (
      <>
        <div>Quiz Not Started</div>
      </>
    );
  }
  if (currentState == "problem") {
    return (
      <>
        <CurrentQuestion question={currentQuestion} />
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
    <div className="flex h-[90vh] w-full justify-center items-center">
      {" "}
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
