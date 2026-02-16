const CollegeFeature = require("../models/CollegeFeature");

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await CollegeFeature.find({});
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const { facultyName } = req.body;
    if (!facultyName || !facultyName.trim()) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const existing = await CollegeFeature.findOne({
      facultyName: facultyName.trim(),
    });
    if (existing) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    const newFaculty = new CollegeFeature({
      facultyName: facultyName.trim(),
      semesters: [],
      years: [],
    });

    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Faculty name must be unique" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Update faculty name
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyName } = req.body;

    if (!facultyName || !facultyName.trim()) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const faculty = await CollegeFeature.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const existing = await CollegeFeature.findOne({
      facultyName: facultyName.trim(),
    });
    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "Faculty name already exists" });
    }

    faculty.facultyName = facultyName.trim();
    await faculty.save();

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await CollegeFeature.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    await faculty.deleteOne();
    res.json({ message: "Faculty deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add semester or year
exports.addItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name } = req.body;

    if (!["semester", "year"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: `${type} name is required` });
    }

    const faculty = await CollegeFeature.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const list = type === "semester" ? faculty.semesters : faculty.years;
    if (list.includes(name.trim())) {
      return res.status(400).json({ message: `${type} already exists` });
    }

    list.push(name.trim());
    await faculty.save();

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update semester or year item
exports.updateItem = async (req, res) => {
  try {
    const { id, type, index } = req.params;
    const { name } = req.body;

    if (!["semester", "year"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: `${type} name is required` });
    }

    const idx = parseInt(index);
    if (isNaN(idx)) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const faculty = await CollegeFeature.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const list = type === "semester" ? faculty.semesters : faculty.years;

    if (idx < 0 || idx >= list.length) {
      return res.status(400).json({ message: "Index out of range" });
    }

    if (list.includes(name.trim()) && list[idx] !== name.trim()) {
      return res.status(400).json({ message: `${type} already exists` });
    }

    list[idx] = name.trim();
    await faculty.save();

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete semester or year item
exports.deleteItem = async (req, res) => {
  try {
    const { id, type, index } = req.params;

    if (!["semester", "year"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const idx = parseInt(index);
    if (isNaN(idx)) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const faculty = await CollegeFeature.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const list = type === "semester" ? faculty.semesters : faculty.years;

    if (idx < 0 || idx >= list.length) {
      return res.status(400).json({ message: "Index out of range" });
    }

    list.splice(idx, 1);
    await faculty.save();

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
