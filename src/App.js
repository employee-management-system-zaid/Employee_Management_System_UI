import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import Home from "./components/Home/Home";
import Logout from "./components/Logout/Logout";
import EditEmployee from "./components/EditEmployee/EditEmployee";
import EmployeeHome from "./components/EmployeeHome/EmployeeHome";
import ViewEmployee from "./components/ViewEmployee/ViewEmployee";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addEmployee" element={<AddEmployee />} />
        <Route path="/editEmployee" element={<EditEmployee />} />
        <Route path="/viewEmployee" element={<ViewEmployee />} />
        <Route path="/employeeHome" element={<EmployeeHome />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
