import React from "react";
import styles from "./style.css";
import { ReactComponent as Logo } from "../../images/logo.svg";

const Greeting = () => {
  return (
    <div className={styles.greeting}>
      <Logo className={styles.reactLogo} height={500} width={500} />
      <h1>Let's make web app🚀</h1>
    </div>
  );
};

export default Greeting;
