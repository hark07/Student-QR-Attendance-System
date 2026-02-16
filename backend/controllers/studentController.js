const Student = require("../models/Student");

// Add new student with auto rollNo for (faculty + semester/year)
exports.addStudent = async (req, res) => {
  try {
    const { name, faculty, semester, year, dob, address, phone, validity } =
      req.body;

    // Validate presence of either semester or year
    if (!semester && !year) {
      return res.status(400).json({
        message: "Either semester or year must be specified",
      });
    }

    // Build filter for grouping students by faculty + semester/year
    const filter = { faculty };
    if (semester) filter.semester = semester;
    if (year) filter.year = year;

    // Find last student with highest rollNo in the group
    const lastStudent = await Student.find(filter)
      .sort({ rollNo: -1 })
      .limit(1);

    // Calculate next rollNo
    const rollNo = lastStudent.length > 0 ? lastStudent[0].rollNo + 1 : 1;

    // Create new student record
    const student = new Student({
      name,
      faculty,
      semester,
      year,
      rollNo,
      dob,
      address,
      phone,
      validity,
      photo: req.file?.path || "", // assuming you use multer or similar for file upload
    });

    await student.save();

    return res.status(201).json(student);
  } catch (err) {
    // Handle duplicate rollNo error gracefully
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate roll number for this faculty and semester/year",
      });
    }

    return res.status(500).json({
      message: "Server error: " + err.message,
    });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const { faculty, semester, year, rollNo } = req.query;
    const filter = {};

    if (faculty) filter.faculty = faculty;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;
    if (rollNo) filter.rollNo = rollNo;

    const students = await Student.find(filter);
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update student details by ID, rollNo update allowed with duplicate check

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Validate if student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check for duplicate rollNo in same faculty/semester/year (if rollNo is being updated)
    if (
      req.body.rollNo &&
      (req.body.rollNo !== existingStudent.rollNo ||
        req.body.faculty !== existingStudent.faculty)
    ) {
      const duplicate = await Student.findOne({
        _id: { $ne: studentId },
        rollNo: req.body.rollNo,
        faculty: req.body.faculty,
        semester: req.body.semester,
        year: req.body.year,
      });
      if (duplicate) {
        return res.status(400).json({
          message: "Duplicate roll number in same faculty and semester",
        });
      }
    }

    // Build update data
    const updateData = { ...req.body };

    // If file uploaded, set photo path
    if (req.file) {
      updateData.photo = req.file.path;
    } else if (req.body.photo) {
      // Keep existing photo URL if no new file
      updateData.photo = req.body.photo;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json({ message: "Student deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
