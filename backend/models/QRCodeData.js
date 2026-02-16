const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: Number, required: true },
  faculty: { type: String, required: true, trim: true },
  semester: { type: String, trim: true },
  year: { type: String, trim: true },
  dob: { type: String, trim: true },
  address: { type: String, trim: true },
  phone: { type: String, trim: true },
  validity: { type: String, trim: true },
  photo: { type: String, default: "" },
  qrCodeData: { type: String, default: "" },
}, { timestamps: true });

// Compound unique indexes to ensure no duplicate rollNo in the same faculty and semester/year
studentSchema.index(
  { faculty: 1, semester: 1, rollNo: 1 },
  { unique: true, partialFilterExpression: { semester: { $exists: true } } }
);
studentSchema.index(
  { faculty: 1, year: 1, rollNo: 1 },
  { unique: true, partialFilterExpression: { year: { $exists: true } } }
);

module.exports = mongoose.model("Student", studentSchema);
