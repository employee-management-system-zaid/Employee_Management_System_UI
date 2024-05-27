import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`headerContainer ${styles.headerContainer}`}>
      <h2>Employee Management System</h2>
      <nav className={`${styles.nav} ${isOpen ? styles.openMenu : ""}`}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <div className={styles.iconLine}></div>
          <div className={styles.iconLine}></div>
          <div className={styles.iconLine}></div>
        </div>
        {isOpen && (
          <div className={styles.closeIcon} onClick={toggleMenu}>
            X
          </div>
        )}
        <ul className={styles.navList}>
          {props.userType === "Admin" && (
            <>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/" state={props.userType}>Home</NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/addEmployee" state={props.userType}>Add Employee</NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/addTimesheet" state={props.userType}>Add Timesheet</NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/logout">Logout</NavLink>
              </li>
            </>
          )}

          {props.userType !== "Admin" && (
            <>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/employeeHome" state={props.userType}>Home</NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink className={styles.navLink} to="/logout">Logout</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
