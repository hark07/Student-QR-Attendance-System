import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LiaEditSolid } from "react-icons/lia";
import { MdDeleteForever } from "react-icons/md";

const API_URL = "http://localhost:5000/api/collegeFeatures";

export default function CollegeFeatures() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Faculty add/edit
  const [newFacultyName, setNewFacultyName] = useState("");
  const [editFacultyId, setEditFacultyId] = useState(null);
  const [editFacultyName, setEditFacultyName] = useState("");

  // Selected faculty for adding semester/year
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [addType, setAddType] = useState("semester");
  const [newItemName, setNewItemName] = useState("");

  // Edit semester/year item
  const [editItem, setEditItem] = useState(null);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setFaculties(data);
    } catch {
      toast.error("Failed to fetch faculties");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Add faculty
  const addFaculty = async () => {
    const name = newFacultyName.trim();
    if (!name) return toast.error("Faculty name cannot be empty");
    try {
      await axios.post(API_URL, { facultyName: name });
      toast.success("Faculty added");
      setNewFacultyName("");
      fetchFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add faculty");
    }
  };

  // Edit faculty
  const startEditFaculty = (fac) => {
    setEditFacultyId(fac._id);
    setEditFacultyName(fac.facultyName);
  };

  const cancelEditFaculty = () => {
    setEditFacultyId(null);
    setEditFacultyName("");
  };

  const saveEditFaculty = async () => {
    const name = editFacultyName.trim();
    if (!name) return toast.error("Faculty name cannot be empty");
    try {
      await axios.put(`${API_URL}/${editFacultyId}`, { facultyName: name });
      toast.success("Faculty updated");
      cancelEditFaculty();
      fetchFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update faculty");
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Faculty deleted");
      if (selectedFacultyId === id) setSelectedFacultyId(null);
      fetchFaculties();
    } catch {
      toast.error("Failed to delete faculty");
    }
  };

  // Add semester/year
  const addItem = async () => {
    if (!selectedFacultyId) return toast.error("Select a faculty first");
    const name = newItemName.trim();
    if (!name) return toast.error(`${addType} name cannot be empty`);

    try {
      await axios.post(`${API_URL}/${selectedFacultyId}/item`, {
        type: addType,
        name,
      });
      toast.success(`${addType} added`);
      setNewItemName("");
      fetchFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to add ${addType}`);
    }
  };

  // Edit semester/year item
  const startEditItem = (facultyId, type, index, name) => {
    setEditItem({ facultyId, type, index, name });
  };

  const cancelEditItem = () => setEditItem(null);

  const saveEditItem = async () => {
    const { facultyId, type, index, name } = editItem;
    const trimmedName = name.trim();
    if (!trimmedName) return toast.error(`${type} name cannot be empty`);

    try {
      await axios.put(`${API_URL}/${facultyId}/item/${type}/${index}`, {
        name: trimmedName,
      });
      toast.success(`${type} updated`);
      cancelEditItem();
      fetchFaculties();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update ${type}`);
    }
  };

  // Delete semester/year item
  const deleteItem = async (facultyId, type, index) => {
    try {
      await axios.delete(`${API_URL}/${facultyId}/item/${type}/${index}`);
      toast.success(`${type} deleted`);
      fetchFaculties();
    } catch {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const selectedFaculty = faculties.find((f) => f._id === selectedFacultyId);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-8 tracking-tight">
        College Features
      </h1>

      {/* Flex container for two side-by-side sections */}
      <div className="flex gap-6 mb-8">
        {/* Left section: Add/Edit Faculty */}
        <section className="flex-1 bg-white rounded-lg shadow-md p-6 border border-indigo-200 min-w-[300px] max-w-[500px]">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            {editFacultyId ? "Edit Faculty" : "Add Faculty"}
          </h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Faculty name"
              value={editFacultyId ? editFacultyName : newFacultyName}
              onChange={(e) =>
                editFacultyId
                  ? setEditFacultyName(e.target.value)
                  : setNewFacultyName(e.target.value)
              }
              className="flex-grow border border-indigo-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[180px]"
            />
            {editFacultyId ? (
              <>
                <button
                  onClick={saveEditFaculty}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition whitespace-nowrap"
                >
                  Update
                </button>
                <button
                  onClick={cancelEditFaculty}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition whitespace-nowrap"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addFaculty}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
              >
                Add Faculty
              </button>
            )}
          </div>
        </section>

        {/* Select Faculty and Add Semester/Year */}
        <section className="bg-white rounded-lg shadow-md p-6 border border-indigo-200 min-w-[300px] max-w-[700px] flex-grow">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
            Add Semester or Year
          </h2>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-indigo-700">
              Select Faculty
            </label>
            {loading ? (
              <p>Loading faculties...</p>
            ) : faculties.length === 0 ? (
              <p className="text-gray-500 italic">
                Please add a faculty first.
              </p>
            ) : (
              <select
                className="w-full border border-indigo-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={selectedFacultyId || ""}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
              >
                <option value="">-- Select Faculty --</option>
                {faculties.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.facultyName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-indigo-700">
              Choose Type
            </label>
            <select
              className="w-full border border-indigo-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
              disabled={!selectedFacultyId}
            >
              <option value="semester">Semester</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder={`Enter ${
                addType === "semester" ? "Semester" : "Year"
              } name`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-grow border border-indigo-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              disabled={!selectedFacultyId}
            />
            <button
              onClick={addItem}
              disabled={!selectedFacultyId}
              className={`px-6 py-3 rounded-md text-white transition ${
                selectedFacultyId
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </div>

          <div className="mt-6 space-y-1 text-gray-700 font-semibold">
            <p>
              Faculty:{" "}
              <span className="text-indigo-700">
                {selectedFaculty?.facultyName || "—"}
              </span>
            </p>
            <p>
              Semesters:{" "}
              <span>{selectedFaculty?.semesters.join(", ") || "—"}</span>
            </p>
            <p>
              Years: <span>{selectedFaculty?.years.join(", ") || "—"}</span>
            </p>
          </div>
        </section>
      </div>

      {/* List Faculties with edit/delete and edit semester/year */}
      <section className="bg-white rounded-lg shadow-md p-6 border border-indigo-200 flex flex-wrap gap-5 justify-start">
        <h2 className="w-full text-2xl font-semibold mb-4 text-indigo-600">
          Faculty List
        </h2>

        {loading ? (
          <p>Loading faculties...</p>
        ) : faculties.length === 0 ? (
          <p>No faculties found.</p>
        ) : (
          faculties.map((faculty) => (
            <div
              key={faculty._id}
              className="border rounded p-4 mb-4 w-70 flex-shrink-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{faculty.facultyName}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditFaculty(faculty)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFaculty(faculty._id)}
                    className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Semesters */}
              <div className="mb-3">
                <p className="font-semibold text-indigo-600 mb-1">Semesters:</p>
                {faculty.semesters.length === 0 ? (
                  <p className="italic text-gray-500">No semesters added.</p>
                ) : (
                  <ul>
                    {faculty.semesters.map((sem, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {editItem &&
                        editItem.facultyId === faculty._id &&
                        editItem.type === "semester" &&
                        editItem.index === i ? (
                          <>
                            <input
                              type="text"
                              value={editItem.name}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  name: e.target.value,
                                })
                              }
                              className="border border-indigo-300 rounded px-2 py-1 flex-grow"
                            />
                            <button
                              onClick={saveEditItem}
                              className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditItem}
                              className="bg-gray-300 px-3 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{sem}</span>
                            <button
                              onClick={() =>
                                startEditItem(faculty._id, "semester", i, sem)
                              }
                              className="text-yellow-500 hover:text-yellow-700"
                            >
                              <LiaEditSolid size={25} />
                            </button>
                            <button
                              onClick={() =>
                                deleteItem(faculty._id, "semester", i)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <MdDeleteForever size={25} />
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Years */}
              <div>
                <p className="font-semibold text-indigo-600 mb-1">Years:</p>
                {faculty.years.length === 0 ? (
                  <p className="italic text-gray-500">No years added.</p>
                ) : (
                  <ul>
                    {faculty.years.map((yr, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {editItem &&
                        editItem.facultyId === faculty._id &&
                        editItem.type === "year" &&
                        editItem.index === i ? (
                          <>
                            <input
                              type="text"
                              value={editItem.name}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  name: e.target.value,
                                })
                              }
                              className="border border-indigo-300 rounded px-2 py-1 flex-grow"
                            />
                            <button
                              onClick={saveEditItem}
                              className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditItem}
                              className="bg-gray-300 px-3 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{yr}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  startEditItem(faculty._id, "year", i, yr)
                                }
                                className="text-yellow-500 hover:text-yellow-700"
                              >
                                <LiaEditSolid size={25} />
                              </button>
                              <button
                                onClick={() =>
                                  deleteItem(faculty._id, "year", i)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <MdDeleteForever size={25} />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}
