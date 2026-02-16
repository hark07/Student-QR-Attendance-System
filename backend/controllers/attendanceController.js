const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark or update attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date: attendanceDate },
      { status, remarks },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records by student and optional date range
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { student: studentId };
    if (startDate) query.date = { $gte: new Date(startDate) };
    if (endDate) {
      query.date = query.date || {};
      query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query).sort({ date: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance summary (faculty/semester/year filter + date range)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { faculty, semester, year, startDate, endDate } = req.query;

    const studentFilter = {};
    if (faculty) studentFilter.faculty = faculty;
    if (semester) studentFilter.semester = semester;
    if (year) studentFilter.year = year;

    const students = await Student.find(studentFilter).select('_id name rollNo');

    const studentIds = students.map(s => s._id);

    const attendanceFilter = { student: { $in: studentIds } };
    if (startDate) attendanceFilter.date = { $gte: new Date(startDate) };
    if (endDate) {
      attendanceFilter.date = attendanceFilter.date || {};
      attendanceFilter.date.$lte = new Date(endDate);
    }

    const attendanceRecords = await Attendance.find(attendanceFilter).populate('student', 'name rollNo faculty semester year');

    res.json({ students, attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
