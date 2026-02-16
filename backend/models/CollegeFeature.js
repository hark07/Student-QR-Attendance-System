const mongoose = require('mongoose');

const CollegeFeatureSchema = new mongoose.Schema({
  facultyName: { type: String, required: true, unique: true },
  semesters: { type: [String], default: [] },
  years: { type: [String], default: [] },
});

module.exports = mongoose.model('CollegeFeature', CollegeFeatureSchema);
