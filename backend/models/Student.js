const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNo: {
      type: Number,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
      // optional if you use year instead
    },
    year: {
      type: String,
      trim: true,
      // optional if you use semester instead
    },
    dob: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    validity: {
      type: String,
      trim: true,
    },
    photo: {
      type: String, // store file path or URL
      default: "",
    },

    qrCodeData: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound unique index on faculty + (semester or year) + rollNo
// Because semester and year are alternatives, we create two separate indexes with partialFilterExpression
// For documents with semester field:
studentSchema.index(
  { faculty: 1, semester: 1, rollNo: 1 },
  { unique: true, partialFilterExpression: { semester: { $exists: true } } }
);

// For documents with year field:
studentSchema.index(
  { faculty: 1, year: 1, rollNo: 1 },
  { unique: true, partialFilterExpression: { year: { $exists: true } } }
);

module.exports = mongoose.model("Student", studentSchema);
