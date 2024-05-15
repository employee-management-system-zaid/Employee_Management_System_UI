import React, { useState, useEffect } from "react";
import styles from "./AddTimesheet.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import OnlyAdminDialogBox from "../OnlyAdminDialogBox/OnlyAdminDialogBox";

function AddTimesheet() {

    const path = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isEmployee, setIsEmployee] = useState(true);
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(""); 
    const [formErrors, setFormErrors] = useState({});
    const { state } = useLocation(); // to get the data passed when cliked on Add Timesheet from navlink in Header
    const [openOnlyAdminDialog, setOpenOnlyAdminDialog] = useState(false);

    useEffect(() => {
        console.log("Add Timesheet From State Before API call", state);
        const fetchData = async () => {
          try {
            console.log("1")
            const responseData = await fetch("/checkAuth");
            const response = await responseData.json();
            console.log("Checking Auth");
            console.log(response);
            if (response.message === "Unauthorized") {
                console.log("2")
              path("/login");
              console.log("Please Log in to add a timesheet");
            } else if (response.message === "User is Authenticated" && response.user.userType != "Admin") {
                console.log("3")
              setOpenOnlyAdminDialog(true);
            }
          } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
          }
        };
        fetchData();
      }, [path, state]);

      const handleSelectEmployee= async()=>{
        const result = await axios.get("/getEmployees");
        if (result.data.employees) {
            console.log("4")
            console.log("No of employees ", result.data.employees);
            setEmployees(result.data.employees);
            console.log(result.data.employees);
            if (result.data.employees.length <= 0) {
                console.log("5")
              setIsEmployee(false);
            }
          }
      }

      const validateForm = () => {
        const errors = {};
    
        if (!day) {
          errors.day = "Day is required.";
        } 
    
        if (!startTime) {
          errors.startTime = "Start Time is required.";
        }
    
        if (!endTime) {
          errors.endTime = "End Time is required.";
        }
    
        if (!selectedEmployee) {
          errors.selectedEmployee = "You must select an employee.";
        }
    
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };


      const handleCancel = () => {
        path("/", { state: "Admin" });
      };
    
      async function submit(e) {
        e.preventDefault();
    
        if (validateForm()) {
          
            console.log("Timesheet Added ",selectedEmployee)
          
        }
      }


  return (
    <>
     {!openOnlyAdminDialog && (
        <div>
            <Header userType="Admin" />
            <form onSubmit={submit} className={styles.formContainer}>
            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="day">Day:</label>
              <input
                type="date"
                name="day"
                id="day"
                className={`form-control ${styles.customInput}`}
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              {formErrors.day && (
                <p className={styles.errorMsg}>{formErrors.day}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                className={`form-control ${styles.customInput}`}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              {formErrors.startTime && (
                <p className={styles.errorMsg}>{formErrors.startTime}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                className={`form-control ${styles.customInput}`}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {formErrors.endTime && (
                <p className={styles.errorMsg}>{formErrors.endTime}</p>
              )}
            </div>


            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="selectedEmployee">Select Employee:</label>
              <select
                name="selectedEmployee"
                id="selectedEmployee"
                value={selectedEmployee}
                onClick={handleSelectEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className={`form-control ${styles.customInput}`}
              >
                <option value="" disabled>
                  Select Employee
                </option>
                {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                    {employee.firstName + " " + employee.lastName}
                    </option>
                ))}
              </select>
              {formErrors.selectedEmployee && (
                <p className={styles.errorMsg}>{formErrors.selectedEmployee}</p>
              )}
            </div>

            <div className={`text-center ${styles.buttonGroup}`}>
              <input type="submit" value="Save" className={`btn btn-outline-primary ${styles.saveButton}`}/>
              <button type="button" onClick={handleCancel} className={`btn btn-outline-danger ${styles.cancelButton}`}>Cancel</button>
            </div>
          </form>
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
  )
}

export default AddTimesheet;
