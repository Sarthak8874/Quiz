import { useEffect } from "react";
import { io } from "socket.io-client";



const Admin = () => {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    // client-side
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      socket.emit("joinAdmin",{
        password:"ADMIN_PASSWORD",
      })
    });

  }, []);
  return <div>Admin</div>;
};

export default Admin;
