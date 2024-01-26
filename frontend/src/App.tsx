import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import User from "./components/User";
import Admin from "./components/Admin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Admin/>}>
          <Route path="admin" element = {<Admin/>}/>
          <Route path = "user" element = {<User/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
