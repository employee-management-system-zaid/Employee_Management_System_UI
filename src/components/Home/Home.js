import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";
import Header from "../Header/Header";

function Home() {
  const path = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);
  const [reload, setReload] = useState(false);
  const { state } = useLocation(); // to get the data passed while logging in

  useEffect(() => {
    console.log("In Home Page ", state);
    const fetchData = async () => {
      try {
        const response = await axios.get("/getEmployees");
        if (response.data.message === "Unauthorized") {
          path("/login");
        } else if (response.data.message === "No Employees") {
          setLoading(false);
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
  }, [reload]);

  const handleEdit = (item) => {
    path("/editEmployee", { state: item });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post("/deleteEmployeeById", {
        employeeId: id,
      });

      if (response.data.message === "Unauthorized") {
        path("/login");
      }
      if (response.data.message === "Employee Deleted") {
        setReload(!reload);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header userType={state} />
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
                      <td>
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
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
