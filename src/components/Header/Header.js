import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header(props) {
  console.log("In Header ", props.userType);
  return (
    <div className={`headerContainer ${styles.headerContainer}`}>
      <h2>Employee Management System</h2>
      <nav>
        <ul className={styles.navList}>
          {props.userType === "Admin" && (
            <>
              <li className={styles.navItem}>
                <NavLink
                  className={styles.navLink}
                  to="/"
                  state={props.userType}
                >
                  Home
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  className={styles.navLink}
                  to="/addEmployee"
                  state={props.userType}
                >
                  Add Employee
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/logout">
                  Logout
                </NavLink>
              </li>
            </>
          )}

          {props.userType !== "Admin" && (
            <>
              <li className={styles.navItem}>
                <NavLink
                  className={styles.navLink}
                  to="/employeeHome"
                  state={props.userType}
                >
                  Home
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/logout">
                  Logout
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
