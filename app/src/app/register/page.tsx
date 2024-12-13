"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ApiService } from "../lib/api/api";
import { ApiStatus } from "../lib/api/status";

import styles from "./page.module.css";

const Register = () => {
  const apiService = new ApiService();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [status, setStatus] = useState(0);

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const response = await apiService.registerNewUser({
      username,
      email,
      password: authIdentifier,
    });
    console.log("$tat: ", response);
    setStatus(response);

    if (response === ApiStatus.Created) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };

  const renderTextField = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isPassword?: boolean
  ) => (
    <TextField
      label={label}
      value={value}
      type={isPassword ? "password" : "text"}
      onChange={onChange}
      InputProps={{
        style: {
          color: "white",
          backgroundColor: "#191C2E",
          borderRadius: "12px",
        },
      }}
      InputLabelProps={{
        style: { color: "white" },
      }}
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapperContent}>
        <div className={styles.title}>Lets know you, Anon</div>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { marginBottom: "14px", width: "28ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            {renderTextField("Username", username, (e) =>
              setUsername(e.target.value)
            )}
          </div>
          <div>
            {renderTextField("Email", email, (e) => {
              setEmail(e.target.value);
              setStatus(0);
            })}
          </div>
          <div>
            {renderTextField(
              "Password",
              authIdentifier,
              (e) => setAuthIdentifier(e.target.value),
              true
            )}
          </div>
          {status !== 0 && (
            <div className={styles.status}>
              {status === ApiStatus.ExistingUser && (
                <p className={styles.errorText}>User already exists</p>
              )}
              {status === ApiStatus.Created && (
                <p className={styles.success}>
                  Enroll successful. Redirecting...
                </p>
              )}
              {status === ApiStatus.BadRequest && (
                <p className={styles.errorText}>Error. Please contact us.</p>
              )}
            </div>
          )}
          <button className={styles.submit} onClick={onSubmit}>
            Register
          </button>
        </Box>
      </div>
    </div>
  );
};

export default Register;
