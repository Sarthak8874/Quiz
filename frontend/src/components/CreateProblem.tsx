import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
const CreateProblem = ({ socket, roomId }: { socket: any; roomId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState([
    {
      id: 0,
      title: "",
    },
    {
      id: 1,
      title: "",
    },
    {
      id: 2,
      title: "",
    },
    {
      id: 3,
      title: "",
    },
  ]);

  return (
    <div className="flex flex-col gap-[20px] p-[40px] pb-[20px]">
      <div className="flex w-[70%] gap-[5px]">
        Title
        <Input
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></Input>
      </div>
      <div className="flex gap-[5px] w-[70%]">
        Desciption
        <Textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></Textarea>
      </div>
      <div className="flex flex-col gap-[10px]">
        {[0, 1, 2, 3].map((optionId) => (
          <div
            className="flex gap-[5px] w-[70%]"
            key={`CreateQuestion_${optionId}`}
          >
            <input
              type="radio"
              checked={answer === optionId}
              onChange={() => setAnswer(optionId)}
            ></input>
            <Input
              type="text"
              onChange={(e) => {
                setOptions((options) =>
                  options.map((x) => {
                    if (x.id == optionId) {
                      return {
                        ...x,
                        title: e.target.value,
                      };
                    }
                    return x;
                  })
                );
              }}
            ></Input>
          </div>
        ))}
      </div>
      <Button
        className="w-[25%]"
        onClick={() => {
          socket?.emit("createproblem", {
            roomId,
            problem: {
              title,
              description,
              options,
              answer,
            },
          });
        }}
      >
        Add Problem
      </Button>
    </div>
  );
};

export default CreateProblem;
