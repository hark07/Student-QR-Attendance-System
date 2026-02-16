import React, { useEffect } from "react";
import { FaUserGraduate, FaCalendarAlt } from "react-icons/fa";

export default function EditStudentModal({
  student,
  faculties,
  onClose,
  onChange,
  onSubmit,
  editForm,
}) {
  if (!student) return null;

  // Compute semesters/years for selected faculty
  const selectedFaculty = faculties.find(
    (f) => f.facultyName === editForm.faculty
  );
  const semesters =
    selectedFaculty?.semesters?.length > 0
      ? selectedFaculty.semesters
      : selectedFaculty?.years || [];

  // Reset semester if current semester not valid for faculty
  useEffect(() => {
    if (editForm.faculty && !semesters.includes(editForm.semester)) {
      onChange({
        target: { name: "semester", value: "" },
      });
    }
  }, [editForm.faculty]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg max-w-2xl w-full p-6 relative space-y-5"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
          title="Close"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold">Update Student</h3>

        <div>
          <label className="font-medium">Photo Upload</label>
          <div className="mt-2">
            <label htmlFor="photo" className="cursor-pointer">
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                hidden
                onChange={onChange}
              />
              <div className="w-24 h-24 border rounded flex items-center justify-center">
                {editForm.photo ? (
                  typeof editForm.photo === "string" ? (
                    <img
                      src={editForm.photo}
                      alt="preview"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(editForm.photo)}
                      alt="preview"
                      className="w-full h-full object-cover rounded"
                    />
                  )
                ) : (
                  <FaUserGraduate size={30} className="text-gray-400" />
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name</label>
            <input
              name="name"
              value={editForm.name}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
              required
            />
          </div>

          <div>
            <label className="font-medium">Roll No</label>
            <input
              name="rollNo"
              value={editForm.rollNo}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
              required
            />
          </div>

          <div>
            <label className="font-medium flex items-center gap-2">
              <FaCalendarAlt /> Date of Birth (BS)
            </label>
            <input
              name="dob"
              value={editForm.dob}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
            />
          </div>

          <div>
            <label className="font-medium">Address</label>
            <input
              name="address"
              value={editForm.address}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
            />
          </div>

          <div>
            <label className="font-medium">Faculty</label>
            <select
              name="faculty"
              value={editForm.faculty}
              onChange={onChange}
              className="border rounded px-3 py-2 outline-none w-full"
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map((fac) => (
                <option key={fac.facultyName} value={fac.facultyName}>
                  {fac.facultyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Semester / Year</label>
            <select
              name="semester"
              value={editForm.semester}
              onChange={onChange}
              className="border rounded px-3 py-2 outline-none w-full"
              required
              disabled={!editForm.faculty}
            >
              <option value="">
                {editForm.faculty
                  ? "Select Semester / Year"
                  : "Select Faculty First"}
              </option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Phone</label>
            <input
              name="phone"
              value={editForm.phone}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
            />
          </div>

          <div>
            <label className="font-medium">Validity Date</label>
            <input
              name="validity"
              value={editForm.validity}
              onChange={onChange}
              type="text"
              className="border rounded px-3 py-2 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
