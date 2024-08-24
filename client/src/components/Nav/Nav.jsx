import React, { useContext, useEffect } from "react";
import styles from "./Nav.module.css";
import logo from "../../assets/Logo/logo.png";
import { CoinFlipContext } from "../../context/CoinFlipContext";
import { Link } from "react-router-dom";

const Nav = () => {
  const { account, balance, checkIfWalletConnected, connectwallet } =
    useContext(CoinFlipContext);

  useEffect(() => {
    checkIfWalletConnected();
  }, [checkIfWalletConnected]);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className={styles.navContainer}>
        {account ? (
          <>
            <Link to="/history" className={styles.link}>
              History
            </Link>
            <div className={styles.account}>
              <p className={styles.accountText}>{account}</p>
              <p className={styles.balance}>{balance} ETH</p>
            </div>
          </>
        ) : (
          <div className={styles.button} onClick={connectwallet}>
            Connect
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
