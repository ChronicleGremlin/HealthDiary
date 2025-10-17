import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/user/login/Login";
import Register from "./pages/user/register/Register";
import VerifyEmail from "./pages/user/account/VerifyEmail";
import ResetPassword from "./pages/user/account/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";
import Welcome from "./pages/welcome/Welcome.css";
import OAuth2RedirectHandler from "./pages/user/OAuth2RedirectHandler";
import UserProfile from "./pages/user/UserProfile";
import MainLayout from "./components/common/MainLayout";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* Protected Routes under /app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
//            <Route path="profile" element={<UserProfile />} />
            {/* Default route when inside layout */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;