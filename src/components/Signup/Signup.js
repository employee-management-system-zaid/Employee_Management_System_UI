import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";
import Header from "../Header/Header";

function Signup() {
  const path = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("Employee");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!fullName) {
      errors.fullName = "Full Name is required";
    } else if (!/^[^-\s\d][a-zA-Z\s-]+$/.test(fullName)) {
      errors.fullName = "FullName cannot be numeric";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{3}\d{4}\d{3}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be in the format XXXXXXXXXX.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearData = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    // document.getElementById("signUp").reset();
  };

  async function submit(e) {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        fullName,
        email,
        password,
        phoneNumber,
        userType,
      };

      try {
        const response = await axios.post("/signup", userData);
        if (response.data === "Employee Already Exists") {
          clearData();
          alert("Employee Already Exists");
        } 
        else if (response.data === "No Employee found") {
          clearData();
          alert("No Employee found");
        }
        else if (response.data === "Please enter the details you gave to the Employer") {
          clearData();
          alert("Please enter the details you gave to the Employer");
        }
        else if (response.data === "Employee created successfully") {
          path("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <>
      <div id={styles.mainDiv}>
        <div id={styles.mainContainer}>
          <h1>Sign Up</h1>
          <form onSubmit={submit} id={`signUp`}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              name="fullName"
              id="fullName"
              value={fullName}
            />
            {formErrors.fullName && (
              <p className={styles.errorMsg}>{formErrors.fullName}</p>
            )}
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              value={email}
            />
            {formErrors.email && (
              <p className={styles.errorMsg}>{formErrors.email}</p>
            )}
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              name="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
            />
            {formErrors.phoneNumber && (
              <p className={styles.errorMsg}>{formErrors.phoneNumber}</p>
            )}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              value={password}
            />
            {formErrors.password && (
              <p className={styles.errorMsg}>{formErrors.password}</p>
            )}
            <input type="submit" value="Signup" />
          </form>
          <div id={styles.loginLink}>
            <Link to="/login">
              Already have an Account. Click here to Login{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
