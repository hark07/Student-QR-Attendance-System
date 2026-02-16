import React, { useState, useEffect } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";

function GenerateQRCode() {
  const [students, setStudents] = useState([]);
  const [semesterMap, setSemesterMap] = useState({});
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterRollNo, setFilterRollNo] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const BASE_URL = "http://localhost:5000/api"; // adjust if needed

  // Fetch semesters (faculties + semesters) once on component mount
  useEffect(() => {
    const fetchSemesterMap = async () => {
      try {
        const res = await fetch(`${BASE_URL}/collegeFeatures`);
        if (!res.ok) throw new Error("Failed to fetch semesters");
        const data = await res.json();

        const map = {};
        data.forEach((faculty) => {
          map[faculty.facultyName] = faculty.semesters;
        });

        setSemesterMap(map);
      } catch (error) {
        toast.error("Error fetching semesters: " + error.message);
      }
    };
    fetchSemesterMap();
  }, []);

  // Fetch students every time filters change
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams();
        if (filterFaculty) params.append("faculty", filterFaculty);
        if (filterSemester) params.append("semester", filterSemester);
        if (filterRollNo) params.append("rollNo", filterRollNo);

        const res = await fetch(`${BASE_URL}/students?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };

    fetchStudents();
  }, [filterFaculty, filterSemester, filterRollNo]);

  // Open modal to view student details and QR code
  const openViewModal = (student) => {
    setViewStudent(student);
    setShowQRCode(false);
  };

  // Close modal
  const closeViewModal = () => {
    setViewStudent(null);
    setShowQRCode(false);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");

      toast.success("Student deleted successfully!");
      setStudents((prev) => prev.filter((s) => s._id !== id));

      if (viewStudent && viewStudent._id === id) closeViewModal();
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-indigo-600 pb-3">
        Generate QR Code
      </h2>

      {/* FILTERS */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div>
          <label className="block font-semibold mb-1">Faculty</label>
          <select
            className="border rounded px-3 py-2 w-full outline-none"
            value={filterFaculty}
            onChange={(e) => {
              setFilterFaculty(e.target.value);
              setFilterSemester(""); // Reset semester when faculty changes
            }}
          >
            <option value="">All Faculties</option>
            {Object.keys(semesterMap).map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Semester / Year</label>
          <select
            className="border rounded px-3 py-2 w-full outline-none"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            disabled={!filterFaculty || !semesterMap[filterFaculty]}
          >
            <option value="">
              {filterFaculty
                ? "Select Semester / Year"
                : "Select Faculty First"}
            </option>
            {filterFaculty &&
              semesterMap[filterFaculty]?.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Roll No</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full outline-none"
            placeholder="Roll No"
            value={filterRollNo}
            onChange={(e) => setFilterRollNo(e.target.value)}
          />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="max-h-154 overflow-y-auto border rounded shadow w-full">
        <table className="w-full border-collapse table-auto">
          <thead className="bg-gray-300 sticky top-0 z-20">
            <tr>
              <th className="border px-3 py-2 text-center">S.N</th>
              <th className="border px-3 py-2 text-center">Photo</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-center">Roll No</th>
              <th className="border px-3 py-2 text-center">DOB</th>
              <th className="border px-3 py-2 text-center">Faculty</th>
              <th className="border px-3 py-2 text-center">Semester / Year</th>
              <th className="border px-3 py-2 text-center">Phone</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((stu, idx) => (
                <tr key={stu._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 text-center">{idx + 1}</td>
                  <td className="border px-3 py-2 text-center">
                    {stu.photo ? (
                      <img
                        src={stu.photo}
                        alt="student"
                        className="w-15 h-15 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      <FaUserGraduate
                        className="text-gray-400 mx-auto"
                        size={20}
                      />
                    )}
                  </td>
                  <td className="border px-3 py-2">{stu.name}</td>
                  <td className="border px-3 py-2 text-center">{stu.rollNo}</td>
                  <td className="border px-3 py-2 text-center">{stu.dob}</td>
                  <td className="border px-3 py-2 text-center">
                    {stu.faculty}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {stu.semester}
                  </td>
                  <td className="border px-3 py-2 text-center">{stu.phone}</td>
                  <td className="border px-3 py-2 text-center">
                    <div className="flex justify-around items-center">
                      <button
                        onClick={() => openViewModal(stu)}
                        className="text-blue-600 hover:underline transform transition-transform duration-200"
                        type="button"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaRegEye
                          size={30}
                          title="View"
                          className="hover:scale-125 transition-transform duration-200"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(stu._id)}
                        className="text-red-600 hover:underline transform transition-transform duration-200"
                        type="button"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdOutlineDeleteOutline
                          size={30}
                          title="Delete"
                          className="hover:scale-125 transition-transform duration-200"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewStudent && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={closeViewModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative border border-gray-600 flex gap-6"
            onClick={(e) => e.stopPropagation()}
            style={{ minHeight: "350px" }}
          >
            <button
              onClick={closeViewModal}
              className="absolute top-2 right-5 text-gray-600 hover:text-gray-900 font-bold text-5xl"
              title="Close"
            >
              &times;
            </button>

            {/* LEFT SIDE: Student Details */}
            <div className="flex-1 border-r border-gray-300 pr-6 overflow-y-auto">
              {/* Header */}
              <div className="flex flex-col items-center border border-gray-200 rounded-md p-4 mb-4">
                {viewStudent.photo ? (
                  <img
                    src={viewStudent.photo}
                    alt="student"
                    className="w-28 h-28 object-cover rounded-md border border-gray-200"
                  />
                ) : (
                  <FaUserGraduate
                    size={80}
                    className="text-gray-400 border border-gray-500 rounded-md p-2"
                  />
                )}
                <h2 className="text-2xl font-bold mt-3 text-gray-700">
                  {viewStudent.name}
                </h2>
                <p className="text-[16px] text-gray-600">
                  Roll No: {viewStudent.rollNo}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-gray-700 font-medium ">
                <div className="border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Date of Birth</p>
                  <p>{viewStudent.dob}</p>
                </div>
                <div className="border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Phone</p>
                  <p>{viewStudent.phone}</p>
                </div>

                <div className="border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Faculty</p>
                  <p>{viewStudent.faculty}</p>
                </div>
                <div className="border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Semester / Year</p>
                  <p>{viewStudent.semester}</p>
                </div>

                <div className="col-span-2 border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Address</p>
                  <p>{viewStudent.address}</p>
                </div>

                <div className="col-span-2 border-b border-gray-300 w-full max-w-[150px]">
                  <p className="text-gray-500">Validity Date</p>
                  <p>{viewStudent.validity}</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: QR Code generation */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <button
                onClick={() => setShowQRCode(true)}
                className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
              >
                Generate QR Code
              </button>

              {showQRCode ? (
                <QRCodeCanvas
                  value={viewStudent._id} // or viewStudent.rollNo or any unique identifier
                  size={200}
                  bgColor="#f3f4f6"
                  fgColor="#4f46e5"
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <p className="text-gray-500">
                  Click the button to generate QR code
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default GenerateQRCode;
