"use client";
import { FC, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiService } from "../lib/api/api";
import styles from "./confirm-email.module.scss";

const ConfirmEmailContent: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get("id");

      if (!userId) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      const apiService = new ApiService();
      const isVerified = await apiService.verifyEmail(userId);

      if (isVerified) {
        setStatus("success");
        setMessage("Email verified successfully!");

        // Redirect to home page after 3 seconds
        // setTimeout(() => {
        //   router.push("/");
        // }, 3000);
      } else {
        setStatus("error");
        setMessage("Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles[status]}`}>
          {status === "verifying" && "⏳"}
          {status === "success" && "✓"}
          {status === "error" && "✕"}
        </div>
        <h1>{message}</h1>
        {status === "success" && <p>Redirecting you to the home page...</p>}
        {status === "error" && (
          <button className={styles.button} onClick={() => router.push("/")}>
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

const ConfirmEmail: FC = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={`${styles.icon} ${styles.verifying}`}>⏳</div>
            <h1>Loading...</h1>
          </div>
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
};

export default ConfirmEmail;
