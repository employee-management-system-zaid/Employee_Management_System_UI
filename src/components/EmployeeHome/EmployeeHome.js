import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import styles from './EmployeeHome.module.css';

function EmployeeHome() {
  const [loading, setLoading] = useState(true);
  const [timesheet, setTimesheet] = useState([]);
  const [isTimesheet, setisTimesheet] = useState(true);
  const path = useNavigate();
  const { state } = useLocation(); // to get the data passed while logging in

  useEffect(() => {
    console.log("In Employee Home Page ", state);
    const fetchData = async () => {
      try {
        const response = await axios.get("/getEmployeeTimesheet");
        if (response.data.message === "Unauthorized") {
          path("/login");
        } else if (response.data.message === "No Timesheet found for the this employee") {
          setisTimesheet(false);
          setLoading(false);
        } else if (response.data.timesheet) {
          setTimesheet(response.data.timesheet);
          setLoading(false);
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
      <Header userType={state} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className={`container mt-4 mb-5 ${styles.mainContainer}`}>
            {!isTimesheet && <h5>No Timesheet to display</h5>}
            {isTimesheet && (
              <div className={styles.tableContainer}>
                <table className={`table ${styles.customTable}`}>
                  <thead className="thead-dark">
                    <tr>
                      <th>Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timesheet.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.day}</td>
                        <td>{entry.startTime}</td>
                        <td>{entry.endTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeHome;
