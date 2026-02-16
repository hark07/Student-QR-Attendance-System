const express = require("express");
const router = express.Router();
const { parser: upload } = require("../config/cloudinary");
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", upload.single("photo"), addStudent);
router.put("/:id", upload.single("photo"), updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
