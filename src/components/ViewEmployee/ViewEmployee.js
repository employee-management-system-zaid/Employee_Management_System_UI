import React, { useState, useEffect } from "react";
import styles from "./ViewEmployee.module.css";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../Header/Header";
import OnlyAdminDialogBox from "../OnlyAdminDialogBox/OnlyAdminDialogBox";

function ViewEmployee() {
  const path = useNavigate();
  const [employee, setEmployee] = useState("");
  const [openOnlyAdminDialog, setOpenOnlyAdminDialog] = useState(false);
  const { state } = useLocation(); // to get the data passed when cliked on View Employee from Home page button

  useEffect(() => {
    console.log("Edit Employee From State Before API call", state);
    const fetchData = async () => {
      try {
        const responseData = await fetch("/checkAuth");
        const response = await responseData.json();
        console.log("Checking Auth");
        console.log(response);
        if (response.message === "Unauthorized") {
          path("/login");
          console.log("Please Log in to edit an employee");
        } else {
          if (
            response.message === "User is Authenticated" &&
            response.user.userType != "Admin"
          ) {
            setOpenOnlyAdminDialog(true);
          } else {
            if (state) {
              setEmployee(state);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [path, state]);

  return (
    <>
      {!openOnlyAdminDialog && (
        <div>
          <Header userType="Admin" />
          <div className={`container mt-4 ${styles.mainContainer}`}>
            <div className="row">
              <div className="col-md-6 mx-auto">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Employee Details</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text">FirstName: {employee.firstName}</p>
                    <p className="card-text">LastName:{employee.lastName}</p>
                    <p className="card-text">
                      Phone Number: {employee.phoneNumber}
                    </p>
                    <p className="card-text">Email: {employee.email}</p>
                    <p className="card-text">Age: {employee.age}</p>
                    <p className="card-text">
                      Date Of Joining: {employee.dateOfJoining}
                    </p>
                    <p className="card-text">Title: {employee.title}</p>
                    <p className="card-text">
                      Department: {employee.department}
                    </p>
                    <p className="card-text">
                      Employement Type: {employee.employeeType}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-end">
                    <Link
                      to="/"
                      state="Admin"
                      className="btn btn-outline-primary"
                    >
                      Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <OnlyAdminDialogBox
        open={openOnlyAdminDialog}
        handleClose={() => setOpenOnlyAdminDialog(false)}
        title="Access Denied"
        message="Please log in as an admin to access this page."
        userType="Employee"
      />
    </>
  );
}

export default ViewEmployee;
