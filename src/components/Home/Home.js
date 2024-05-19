import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Home.module.css";
import Header from "../Header/Header";

function Home() {
  const path = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(true);
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
          setIsEmployee(false);
        } else if (response.data.employees) {
          console.log("No of employees ", response.data.employees);
          setEmployees(response.data.employees);
          console.log(response.data.employees);
          setLoading(false);
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

  const handleView = (item) => {
    path("/viewEmployee", { state: item });
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
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Employee Type</th>
                    <th>Actions</th>
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
                      <td>{item.title}</td>
                      <td>{item.department}</td>
                      <td>{item.employeeType}</td>
                      <td>
                        <button
                          className="btn btn-outline-dark me-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger me-2"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleView(item)}
                        >
                          View
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
