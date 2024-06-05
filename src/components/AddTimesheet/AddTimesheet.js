import React, { useState, useEffect } from "react";
import styles from "./AddTimesheet.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import OnlyAdminDialogBox from "../OnlyAdminDialogBox/OnlyAdminDialogBox";

function AddTimesheet() {
  const path = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isTimesheet, setIsTimesheet] = useState(true);
  const [isEmployee, setIsEmployee] = useState(true);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [employeeId, setEmployeeId] = useState(""); 
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewTimesheetAdded, setIsNewTimesheetAdded] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { state } = useLocation(); // to get the data passed when clicked on Add Timesheet from navlink in Header
  const [openOnlyAdminDialog, setOpenOnlyAdminDialog] = useState(false);

  useEffect(() => {
    console.log("Add Timesheet From State Before API call", state);
    const fetchData = async () => {
      try {
        const responseData = await fetch("/checkAuth");
        const response = await responseData.json();
        if (response.message === "Unauthorized") {
          path("/login");
        } 
        else if (response.message === "User is Authenticated" && response.user.userType !== "Admin") {
          setOpenOnlyAdminDialog(true);
        } 
        else if (response.message === "User is Authenticated" && response.user.userType === "Admin") {
            const response = await axios.get("/getTimesheet");
               if(response.data.message === "No Timesheet")
                {
                  setLoading(false);
                  setIsTimesheet(false);
                }
                else if(response.data.allTimesheets){
                  setTimesheet(response.data.allTimesheets);
                  setLoading(false);
                }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [path, state, isNewTimesheetAdded]);

  const handleSelectEmployee = async () => {
    const result = await axios.get("/getEmployees");
    if (result.data.employees) {
        setEmployees(result.data.employees);
        if (result.data.employees.length <= 0) {
          setIsEmployee(false);
        }
      }
  };

  const validateForm = () => {
    const errors = {};
    if (!day) errors.day = "Day is required.";
    if (!startTime) errors.startTime = "Start Time is required.";
    if (!endTime) errors.endTime = "End Time is required.";
    if (!employeeId) errors.employeeId = "You must select an employee.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearData = () => {
    setDay("");
    setStartTime("");
    setEndTime("");
    setEmployeeId("");
    setFormErrors({});
  };

  const handleCancel = () => {
    path("/", { state: "Admin" });
  };

  async function submit(e) {
    e.preventDefault();
    if (validateForm()) {
        const timesheet = {
          day,
          startTime,
          endTime,
          employeeId: employeeId,
        };
        try {
          const response = await axios.post("/addTimesheet", timesheet);
          if (response.data.message === "Same Employee Already added for same time") {
            clearData();
            alert("Same Employee Already added for same time");
          } else if (response.data.message === "Timesheet added successful") {
            clearData();
            setIsNewTimesheetAdded(true);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Something went wrong. Please try again.");
        }
    }
  }

  return (
    <>
     {!openOnlyAdminDialog && (
        <div>
            <Header userType="Admin" />
            {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.container}>
        <h2 className="text-center">Timesheet Entries</h2>
        {!isTimesheet && <h5>No Timesheet to display</h5>}
        {isTimesheet && (
        <div className={`container mt-4 mb-5 ${styles.mainContainer}`}>
        <table className={`table table-bordered ${styles.customTable}`}>
            <thead className="thead-dark">
                <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Employee</th>
                </tr>
            </thead>
            <tbody>
                {timesheet.map((timesheet) => (
                    <tr key={timesheet.id}>
                        <td>{timesheet.date}</td>
                        <td>{timesheet.startTime}</td>
                        <td>{timesheet.endTime}</td>
                        <td>{timesheet.employeeName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>)}

        <form onSubmit={submit}>
           <div className="text-center"> <h2>Add Timesheet</h2></div>
           <div className={`d-flex ${styles.formContainer}`}>
            <div className="form-group m-2">
                <input
                    type="date"
                    name="day"
                    id="day"
                    className="form-control"
                    value={day}
                    placeholder="Day"
                    onChange={(e) => setDay(e.target.value)}
                />
                {formErrors.day && (
                    <p className={styles.errorMsg}>{formErrors.day}</p>
                )}
            </div>

            <div className="form-group m-2">
                <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className="form-control"
                    value={startTime}
                    placeholder="Start Time"
                    onChange={(e) => setStartTime(e.target.value)}
                />
                {formErrors.startTime && (
                    <p className={styles.errorMsg}>{formErrors.startTime}</p>
                )}
            </div>

            <div className="form-group m-2">
                <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    className="form-control"
                    value={endTime}
                    placeholder="End Time"
                    onChange={(e) => setEndTime(e.target.value)}
                />
                {formErrors.endTime && (
                    <p className={styles.errorMsg}>{formErrors.endTime}</p>
                )}
            </div>

            <div className="form-group m-2">
                <select
                    name="employeeId"
                    id="employeeId"
                    value={employeeId}
                    onClick={handleSelectEmployee}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="form-control"
                >
                    <option value="" disabled>
                        Select Employee
                    </option>
                    {employees.map((employee) => (
                        <option key={employee._id} value={employee.employeeId}>
                            {employee.firstName + " " + employee.lastName}
                        </option>
                    ))}
                </select>
                {formErrors.employeeId && (
                    <p className={styles.errorMsg}>{formErrors.employeeId}</p>
                )}
            </div>

            <div className={`d-flex align-items-center ${styles.buttonContainer}`}>
                <button type="submit" className="btn btn-outline-primary me-2">Add</button>
                <button type="button" onClick={clearData} className="btn btn-outline-dark me-2">Clear</button>
                <button type="button" onClick={handleCancel} className="btn btn-outline-danger ">Cancel</button>
            </div>
          </div>  
        </form>
    </div>
      )}
            
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

