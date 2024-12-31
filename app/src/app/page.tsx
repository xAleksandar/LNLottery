"use client";
import { useState, useEffect } from "react";
import useAuthStore from "./lib/store/auth.store";
import useAppStore from "./lib/store/app.store";
import {
  initializeWS,
  setupWebSocketListeners,
} from "./lib/webSockets/webSockets";
import { UI_ROUTES } from "./lib/routes";
import { FundsManager } from "./components";
import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { checkInitialState, isAppLoading } = useAppStore();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = await checkInitialState(checkAuth);
      setUserId(id); // Store the resolved userId
    };

    fetchData();
  }, [checkAuth, checkInitialState]);

  useEffect(() => {
    if (userId) {
      initializeWS(userId);
      setupWebSocketListeners();
    }
  }, [userId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.loadingText}>
          {isLoggedIn ? "Logged in" : "Please log in"}
        </div>
        {!isLoggedIn && (
          <Link href={UI_ROUTES.login}>
            <button className={styles.button}>Log in</button>
          </Link>
        )}
        {isLoggedIn && <FundsManager />}
      </div>
    </div>
  );
}
