"use client";
import { useState, useEffect } from "react";
import useAppStore from "./lib/store/app.store";
import useAuthStore from "./lib/store/auth.store";
import useUserStore from "./lib/store/user.store";
import {
  initializeWS,
  setupWebSocketListeners,
} from "./lib/webSockets/webSockets";
import { FundsManager, BetTable, Login } from "./components";

import styles from "./page.module.scss";

export default function Home() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { checkInitialState, isAppLoading } = useAppStore();
  const { balance } = useUserStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [stateBalance, setStateBalance] = useState(balance);

  useEffect(() => {
    if (stateBalance === 0) {
      console.log("$$update initial");
      setStateBalance(balance);
    }
  }, [balance]);

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

  const updateBalance = () => {
    console.log("$$Update balance");
    setStateBalance(balance);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <FundsManager balance={stateBalance} />
        <BetTable balance={stateBalance} updateBalance={updateBalance} />
      </div>
      <div className={styles.content}>{!isLoggedIn && <Login />}</div>
    </div>
  );
}
