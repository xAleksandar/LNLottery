import Link from "next/link";
import { lang } from "../../lang/en";

import styles from "./RegisterLine.module.css";

const RegisterLine = () => (
  <div>
    <div className={styles.midline}>
      <div className={styles.line} />
      <div className={styles.text}>{lang.commonOr()}</div>
      <div className={styles.line} />
    </div>
    <div className={styles.register}>
      {lang.commonNoAccount()} &nbsp;
      <Link className={styles.registerLink} href="/register">
        {lang.commonRegister()}
      </Link>
    </div>
  </div>
);

export default RegisterLine;
