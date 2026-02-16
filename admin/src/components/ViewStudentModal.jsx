import React from "react";
import { FaUserGraduate } from "react-icons/fa";

export default function ViewStudentModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative border border-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-gray-600 hover:text-gray-900 font-bold text-5xl"
          title="Close"
          type="button"
        >
          &times;
        </button>

        <div className="flex flex-col items-center border border-gray-200 rounded-md p-4 mb-4">
          {student.photo ? (
            <img
              src={student.photo}
              alt="student"
              className="w-28 h-28 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-user.png";
              }}
            />
          ) : (
            <FaUserGraduate
              size={80}
              className="text-gray-400 border border-gray-500 rounded-md p-2"
            />
          )}
          <h2 className="text-2xl font-bold mt-3 text-gray-700">
            {student.name}
          </h2>
          <p className="text-[16px] text-gray-600">Roll No: {student.rollNo}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-gray-700 font-medium ">
          <div className="border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Date of Birth</p>
            <p>{student.dob}</p>
          </div>
          <div className="border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Phone</p>
            <p>{student.phone}</p>
          </div>
          <div className="border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Faculty</p>
            <p>{student.faculty}</p>
          </div>
          <div className="border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Semester / Year</p>
            <p>{student.semester}</p>
          </div>
          <div className="col-span-2 border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Address</p>
            <p>{student.address}</p>
          </div>
          <div className="col-span-2 border-b border-gray-300 max-w-[150px]">
            <p className="text-gray-500">Validity Date</p>
            <p>{student.validity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
