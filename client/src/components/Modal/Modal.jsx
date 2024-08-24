import React from "react";
import styles from "./Modal.module.css"; // Make sure you have this CSS file

const Modal = ({ isOpen, onClose, title, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <img src={imageSrc} alt="Result" style={{ width: '600px', height: '400px' }} />
        {/* <button className={styles.closeButton} onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
