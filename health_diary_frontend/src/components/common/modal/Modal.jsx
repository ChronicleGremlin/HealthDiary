import React, { useEffect, useRef } from "react";
import styles from "./Modal.css";

const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (record) => {
      if (modalRef.current && !modalRef.current.contains(record.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (record) => {
      if (record.key === "Escape") {
        onClose();
      }
    };

    document.addRecordListener("mousedown", handleClickOutside);
    document.addRecordListener("keydown", handleEscapeKey);

    // Prevents the background from scrolling when the modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeRecordListener("mousedown", handleClickOutside);
      document.removeRecordListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} ref={modalRef}>
        <button className={styles.modalClose} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
