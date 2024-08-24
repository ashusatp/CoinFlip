import React, { useContext, useState } from "react";
import styles from "./FlipContainer.module.css";
import headImage from "../../assets/images/head.png";
import tailImage from "../../assets/images/tail.png";
import loadingGif from "../../assets/images/giphy.gif";
import trophyImage from "../../assets/images/Won.gif";
import lostGif from "../../assets/images/lost.webp"; // Path to your lost image
import { CoinFlipContext } from "../../context/CoinFlipContext";
import { ethers } from "ethers";
import Modal from "../Modal/Modal"; // Import the modal component

const FlipContainer = () => {
  const [amount, setAmount] = useState("");
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalTitle, setModalTitle] = useState(""); // State for modal title
  const [modalImage, setModalImage] = useState(""); // State for modal image
  const { contract, account, sendEtherToContract } =
    useContext(CoinFlipContext);

  const handleFlipCoin = async (event) => {
    event.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    if (parseFloat(amount) > 0.001) {
      alert(
        "Please enter an amount less than 0.001 Ether. This contract is built for learning purposes."
      );
      return;
    }

    setIsLoading(true);

    try {
      const choiceValue = choice === "Heads" ? 0 : 1;

      const tx = await contract.flipCoin(choiceValue, {
        value: ethers.utils.parseEther(amount),
        gasLimit: 1000000,
      });

      const receipt = await tx.wait();
      const resultEvent = receipt.events.find(
        (event) => event.event === "CoinFlipped"
      );

      if (resultEvent) {
        const [player, amount, won] = resultEvent.args;

        setResult(
          `Bet Amount: ${ethers.utils.formatEther(amount)} ETH, ${
            won ? "Won" : "Lost"
          }`
        );

        if (won) {
          setModalTitle("You Won!");
          setModalImage(trophyImage);
        } else {
          setModalTitle("Better Luck Next Time!");
          setModalImage(lostGif);
        }
        setIsModalOpen(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed");
      if (error.error && error.error.data && error.error.data.message) {
        const revertReason = error.error.data.message;
        console.log("Revert reason:", revertReason);
        alert(revertReason);
      } else if (error.message) {
        const revertReason = error.message;
        console.log("Revert reason:", revertReason);
      } else {
        console.error("Transaction failed without revert reason:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Coin Flip Game</h2>
      {/* <button onClick={sendEtherToContract}>Send 0.2 Ether to contract</button> */}
      <div className={styles.innerContainer}>
        <div>
          <div className={styles.inputGroup}>
            <label htmlFor="amount" className={styles.label}>
              Enter SepoliaETH Amount:
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              placeholder="Enter the amount"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Choose:</label>
            <div
              className={`${styles.imageGroup} ${
                isLoading ? styles.disabled : ""
              }`}
            >
              <div
                className={`${styles.choiceContainer} ${
                  choice === "Heads" ? styles.selected : ""
                }`}
                onClick={() => !isLoading && setChoice("Heads")}
              >
                <img src={headImage} alt="Heads" className={styles.image} />
                <span className={styles.choiceTitle}>Heads</span>
              </div>
              <div
                className={`${styles.choiceContainer} ${
                  choice === "Tails" ? styles.selected : ""
                }`}
                onClick={() => !isLoading && setChoice("Tails")}
              >
                <img src={tailImage} alt="Tails" className={styles.image} />
                <span className={styles.choiceTitle}>Tails</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFlipCoin}
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Flipping..." : "Flip Coin"}
          </button>
        </div>

        {isLoading && (
          <div className={styles.loadingContainer}>
            <img
              src={loadingGif}
              alt="Loading..."
              className={styles.loadingGif}
            />
          </div>
        )}
      </div>

      {result && !isLoading && <div className={styles.result}>{result}</div>}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        imageSrc={modalImage}
      />
    </div>
  );
};

export default FlipContainer;
