const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const studentRoutes = require('./routes/studentRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const collegeFeaturesRoutes = require('./routes/collegeFeaturesRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/qrcode', qrCodeRoutes);
app.use('/api/collegeFeatures', collegeFeaturesRoutes);
// app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
