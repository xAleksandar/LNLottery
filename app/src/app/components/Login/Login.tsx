import Link from "next/link";
import { UI_ROUTES } from "../../lib/routes";
import { RegisterLine } from "../";

import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperContent}>
        <div className={styles.title}>{"Welcome to LN Games"}</div>
        <div className={styles.subTitle}>
          {"Please log in to access your account."}
        </div>
        <Link href={UI_ROUTES.login}>
          <button className={styles.button}>Log in</button>
        </Link>
        <RegisterLine />
      </div>
    </div>
  );
};

export default Login;
