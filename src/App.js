import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./components/LandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import StudentDashboard from "./components/student/StudentDashboard";
import CafeDashboard from "./components/cafe/CafeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import { PendingApproval } from "./components/approvals/PendingApproval";
import { PendingVerification } from "./components/approvals/PendingVerification";

// Protected Route
const ProtectedRoute = ({ children, allowedUserTypes }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  // Check if allowedUserTypes is provided and if current user is allowed
  if (allowedUserTypes && !allowedUserTypes.includes(currentUser.userType)) {
    // Redirect based on user type
    if (currentUser.userType === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (
      currentUser.userType === "student" ||
      currentUser.userType === "staff"
    ) {
      return <Navigate to="/student/dashboard" replace />;
    } else if (currentUser.userType === "cafe") {
      return <Navigate to="/cafe/dashboard" replace />;
    }
  }

  return children;
};

// Public Route - redirects logged-in users away from login/signup
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    // Redirect based on user type
    if (currentUser.userType === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (
      currentUser.userType === "student" ||
      currentUser.userType === "staff"
    ) {
      return <Navigate to="/student/dashboard" replace />;
    } else if (currentUser.userType === "cafe") {
      return <Navigate to="/cafe/dashboard" replace />;
    }
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page - accessible to everyone */}
      <Route path="/" element={<LandingPage />} />

      {/* Public routes */}
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

      {/* Special status pages */}
      <Route path="/pending-verification" element={<PendingVerification />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedUserTypes={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard - accessible by both students AND staff */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedUserTypes={["student", "staff"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Cafe Dashboard - only for cafe owners */}
      <Route
        path="/cafe/dashboard"
        element={
          <ProtectedRoute allowedUserTypes={["cafe"]}>
            <CafeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
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
