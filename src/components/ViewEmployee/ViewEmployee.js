import React, { useState, useEffect } from "react";
import styles from "./ViewEmployee.module.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "../Header/Header";
import OnlyAdminDialogBox from "../OnlyAdminDialogBox/OnlyAdminDialogBox";

function ViewEmployee() {
  const path = useNavigate();
  const [employee, setEmployee] = useState("");
  const [openOnlyAdminDialog, setOpenOnlyAdminDialog] = useState(false);
  const { state } = useLocation(); // to get the data passed when clicked on View Employee from Home page button

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
            response.user.userType !== "Admin"
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
                <div className={`card ${styles.card}`}>
                  <div className={`card-header ${styles.cardHeader}`}>
                    <h5 className={`card-title ${styles.cardTitle}`}>Employee Details</h5>
                  </div>
                  <div className={`card-body ${styles.cardBody}`}>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>First Name:</span> {employee.firstName}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Last Name:</span> {employee.lastName}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Phone Number:</span> {employee.phoneNumber}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Email:</span> {employee.email}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Age:</span> {employee.age}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Date Of Joining:</span> {employee.dateOfJoining}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Title:</span> {employee.title}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Department:</span> {employee.department}
                    </p>
                    <p className={`card-text ${styles.cardText}`}>
                      <span>Employment Type:</span> {employee.employeeType}
                    </p>
                  </div>
                  <div className={`card-footer d-flex justify-content-end ${styles.cardFooter}`}>
                    <Link
                      to="/"
                      state="Admin"
                      className={`btn btn-outline-primary ${styles.btnOutlinePrimary}`}
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
