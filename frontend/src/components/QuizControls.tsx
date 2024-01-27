import React from "react";

const QuizControls = ({ socket, roomId }: { socket: any; roomId: string }) => {
  return (
    <>
      <div>QuizControls</div>
      <button onClick={()=>{
        socket.emit("next",{
            roomId
        })
      }}>Next Problem</button>
    </>
  );
};

export default QuizControls;
