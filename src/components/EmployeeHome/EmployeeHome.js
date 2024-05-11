import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";

function EmployeeHome() {
  const path = useNavigate();
  const { state } = useLocation(); // to get the data passed while logging in
  return (
    <>
      <Header userType={state} />
    </>
  );
}

export default EmployeeHome;
