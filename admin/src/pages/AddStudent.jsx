import React, { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddStudent = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [semester, setSemester] = useState("");

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [validity, setValidity] = useState("");

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/collegeFeatures"
        );
        setFaculties(res.data);
      } catch (err) {
        toast.error("Failed to load faculties");
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPhotoPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

  const selectedFaculty = faculties.find((f) => f.facultyName === faculty);

  const availableSemesters =
    selectedFaculty?.semesters?.length > 0
      ? selectedFaculty.semesters
      : selectedFaculty?.years || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!faculty) return toast.error("Select Faculty");
    if (!semester) return toast.error("Select Semester / Year");
    if (!name || !rollNo) return toast.error("Name & Roll No required");

    try {
      const formData = new FormData();
      if (photo) formData.append("photo", photo);
      formData.append("name", name);
      formData.append("rollNo", rollNo);
      formData.append("dob", dob);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("faculty", faculty);
      formData.append("semester", semester);
      formData.append("validity", validity);

      await axios.post("http://localhost:5000/api/students", formData);

      toast.success("Student Added Successfully");

      // Reset
      setPhoto(null);
      setFaculty("");
      setSemester("");
      setName("");
      setRollNo("");
      setDob("");
      setAddress("");
      setPhone("");
      setValidity("");
    } catch (err) {
      toast.error("Failed to add student");
    }
  };

  return (
    <div className="flex justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl w-full p-6 rounded-lg shadow space-y-6"
      >
        <h2 className="text-3xl font-semibold text-indigo-600">Add Student</h2>

        {/* PHOTO */}
        <div>
          <label
            htmlFor="photoUpload"
            className="font-medium cursor-pointer block mt-2"
          >
            Photo Upload
            <input
              id="photoUpload"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <div className="w-24 h-24 border rounded flex items-center justify-center mt-2">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <FaUserGraduate size={32} className="text-gray-400" />
              )}
            </div>
          </label>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="DOB (BS)"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* FACULTY */}
          <select
            className="border p-2 rounded"
            value={faculty}
            onChange={(e) => {
              setFaculty(e.target.value);
              setSemester("");
            }}
          >
            <option value="">Select Faculty</option>
            {faculties.map((f) => (
              <option key={f._id} value={f.facultyName}>
                {f.facultyName}
              </option>
            ))}
          </select>

          {/* SEMESTER / YEAR */}
          <select
            className="border p-2 rounded"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            disabled={!faculty}
          >
            <option value="">
              {faculty ? "Select Semester / Year" : "Select Faculty First"}
            </option>
            {availableSemesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Validity Date (BS)"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!faculty || !semester || !name || !rollNo}
          className={`px-10 py-2 rounded text-white ${
            !faculty || !semester || !name || !rollNo
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Add Student
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={500} />
    </div>
  );
};

export default AddStudent;
