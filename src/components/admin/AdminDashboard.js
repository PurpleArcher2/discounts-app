import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  Users,
  Briefcase,
} from "lucide-react";
import {
  getAllUsers,
  getPendingCafes,
  verifyStudent,
  rejectStudent,
  approveCafe,
  rejectCafe,
} from "../utils/storage";

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [pendingCafes, setPendingCafes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("AdminDashboard mounted");
    loadPendingItems();
  }, []);

  const loadPendingItems = () => {
    try {
      const users = getAllUsers();
      const students = users.filter(
        (u) => u.userType === "student" && u.verified === false
      );
      const staff = users.filter(
        (u) => u.userType === "staff" && u.verified === false
      );
      setPendingStudents(students);
      setPendingStaff(staff);

      const cafes = getPendingCafes();
      setPendingCafes(cafes);

      console.log("Loaded:", {
        students: students.length,
        staff: staff.length,
        cafes: cafes.length,
      });
    } catch (error) {
      console.error("Error loading pending items:", error);
    }
  };

  const handleVerifyUser = async (userID, userType) => {
    try {
      await verifyStudent(userID);
      loadPendingItems();
      alert(
        `${
          userType === "student" ? "Student" : "Staff member"
        } verified successfully!`
      );
    } catch (error) {
      console.error("Failed to verify user:", error);
      alert("Failed to verify user");
    }
  };

  const handleRejectUser = async (userID, userType) => {
    if (
      window.confirm(
        `Are you sure you want to reject this ${
          userType === "student" ? "student" : "staff member"
        }?`
      )
    ) {
      try {
        await rejectStudent(userID);
        loadPendingItems();
        alert(
          `${userType === "student" ? "Student" : "Staff member"} rejected`
        );
      } catch (error) {
        console.error("Failed to reject user:", error);
        alert("Failed to reject user");
      }
    }
  };

  const handleApproveCafe = async (pendingID) => {
    try {
      await approveCafe(pendingID);
      loadPendingItems();
      alert("Cafe approved successfully!");
    } catch (error) {
      console.error("Failed to approve cafe:", error);
      alert("Failed to approve cafe");
    }
  };

  const handleRejectCafe = async (pendingID) => {
    if (window.confirm("Are you sure you want to reject this cafe?")) {
      try {
        await rejectCafe(pendingID);
        loadPendingItems();
        alert("Cafe rejected");
      } catch (error) {
        console.error("Failed to reject cafe:", error);
        alert("Failed to reject cafe");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage verifications and approvals
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">
                {pendingStudents.length}
              </span>
            </div>
            <p className="text-blue-100">Pending Students</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{pendingStaff.length}</span>
            </div>
            <p className="text-green-100">Pending Staff</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Coffee className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{pendingCafes.length}</span>
            </div>
            <p className="text-purple-100">Pending Cafes</p>
          </div>
        </div>

        {/* Pending Students */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Student Verifications
            </h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {pendingStudents.length}
            </span>
          </div>

          {pendingStudents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending student verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStudents.map((student) => (
                <div
                  key={student.userID}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 cursor-pointer hover:border-blue-400"
                      onClick={() => setSelectedImage(student.studentIDPhoto)}
                    >
                      {student.studentIDPhoto ? (
                        <img
                          src={student.studentIDPhoto}
                          alt="Student ID"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {student.email}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                        <span className="font-medium">Student ID:</span>
                        <span className="bg-gray-100 px-3 py-1 rounded">
                          {student.studentID}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(student.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          handleVerifyUser(student.userID, "student")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() =>
                          handleRejectUser(student.userID, "student")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Staff */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Staff Verifications
            </h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              {pendingStaff.length}
            </span>
          </div>

          {pendingStaff.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending staff verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingStaff.map((staff) => (
                <div
                  key={staff.userID}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 cursor-pointer hover:border-green-400"
                      onClick={() => setSelectedImage(staff.studentIDPhoto)}
                    >
                      {staff.studentIDPhoto ? (
                        <img
                          src={staff.studentIDPhoto}
                          alt="Staff ID"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {staff.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {staff.email}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                        <span className="font-medium">Staff ID:</span>
                        <span className="bg-gray-100 px-3 py-1 rounded">
                          {staff.studentID}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(staff.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleVerifyUser(staff.userID, "staff")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectUser(staff.userID, "staff")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Cafes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Coffee className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Cafe Approvals</h2>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {pendingCafes.length}
            </span>
          </div>

          {pendingCafes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending cafe approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCafes.map((cafe) => (
                <div
                  key={cafe.pendingID}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 cursor-pointer hover:border-purple-400"
                      onClick={() => setSelectedImage(cafe.photo)}
                    >
                      {cafe.photo ? (
                        <img
                          src={cafe.photo}
                          alt="Cafe"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Coffee className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {cafe.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {cafe.location}
                      </p>
                      {cafe.address && (
                        <p className="text-sm text-gray-500 mb-3">
                          {cafe.address}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(cafe.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApproveCafe(cafe.pendingID)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectCafe(cafe.pendingID)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <button
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
