"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import { ApiService } from "../lib/api/api";
import { ApiStatus } from "../lib/api/status";
import { InputField, RegisterLine } from "../components";
import { lang } from "../lang/en";
import validator from "validator";
import styles from "./page.module.css";

const Login = () => {
  const apiService = new ApiService();

  const [email, setEmail] = useState("");
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [status, setStatus] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!validator.isEmail(email)) {
      setEmailError(lang.commonInvalidEmail());
      return;
    }
    const response = await apiService.login(email, authIdentifier);
    setStatus(response);
    if (response === ApiStatus.Success) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setStatus(0);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthIdentifier(e.target.value);
    setStatus(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapperContent}>
        <div className={styles.title}>{lang.commonLogYouIn()}</div>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { marginBottom: "14px", width: "28ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <InputField
              label="Email"
              value={email}
              onChange={onEmailChange}
              error={emailError}
            />
          </div>
          <div>
            <InputField
              label="Password"
              value={authIdentifier}
              onChange={onPasswordChange}
              error=""
              isPassword
              showPassword={showPassword}
              onTogglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
          <div className={styles.messageWrapper}>
            {status === ApiStatus.Unauthorized && (
              <span className={styles.error}>
                {lang.commonInvalidEmailOrPassword()}
              </span>
            )}
            {status === ApiStatus.Success && (
              <p className={styles.success}>{lang.commonLoginSuccessful()}</p>
            )}
          </div>
          <button className={styles.submit} onClick={onSubmit}>
            {lang.commonLogin()}
          </button>
        </Box>
        <RegisterLine />
      </div>
    </div>
  );
};

export default Login;
