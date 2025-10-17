import React, { useState, useEffect } from "react";
import { recordApi } from "../../services/api";
import "../../styles/components.css";
import styles from "./RecordForm.css";
import Modal from "../../components/common/modal/Modal";

const RecordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  }, []);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Record name must be at least 3 characters long";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    if (!formData.time) {
      newErrors.time = "Please select a time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const recordData = {
          name: formData.name,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
        };
        await recordApi.createRecord(recordData);
        onSubmit();
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: "Failed to create record. Please try again.",
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Modal onClose={onCancel}>
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Add New Record</h2>
          <p className="form-subtitle">Enter the record details below</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className="form-label">
                Record Name <span className={styles.mandatory}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? styles.error : ""}`}
              required
            />
            {errors.name && (
              <div className={styles.errorText}>{errors.name}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className="form-label">
                Date <span className={styles.mandatory}>*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? styles.error : ""}`}
              required
            />
            {errors.date && (
              <div className={styles.errorText}>{errors.date}</div>
            )}
          </div>

          <div className={`${styles.formGroup} ${errors.time ? styles.errorGroup : ""}`}>
            <label htmlFor="time" className={styles.formLabel}>
                Time <span className={styles.mandatory}>*</span>
            </label>
            <input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.time ? styles.inputError : ""}`}
              required
            />
            {errors.time && (
              <div className={styles.errorText}>{errors.time}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows="4"
            />
          </div>

          {errors.submit && (
            <div className={styles.errorMessage}>{errors.submit}</div>
          )}

          <div className="flex" style={{ gap: "1rem", marginTop: "2rem" }}>
            <button type="submit" className="button button-primary">
              Create Record
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="button button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RecordForm;
