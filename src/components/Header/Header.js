import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <div className={`headerContainer ${styles.headerContainer}`}>
      <h2>Employee Management System</h2>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/">
              Home
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/addEmployee">
              Add Employee
            </NavLink>
          </li>
          {/* <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/signup">
              SignUp
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/login">
              Login
            </NavLink>
          </li> */}
          <li className={styles.navItem}>
            <NavLink className={styles.navLink} to="/logout">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
