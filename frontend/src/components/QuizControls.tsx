import React from "react";
import { Button } from "../components/ui/button";

const QuizControls = ({ socket, roomId }: { socket: any; roomId: string }) => {
  return (
    <>
      <div className="flex flex-col px-[40px]">
        <Button
         className="w-[25%]"
          onClick={() => {
            socket.emit("next", {
              roomId,
            });
          }}
        >
          Next Problem
        </Button>
      </div>
    </>
  );
};

export default QuizControls;
