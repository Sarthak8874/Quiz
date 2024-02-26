import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Socket } from "socket.io-client";

const CurrentQuestion = ({
  question,
  socket,
  userId,
  roomId
}: {
  question: any;
  socket: Socket;
  userId: string;
  roomId:string;
}) => {
  const [answer, setAnswer] = useState(null);
  console.log(question);
  return (
    <>
      <div className="flex flex-col gap-[20px] p-[40px] pb-[20px]">
        <div className="flex justify-center w-[70%] gap-[5px]">
          <div>{question.title}</div>
        </div>
        <div className="flex gap-[5px] w-[70%]">Q : {question.description}</div>
        <div className="flex flex-col gap-[10px]">
          {question.options.map((optionId: any) => (
            <div
              className="flex gap-[5px] w-[70%]"
              key={`CreateQuestion_${optionId.id}`}
            >
              <input
                type="radio"
                checked={answer === optionId.id}
                onChange={() => setAnswer(optionId.id)}
              ></input>
              <Input type="text" disabled={true} value={optionId.title}></Input>
            </div>
          ))}
        </div>
        <Button
          className="w-[25%]"
          onClick={() => {
            socket.emit("submit", {
              userId:userId,
              roomId:roomId,
              problemId:question.id,
              submission:answer
            });
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

export default CurrentQuestion;
