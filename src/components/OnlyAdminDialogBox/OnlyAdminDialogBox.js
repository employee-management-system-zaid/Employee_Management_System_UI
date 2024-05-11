import React from "react";
import styles from "./OnlyAdminDialogBox.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function OnlyAdminDialogBox({ open, handleClose, title, message, userType }) {
  const path = useNavigate();
  console.log("Dialog ", userType);
  const handleCloseDialog = () => {
    if (userType !== "Admin") {
      // Handle the action for non-admin users, such as redirecting to another page
      path("/employeeHome", { state: userType });
    } else {
      // For admin users, simply close the dialog
      handleClose();
    }
  };

  return (
    open && (
      <div className={styles.overlay}>
        <div className={styles.dialog}>
          <h3>{title}</h3>
          <p>{message}</p>
          <button onClick={handleCloseDialog}>Close</button>
        </div>
      </div>
    )
  );
}

export default OnlyAdminDialogBox;
