import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../components/utils/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signup = async (
    email,
    password,
    name,
    userType,
    studentID = "",
    studentIDPhoto = "",
    cafeName = "",
    cafeLocation = "",
    cafePhoto = "",
    cafeAddress = ""
  ) => {
    try {
      const user = createUser(
        email,
        password,
        name,
        userType,
        studentID,
        studentIDPhoto,
        cafeName,
        cafeLocation,
        cafePhoto,
        cafeAddress
      );
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = (email, password) => {
    try {
      const user = loginUser(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
