import React, { useState, useEffect } from "react";
import styles from "./AddEmployee.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import OnlyAdminDialogBox from "../OnlyAdminDialogBox/OnlyAdminDialogBox";

export default function AddEmployee() {
  const path = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [openOnlyAdminDialog, setOpenOnlyAdminDialog] = useState(false);
  const { state } = useLocation(); // to get the data passed when cliked on Add Employee from navlink in Header

  useEffect(() => {
    console.log("Add Employee From State Before API call", state);
    const fetchData = async () => {
      try {
        const responseData = await fetch("/checkAuth");
        const response = await responseData.json();
        console.log("Checking Auth");
        console.log(response);
        if (response.message === "Unauthorized") {
          path("/login");
          console.log("Please Log in to add an employee");
        } else if (
          response.message === "User is Authenticated" &&
          response.user.userType != "Admin"
        ) {
          setOpenOnlyAdminDialog(true);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    };
    fetchData();
  }, [path, state]);

  const validateForm = () => {
    const errors = {};

    if (!firstName) {
      errors.firstName = "First Name is required.";
    } else if (!/^[^-\s\d][a-zA-Z\s-]+$/.test(firstName)) {
      errors.firstName = "First Name must contain only alphabetic characters.";
    }

    if (!lastName) {
      errors.lastName = "Last Name is required.";
    } else if (!/^[^-\s\d][a-zA-Z\s-]+$/.test(lastName)) {
      errors.lastName = "Last Name must contain only alphabetic characters.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{3}\d{4}\d{3}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be in the format XXXXXXXXXX.";
    }

    if (!age) {
      errors.age = "Age is required.";
    } else if (age < 20 || age > 70) {
      errors.age = "Age must be between 20 and 70.";
    }

    if (!dateOfJoining) {
      errors.dateOfJoining = "Date of Joining is required.";
    }

    if (!title) {
      errors.title = "Title is required.";
    }

    if (!department) {
      errors.department = "Department is required.";
    }

    if (!employeeType) {
      errors.employeeType = "Employee Type is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearData = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setDateOfJoining("");
    setTitle("");
    setDepartment("");
    setEmployeeType("");
    setFormErrors({});
  };

  const handleCancel = () => {
    path("/", { state: state });
  };

  async function submit(e) {
    e.preventDefault();

    if (validateForm()) {
      const employee = {
        firstName,
        lastName,
        email,
        phoneNumber,
        age,
        dateOfJoining,
        title,
        department,
        employeeType,
      };

      try {
        console.log("Clikedd on submit");
        const response = await axios.post("/addEmployee", employee);
        console.log("Employee Added Response");
        if (response.data === "Employee Exists") {
          clearData();
          alert("Employee already Exits");
        } else if (response.data === "Employee Added successfully") {
          path("/", { state: state });
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  }
  return (
    <div>
      {!openOnlyAdminDialog && (
        <div>
          <Header userType="Admin" />
          <h2 className="text-center mt-4">Add Employee</h2>
          <form onSubmit={submit} className={styles.formContainer}>
            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className={`form-control ${styles.customInput}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {formErrors.firstName && (
                <p className={styles.errorMsg}>{formErrors.firstName}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className={`form-control ${styles.customInput}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {formErrors.lastName && (
                <p className={styles.errorMsg}>{formErrors.lastName}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="number"
                name="phoneNumber"
                id="phoneNumber"
                className={`form-control ${styles.customInput}`}
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
              />
              {formErrors.phoneNumber && (
                <p className={styles.errorMsg}>{formErrors.phoneNumber}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                className={`form-control ${styles.customInput}`}
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              {formErrors.email && (
                <p className={styles.errorMsg}>{formErrors.email}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                name="age"
                id="age"
                className={`form-control ${styles.customInput}`}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              {formErrors.age && (
                <p className={styles.errorMsg}>{formErrors.age}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="dateOfJoining">Date Of Joining:</label>
              <input
                type="date"
                name="dateOfJoining"
                id="dateOfJoining"
                className={`form-control ${styles.customInput}`}
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
              />
              {formErrors.dateOfJoining && (
                <p className={styles.errorMsg}>{formErrors.dateOfJoining}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="title">Title:</label>
              <select
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`form-control ${styles.customInput}`}
              >
                <option value="" disabled>
                  Select Title
                </option>
                <option value="Employee">Employee</option>
                <option value="VP">VP</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
              </select>
              {formErrors.title && (
                <p className={styles.errorMsg}>{formErrors.title}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="department">Department:</label>
              <select
                name="department"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`form-control ${styles.customInput}`}
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
              </select>
              {formErrors.department && (
                <p className={styles.errorMsg}>{formErrors.department}</p>
              )}
            </div>

            <div className={`form-group ${styles.formGroup}`}>
              <label htmlFor="employeeType">Employee Type:</label>
              <select
                name="employeeType"
                id="employeeType"
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                className={`form-control ${styles.customInput}`}
              >
                <option value="" disabled>
                  Select Employee Type
                </option>
                <option value="FullTime">FullTime</option>
                <option value="PartTime">PartTime</option>
                <option value="Contract">Contract</option>
                <option value="Seasonal">Seasonal</option>
              </select>
              {formErrors.employeeType && (
                <p className={styles.errorMsg}>{formErrors.employeeType}</p>
              )}
            </div>

            <div className={`text-center ${styles.buttonGroup}`}>
              <input
                type="submit"
                value="Create"
                className={`btn btn-outline-primary ${styles.saveButton}`}
              />
              <button
                type="button"
                onClick={handleCancel}
                className={`btn btn-outline-danger ${styles.cancelButton}`}
              >
                Cancel
              </button>
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
    </div>
  );
}
