import React, { useState, useEffect } from "react";

const mockData = {
  totalStudents: 450,
  totalPresent: 387,
  totalAbsent: 63,
  collegeFeatures: 12,
  recentAttendance: [
    {
      id: "STU001",
      photo: "👨‍🎓",
      name: "John Smith",
      semester: "BCA - 3rd Sem",
      rollNo: "001",
      date: "2024-12-29",
      totalPresent: 25,
      totalAbsent: 6,
    },
    {
      id: "STU002",
      photo: "👩‍🎓",
      name: "Sarah Johnson",
      semester: "BBS - 2nd Sem",
      rollNo: "002",
      date: "2024-12-29",
      totalPresent: 27,
      totalAbsent: 4,
    },
    {
      id: "STU003",
      photo: "👨‍🎓",
      name: "Mike Chen",
      semester: "MBS - 1st Sem",
      rollNo: "003",
      date: "2024-12-29",
      totalPresent: 23,
      totalAbsent: 8,
    },
    {
      id: "STU004",
      photo: "👩‍🎓",
      name: "Emma Wilson",
      semester: "BSW - 4th Sem",
      rollNo: "004",
      date: "2024-12-29",
      totalPresent: 28,
      totalAbsent: 3,
    },
    {
      id: "STU005",
      photo: "👨‍🎓",
      name: "David Lee",
      semester: "BCA - 2nd Sem",
      rollNo: "005",
      date: "2024-12-29",
      totalPresent: 26,
      totalAbsent: 5,
    },
  ],
};

export default function StudentReport() {
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStudent, setSelectedStudent] = useState(
    mockData.recentAttendance[0]
  );
  const [calendarDays, setCalendarDays] = useState([]);

  // Filters
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterRollNo, setFilterRollNo] = useState("");

  // Generate attendance data per student with consistent randomness (using seed)
  const generateCalendarDaysForStudent = (studentId, month, year) => {
    const daysInMonth = 31;
    const days = [];

    // Simple hash for seed
    let seed = 0;
    for (let i = 0; i < studentId.length; i++) {
      seed += studentId.charCodeAt(i);
    }
    seed += parseInt(month) + parseInt(year);

    // Simple pseudo random based on seed
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 1; i <= daysInMonth; i++) {
      const isPresent = random() > 0.3; // 70% chance present
      days.push({ day: i, isPresent });
    }
    return days;
  };

  // Update calendar days when selected student/month/year changes
  useEffect(() => {
    if (selectedStudent) {
      const days = generateCalendarDaysForStudent(
        selectedStudent.id,
        selectedMonth,
        selectedYear
      );
      setCalendarDays(days);
    }
  }, [selectedStudent, selectedMonth, selectedYear]);

  // Filtering students based on filter values
  const filteredStudents = mockData.recentAttendance.filter((student) => {
    const facultyMatch =
      filterFaculty === "" || student.semester.startsWith(filterFaculty);
    const semesterMatch =
      filterSemester === "" || student.semester.includes(filterSemester);
    const rollNoMatch =
      filterRollNo === "" || student.rollNo.includes(filterRollNo);

    return facultyMatch && semesterMatch && rollNoMatch;
  });

  // Calculate total present and absent for selected student's calendarDays
  const calculatedPresentCount = calendarDays.filter((d) => d.isPresent).length;
  const calculatedAbsentCount = calendarDays.length - calculatedPresentCount;

  // Format date to readable form: e.g. "Dec 29, 2024"
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen p-8 rounded-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Report</h1>

      {/* Filter Options */}
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={filterFaculty}
          onChange={(e) => setFilterFaculty(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
        >
          <option value="">All Faculties</option>
          <option value="BCA">BCA</option>
          <option value="BBS">BBS</option>
          <option value="MBS">MBS</option>
          <option value="BSW">BSW</option>
        </select>

        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
        >
          <option value="">All Semesters</option>
          <option value="1st Sem">1st Sem</option>
          <option value="2nd Sem">2nd Sem</option>
          <option value="3rd Sem">3rd Sem</option>
          <option value="4th Sem">4th Sem</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Roll No"
          value={filterRollNo}
          onChange={(e) => setFilterRollNo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
        />
      </div>

      <div className="flex w-full gap-6">
        {/* Recent Attendance Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 overflow-x-auto flex-1">
          <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 text-left">S.N</th>
                <th className="border border-gray-300 p-3 text-left">Photo</th>
                <th className="border border-gray-300 p-3 text-left">
                  Student Name
                </th>
                <th className="border border-gray-300 p-3 text-left">
                  Roll No
                </th>
                <th className="border border-gray-300 p-3 text-left">
                  Semester / Year
                </th>
                <th className="border border-gray-300 p-3 text-left">Date</th>
                <th className="border border-gray-300 p-3 text-left">
                  Total Present
                </th>
                <th className="border border-gray-300 p-3 text-left">
                  Total Absent
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const isSelected = selectedStudent?.id === student.id;
                  const totalPresent = isSelected
                    ? calculatedPresentCount
                    : student.totalPresent;
                  const totalAbsent = isSelected
                    ? calculatedAbsentCount
                    : student.totalAbsent;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        isSelected ? "bg-blue-100" : ""
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="border border-gray-300 p-3">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-3 text-2xl">
                        {student.photo}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {student.name}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {student.rollNo}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {student.semester}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatDate(student.date)}
                      </td>
                      <td className="border border-gray-300 p-3 text-green-700 font-semibold">
                        {totalPresent}
                      </td>
                      <td className="border border-gray-300 p-3 text-red-700 font-semibold">
                        {totalAbsent}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="border border-gray-300 p-3 text-center text-gray-500"
                  >
                    No students found with current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attendance Calendar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto flex-shrink-0">
          <h2 className="text-xl font-semibold mb-4">
            Attendance Calendar for {selectedStudent?.name}
          </h2>

          <div className="flex gap-2 mb-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none"
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, i) => (
                <option key={month} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs text-gray-600 pb-2 font-semibold"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => (
              <div
                key={day.day}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer
                  ${
                    day.isPresent
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {day.day}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
