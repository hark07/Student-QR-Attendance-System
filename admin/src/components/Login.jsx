import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy login
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("admin", true);
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-[320px] bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
