import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";
import Header from "../Header/Header";

function Home() {
  const path = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/getEmployees");

        if (response.data.message === "Unauthorized") {
          path("/login");
        } else if (response.data.message === "No Employees") {
          setLoading(false);
          setIsEmployee(false);
        } else if (response.data.employees) {
          setEmployees(response.data.employees);
          console.log(response.data.employees);
          setLoading(false);
          setIsEmployee(true);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className={`container mt-4 mb-5 ${styles.mainContainer}`}>
            {!isEmployee && <h5>No Employees to display</h5>}
            {isEmployee && (
              <table className={`table table-bordered ${styles.customTable}`}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Age</th>
                    <th>Date of Joining</th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Employee Type</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((item, index) => (
                    <tr key={item._id}>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{item.age}</td>
                      <td>{item.dateOfJoining}</td>
                      <td>{item.title}</td>
                      <td>{item.department}</td>
                      <td>{item.employeeType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
