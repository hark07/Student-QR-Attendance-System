import React, { useState, useEffect } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa6";
import { LiaEdit } from "react-icons/lia";
import ViewStudentModal from "../components/ViewStudentModal";
import EditStudentModal from "../components/EditStudentModal";

function ListStudent() {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterRollNo, setFilterRollNo] = useState("");

  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    rollNo: "",
    dob: "",
    address: "",
    faculty: "",
    semester: "",
    phone: "",
    validity: "",
    photo: null,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/collegeFeatures")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch faculties");
        return res.json();
      })
      .then(setFaculties)
      .catch(() => toast.error("Could not load faculties"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then(setStudents)
      .catch(() => toast.error("Could not load students"));
  }, []);

  // Filtering students
  const filteredStudents = students.filter((s) => {
    const roll = s.rollNo ? String(s.rollNo) : "";
    return (
      (!filterFaculty || s.faculty === filterFaculty) &&
      (!filterSemester || s.semester === filterSemester) &&
      (!filterRollNo || roll.includes(filterRollNo))
    );
  });

  const openViewModal = (student) => setViewStudent(student);
  const closeViewModal = () => setViewStudent(null);

  const openEditModal = (student) => {
    setEditStudent(student);
    setEditForm({ ...student });
  };
  const closeEditModal = () => {
    setEditStudent(null);
    setEditForm({
      name: "",
      rollNo: "",
      dob: "",
      address: "",
      faculty: "",
      semester: "",
      phone: "",
      validity: "",
      photo: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      setEditForm((f) => ({ ...f, photo: files[0] }));
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in editForm) {
      if (key === "photo") {
        if (editForm.photo && typeof editForm.photo !== "string") {
          formData.append("photo", editForm.photo);
        }
      } else {
        formData.append(key, editForm[key]);
      }
    }

    fetch(`http://localhost:5000/api/students/${editStudent._id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update student");
        return res.json();
      })
      .then((updatedStudent) => {
        setStudents((prev) =>
          prev.map((s) => (s._id === updatedStudent._id ? updatedStudent : s))
        );
        toast.success("Student updated successfully!");
        closeEditModal();
      })
      .catch(() => toast.error("Failed to update student"));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete student");
        setStudents((prev) => prev.filter((s) => s._id !== id));
        toast.success("Student deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete student"));
  };

  // Semesters/years for filters
  const selectedFilterFaculty = faculties.find(
    (f) => f.facultyName === filterFaculty
  );
  const availableFilterSemesters =
    selectedFilterFaculty?.semesters?.length > 0
      ? selectedFilterFaculty.semesters
      : selectedFilterFaculty?.years || [];

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-600 pb-3">
        List Student
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
              setFilterSemester("");
            }}
          >
            <option value="">All Faculties</option>
            {faculties.map((fac) => (
              <option key={fac.facultyName} value={fac.facultyName}>
                {fac.facultyName}
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
            disabled={!filterFaculty}
          >
            <option value="">
              {filterFaculty
                ? "Select Semester / Year"
                : "Select Faculty First"}
            </option>
            {filterFaculty &&
              availableFilterSemesters.map((sem) => (
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
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
            {filteredStudents.map((stu, idx) => (
              <tr key={stu._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-center">{idx + 1}</td>
                <td className="border px-3 py-2 text-center">
                  {stu.photo ? (
                    <img
                      src={stu.photo}
                      alt="student"
                      className="w-15 h-15 object-cover rounded-full mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-user.png";
                      }}
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
                <td className="border px-3 py-2 text-center">{stu.faculty}</td>
                <td className="border px-3 py-2 text-center">{stu.semester}</td>
                <td className="border px-3 py-2 text-center">{stu.phone}</td>
                <td className="border px-3 py-2 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => openViewModal(stu)}
                      className="text-blue-600 hover:underline"
                      type="button"
                    >
                      <FaRegEye size={30} title="View" />
                    </button>
                    <button
                      onClick={() => openEditModal(stu)}
                      className="text-green-600 hover:underline"
                      type="button"
                    >
                      <LiaEdit size={30} title="Update" />
                    </button>
                    <button
                      onClick={() => handleDelete(stu._id)}
                      className="text-red-600 hover:underline"
                      type="button"
                    >
                      <MdOutlineDeleteOutline size={30} title="Delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewStudentModal student={viewStudent} onClose={closeViewModal} />

      <EditStudentModal
        student={editStudent}
        faculties={faculties}
        onClose={closeEditModal}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        editForm={editForm}
      />

      <ToastContainer autoClose={500} />
    </div>
  );
}

export default ListStudent;
