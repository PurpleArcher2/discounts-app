import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import StudentDashboard from "./components/student/StudentDashboard";
import CafeDashboard from "./components/cafe/CafeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import { PendingApproval } from "./components/approvals/PendingApproval";
import { PendingVerification } from "./components/approvals/PendingVerification";

// Protected Route
const ProtectedRoute = ({ children, allowedUserType }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  if (allowedUserType && currentUser.userType !== allowedUserType) {
    const redirectPath =
      currentUser.userType === "student"
        ? "/student/dashboard"
        : "/cafe/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    const redirectPath =
      currentUser.userType === "student"
        ? "/student/dashboard"
        : "/cafe/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/pending-verification" element={<PendingVerification />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedUserType="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cafe/dashboard"
        element={
          <ProtectedRoute allowedUserType="cafe">
            <CafeDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
