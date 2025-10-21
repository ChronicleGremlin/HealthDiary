import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Calendar from "./Calendar";
import RecordForm from "./RecordForm";
import { recordApi } from "../../service/api";
//UpcomingRecords
import "../../assets/styles/components.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const redirectToUserProfile = () => {
    navigate("/profile"); // Redirect to user profile page
  };

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
  }, [token]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await recordApi.getAllRecords();

      const data = response.data;
      console.log("Fetched records:", data);

      if (Array.isArray(data)) {
        setRecords(data);
      } else if (data?.records && Array.isArray(data.records)) {
        setRecords(data.records);
      } else {
        console.warn("Unexpected response format:", data);
        setRecords([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to load records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    setShowRecordForm(true);
  };

  const handleSaveRecord = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await fetchRecords();
      setSuccessMessage("Record created successfully!");
      setShowRecordForm(false);
    } catch (err) {
      console.error("Error saving record:", err);
      setError("Failed to create record. Please try again.");
    }
  };

  const handleCancelRecord = () => {
    setShowRecordForm(false);
  };

  const handleRecordUpdated = async () => {
    try {
      await fetchRecords();
      setSuccessMessage("Record updated successfully!");
    } catch (err) {
      console.error("Error updating records:", err);
      setError("Failed to update records. Please try again.");
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
          <h3>Error Loading Records</h3>
          <p>{error}</p>
          <button onClick={fetchRecords} className="button button-primary">
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
              <button onClick={handleAddRecord} className="button button-primary">
                Add Record
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
        <Calendar records={records} onRecordUpdated={handleRecordUpdated} />
//        <UpcomingRecords records={records} />
      </div>

      {showRecordForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <RecordForm
              onSubmit={handleSaveRecord}
              onCancel={handleCancelRecord}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;