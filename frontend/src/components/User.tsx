import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import CreateProblem from "./CreateProblem";
import QuizControls from "./QuizControls";
import CurrentQuestion from "./CurrentQuestion";
import Leaderboard from "./Leaderboard";

const User = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [currentState, setCurrentState] = useState("not_started");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [userId, setUserId] = useState("");

  const searchParams = new URLSearchParams(document.location.search);
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    // client-side
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId: roomId,
        name: "Sarthak",
      });
    });

    socket.on("init", ({ userId, state }) => {
      setUserId(userId);
      console.log(state);
      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }
      if (state.question) {
        setCurrentQuestion(state.question);
      }

      socket.on("leaderboard", (data) => {
        setCurrentState("leaderboard");
        setLeaderboard(data.leaderboard);
      });
      socket.on("problem", (data) => {
        setCurrentState("problem");
        setCurrentQuestion(data.problem);
      });
      setCurrentState(state.type);
    });
  }, []);
  console.log(currentState)
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
  return <div>User</div>;
};

export default User;
