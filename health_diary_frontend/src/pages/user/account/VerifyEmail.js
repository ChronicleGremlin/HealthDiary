import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const verifyEmail = async () => {
      if (!token) {
        if (mounted) {
          setStatus("error");
          setMessage("No verification token provided");
          timeoutId = setTimeout(() => navigate("/login"), 3000);
        }
        return;
      }

      try {
        console.log("Attempting to verify email with token:", token);
        const response = await fetch(
          `http://localhost:8080/api/auth/verify?token=${encodeURIComponent(
            token
          )}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!mounted) return;

        const data = await response.json();
        console.log("Verification response:", response.status, data);

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");
        }

        timeoutId = setTimeout(() => {
          if (mounted) {
            navigate("/login", {
              state: { message: data.message },
            });
          }
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        if (!mounted) return;

        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");

        timeoutId = setTimeout(() => {
          if (mounted) {
            navigate("/login");
          }
        }, 3000);
      }
    };

    verifyEmail();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        {status === "verifying" && (
          <div className="verifying-message">
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        )}
        {status === "success" && (
          <div className="success-message">
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        )}
        {status === "error" && (
          <div className="error-message">
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;