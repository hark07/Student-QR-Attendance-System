import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const facultyOptions = ["BCA", "BSW", "BBS", "MBS"];

const semesterOptions = {
  BCA: [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ],
  BSW: [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ],
  BBS: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  MBS: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
};

const Attendance = () => {
  const [faculty, setFaculty] = useState("");
  const [semester, setSemester] = useState("");
  const [dob, setDob] = useState("");

  const students = [
    { id: 1, name: "Maria DB", roll: "#2123123" },
    { id: 2, name: "John Doe", roll: "#2123124" },
    { id: 3, name: "Alex Smith", roll: "#2123125" },
  ];

  useEffect(() => {
    setSemester("");
  }, [faculty]);

  const handleGenerate = () => {
    if (!faculty || !semester || !dob) {
      toast.error("Please select faculty, semester/year and enter DOB");
      return;
    }
    toast.success(`Attendance Sheet Generated for ${faculty} - ${semester}`);
  };

  return (
    <div className="bg-[#f6f9ff] p-1 rounded-md">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h2 className="text-xl font-semibold text-blue-600 mb-4">Attendance</h2>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-wrap gap-4 items-center">
        <select
          className="border rounded-md px-4 py-2 w-56"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        >
          <option value="" disabled>
            Select Faculty
          </option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md px-4 py-2 w-56"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          disabled={!faculty}
        >
          <option value="" disabled>
            {faculty ? "Select Semester / Year" : "Select Faculty first"}
          </option>
          {faculty &&
            semesterOptions[faculty].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
        </select>

        <input
          type="date"
          className="border rounded-md px-4 py-2 w-56"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
        >
          Generate Sheet
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Attendance Sheet</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-left">Faculty</th>
              <th className="p-3 text-left">Semester / Year</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.roll}</td>
                <td className="p-3">{faculty || "-"}</td>
                <td className="p-3">{semester || "-"}</td>
                <td className="p-3">{dob || "-"}</td>
                <td className="p-3 text-green-600 font-medium">Present</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
