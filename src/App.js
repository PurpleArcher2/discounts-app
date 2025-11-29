import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import StudentDashboard from "./components/student/StudentDashboard";
import CafeDashboard from "./components/cafe/CafeDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserType }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserType && currentUser.userType !== allowedUserType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath =
      currentUser.userType === "student"
        ? "/student/dashboard"
        : "/cafe/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route Component (redirects if already logged in)
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
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

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

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedUserType="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Cafe routes */}
      <Route
        path="/cafe/dashboard"
        element={
          <ProtectedRoute allowedUserType="cafe">
            <CafeDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
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
