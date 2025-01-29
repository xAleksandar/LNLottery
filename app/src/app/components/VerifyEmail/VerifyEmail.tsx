import { FC } from "react";
import { ApiService } from "@/app/lib/api/api";
import styles from "./VerifyEmail.module.scss";

const VerifyEmail: FC = () => {
  const apiService = new ApiService();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Email Verification Required</h2>
        <p>Please check your email for the verification link.</p>
        <a
          href="#"
          onClick={() => {
            apiService.resendEmail();
          }}
          style={{
            cursor: "pointer",
            color: "#3bb0ff",
            textDecoration: "underline",
            marginTop: "10px",
          }}
        >
          Resend Email
        </a>
      </div>
    </div>
  );
};

export default VerifyEmail;
