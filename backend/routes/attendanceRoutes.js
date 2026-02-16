const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByStudent, getAttendanceSummary } = require('../controllers/attendanceController');

router.post('/mark', markAttendance);
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/summary', getAttendanceSummary);

module.exports = router;
