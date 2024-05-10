import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Home from "./components/Home/Home";
import Logout from "./components/Logout/Logout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addEmployee" element={<AddEmployee />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
