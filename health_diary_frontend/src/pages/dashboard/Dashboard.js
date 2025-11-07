import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Calendar from "./Calendar";
import ReportForm from "./ReportForm";
import { reportApi } from "../../service/api";
//UpcomingReports
import "../../assets/styles/components.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const redirectToUserProfile = () => {
    navigate("/profile"); // Redirect to user profile page
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportApi.getAllReports();

      const data = response.data;
      console.log("Fetched reports:", data);

      if (Array.isArray(data)) {
        setReports(data);
      } else if (data?.reports && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        console.warn("Unexpected response format:", data);
        setReports([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = () => {
    setShowReportForm(true);
  };

  const handleSaveReport = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await fetchReports();
      setSuccessMessage("Report created successfully!");
      setShowReportForm(false);
    } catch (err) {
      console.error("Error saving report:", err);
      setError("Failed to create report. Please try again.");
    }
  };

  const handleCancelReport = () => {
    setShowReportForm(false);
  };

  const handleReportUpdated = async () => {
    try {
      await fetchReports();
      setSuccessMessage("Report updated successfully!");
    } catch (err) {
      console.error("Error updating reports:", err);
      setError("Failed to update reports. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
          <button onClick={fetchReports} className="button button-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: "1rem" }}>
      <nav className="card">
        <div className="container">
          <div
            className="flex"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              height: "4rem",
            }}
          >
            <div className="flex" style={{ alignItems: "center" }}>
              <h1 className="card-title">Health Diary</h1>
            </div>
            <div className="flex" style={{ alignItems: "center", gap: "1rem" }}>
              <span className="card-content">
                Welcome, {user?.name || "User"}
              </span>
              <img
                src={user.pictureUrl}
                alt="Profile"
                className="dashboard-profile-pic"
              />
              <button
                onClick={redirectToUserProfile}
                className="button button-primary"
              >
                Profile
              </button>
              <button onClick={handleAddReport} className="button button-primary">
                Add Report
              </button>
              <button onClick={logout} className="button button-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {successMessage && (
          <div className="success-message" style={{ margin: "1rem 0" }}>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message" style={{ margin: "1rem 0" }}>
            {error}
          </div>
        )}
        <Calendar reports={reports} onReportUpdated={handleReportUpdated} />
//        <UpcomingReports reports={reports} />
      </div>

      {showReportForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <ReportForm
              onSubmit={handleSaveReport}
              onCancel={handleCancelReport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;