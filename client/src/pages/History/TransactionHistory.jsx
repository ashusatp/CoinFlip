import React, { useState, useEffect, useContext } from "react";
import styles from "./TransactionHistory.module.css"; // We'll use CSS modules for styling
import { CoinFlipContext } from "../../context/CoinFlipContext";
import loadingGif from '../../assets/images/giphy.gif';

const TransactionHistory = () => {
  const { contract } = useContext(CoinFlipContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);

    try {
      const history = await contract.getMyTransactionHistory();
      setTransactions(history);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.error && error.error.data && error.error.data.message) {
        const revertReason = error.error.data.message;
        console.log("Revert reason:", revertReason);
        alert(revertReason);
      } else if (error.message) {
        const revertReason = error.message;
        alert(revertReason);
        console.log("Revert reason:", revertReason);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    // Fetch transaction history on component mount
    fetchTransactions();
  }, []);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <img src={loadingGif} alt="Loading..." className={styles.loadingGif} />
        </div>
      ) : (
        <div className={styles.content}>
          <h2>My Transaction History</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bet Amount in Wei</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={transaction.won ? styles.won : styles.lost}
                >
                  <td>{transaction.betAmount.toString()}</td> {/* Convert BigNumber to string */}
                  <td>{transaction.won ? "Won" : "Lost"}</td>
                  <td>{new Date(transaction.timestamp * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
