const Student = require("../models/Student");

// Controller to get student data by ID for QR code scanning
exports.getQRCodeData = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Customize the returned data as needed
    const qrCodeData = {
      id: student._id,
      name: student.name,
      rollNo: student.rollNo,
      faculty: student.faculty,
      semester: student.semester,
      year: student.year,
      phone: student.phone,
      dob: student.dob,
      address: student.address,
      validity: student.validity,
      photo: student.photoUrl, // if you have a photo field
    };

    res.json(qrCodeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
