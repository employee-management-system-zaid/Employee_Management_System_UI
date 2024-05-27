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
  const [currentTitle, setCurrentTitle] = useState("All");
  const [currentType, setCurrentType] = useState("All");
  const [currentDepartment, setCurrentDepartment] = useState("All");
  const [filterTitle, setFilterTitle] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const { state } = useLocation(); // to get the data passed while logging in

  const titles = ["All", "Employee", "VP", "Manager", "Director"];
  const departments = ["All", "IT", "Marketing", "Engineering", "HR"];
  const employmentTypes = ["All", "FullTime", "PartTime", "Contract", "Seasonal"];

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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [reload, state, path]);

  useEffect(() => {
    const filteredEmployees = employees.filter((employee) => {
      return (
        (filterTitle === "All" || employee.title === filterTitle) &&
        (filterType === "All" || employee.employeeType === filterType) &&
        (filterDepartment === "All" || employee.department === filterDepartment)
      );
    });
    setIsEmployee(filteredEmployees.length > 0);
  }, [employees, filterTitle, filterType, filterDepartment]);

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

  const handleFilter = () => {
    setFilterTitle(currentTitle);
    setFilterType(currentType);
    setFilterDepartment(currentDepartment);
  };

  const handleClear = () => {
    setCurrentTitle("All");
    setCurrentType("All");
    setCurrentDepartment("All");
    setFilterTitle("All");
    setFilterType("All");
    setFilterDepartment("All");
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      (filterTitle === "All" || employee.title === filterTitle) &&
      (filterType === "All" || employee.employeeType === filterType) &&
      (filterDepartment === "All" || employee.department === filterDepartment)
    );
  });

  return (
    <>
      <Header userType={state} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className={`container mt-4 mb-5 ${styles.mainContainer}`}>
            <div className="row mb-4">
              <div className="col-md-3">
                <label className={styles.filterLabel} htmlFor="titleFilter">Title:</label>
                <select
                  id="titleFilter"
                  className="form-select"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                >
                  {titles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className={styles.filterLabel} htmlFor="typeFilter">Employment Type:</label>
                <select
                  id="typeFilter"
                  className="form-select"
                  value={currentType}
                  onChange={(e) => setCurrentType(e.target.value)}
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className={styles.filterLabel} htmlFor="departmentFilter">Department:</label>
                <select
                  id="departmentFilter"
                  className="form-select"
                  value={currentDepartment}
                  onChange={(e) => setCurrentDepartment(e.target.value)}
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-outline-primary me-2" onClick={handleFilter}>
                  Filter
                </button>
                <button className="btn btn-outline-danger me-2" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>
            {!isEmployee && <h5>No Employees to display</h5>}
            {isEmployee && (
              <>
                {/* Desktop Table */}
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
                    {filteredEmployees.map((item) => (
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

                {/* Mobile Cards */}
                <div className="row d-md-none">
                  {filteredEmployees.map((item) => (
                    <div key={item._id} className={`col-12 ${styles.employeeCard}`}>
                      <div className={styles.cardText}><strong>Name:</strong> {item.firstName} {item.lastName}</div>
                      <div className={styles.cardText}><strong>Email:</strong> {item.email}</div>
                      <div className={styles.cardText}><strong>Phone Number:</strong> {item.phoneNumber}</div>
                      <div className={styles.cardText}><strong>Title:</strong> {item.title}</div>
                      <div className={styles.cardText}><strong>Department:</strong> {item.department}</div>
                      <div className={styles.cardText}><strong>Employee Type:</strong> {item.employeeType}</div>
                      <div className={styles.cardActions}>
                        <button className="btn btn-outline-dark me-2" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn-outline-danger me-2" onClick={() => handleDelete(item._id)}>Delete</button>
                        <button className="btn btn-outline-primary" onClick={() => handleView(item)}>View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
