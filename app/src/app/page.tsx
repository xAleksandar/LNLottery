"use client";
import { useState, useEffect } from "react";
import useAppStore from "./lib/store/app.store";
import useAuthStore from "./lib/store/auth.store";
import useUserStore from "./lib/store/user.store";
import {
  initializeWS,
  setupWebSocketListeners,
} from "./lib/webSockets/webSockets";
import {
  FundsManager,
  Login,
  VerifyEmail,
  LogoutButton,
  BetTable,
} from "./components";

import styles from "./page.module.scss";

export default function Home() {
  const { isLoggedIn, isEmailVerified, checkAuth } = useAuthStore();
  const { checkInitialState } = useAppStore();
  const { balance } = useUserStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [stateBalance, setStateBalance] = useState(balance);

  useEffect(() => {
    if (stateBalance === 0) {
      setStateBalance(balance);
    }
  }, [balance, stateBalance]);

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
    setStateBalance(balance);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <FundsManager balance={stateBalance} />
        <BetTable balance={stateBalance} updateBalance={updateBalance} />
      </div>
      <div className={styles.content}>
        {!isEmailVerified && <VerifyEmail />}
        {isLoggedIn ? <LogoutButton /> : <Login />}
      </div>
    </div>
  );
}
