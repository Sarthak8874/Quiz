import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-[90vh] w-full justify-center items-center gap-[20px]">
      <Button onClick={() => navigate("/user")} variant="outline">
        Join Room
      </Button>
      <Button onClick={() => navigate("/admin")} variant="outline">
        Create Room
      </Button>
    </div>
  );
};

export default Home;
