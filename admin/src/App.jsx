import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import ListStudent from "./pages/ListStudent";
import CollegeFeatures from "./pages/CollegeFeatures";
import GenerateQRCode from "./pages/GenerateQRCode";
import StudentReport from "./pages/StudentReport";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRScanner from "./pages/QRScanner";

/* ================= ADMIN LAYOUT ================= */
const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
          <p className="text-gray-700">Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto flex-1">
          <Routes>
            <Route path="/" element={<Attendance />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addStudent" element={<AddStudent />} />
            <Route path="/listStudent" element={<ListStudent />} />
            <Route path="/college" element={<CollegeFeatures />} />
            <Route path="/generateqr" element={<GenerateQRCode />} />
            <Route path="/studentReport" element={<StudentReport />} />
            <Route path="/studentScanner" element={<QRScanner />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN APP ================= */
const App = () => {
  const isLoggedIn = localStorage.getItem("admin");

  return (
    <>
      {/* Toast works everywhere */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ADMIN */}
        <Route
          path="/*"
          element={
            isLoggedIn ? <AdminLayout /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  );
};

export default App;
