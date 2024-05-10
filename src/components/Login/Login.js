import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../Header/Header";

function Login() {
  const path = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function submit(e) {
    e.preventDefault();

    if (validateForm()) {
      const userCredentials = {
        email,
        password,
      };

      try {
        const response = await axios.post(`/login`, userCredentials);
        if (response.data.message === "Incorrect password") {
          alert("Invalid Credentials");
        } else if (response.data.message === "User not found") {
          alert("User does not exist");
        } else if (response.data.userData) {
          path("/");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <>
      <div className="d-flex mt-4 justify-content-center align-items-center">
        <div id={styles.mainContainer}>
          <form onSubmit={submit} id={`login`}>
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
            <input type="submit" value="Login" />
          </form>
          <div id={styles.signLink}>
            <Link to="/signup">
              Don't have an Account. Click here to Signup{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
