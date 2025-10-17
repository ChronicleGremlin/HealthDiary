import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    emailAddress: "",
    newPassword: "",
    verifyPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (formData.newPassword !== formData.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        formData
      );
      setSuccess("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data || "Failed to reset password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2 className="auth-title">Reset Password</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailAddress" className="sr-only">
              Email address
            </label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              required
              className="form-input"
              placeholder="Email address"
              value={formData.emailAddress}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="sr-only">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="form-input"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <p className="password-requirements">
              Password must be at least 8 characters long
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="verifyPassword" className="sr-only">
              Verify Password
            </label>
            <input
              id="verifyPassword"
              name="verifyPassword"
              type="password"
              required
              className="form-input"
              placeholder="Verify password"
              value={formData.verifyPassword}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>

        <div className="auth-prompt">
          <button onClick={() => navigate("/login")} className="back-button">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
