import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const speak = (text) => {
  if (!('speechSynthesis' in window)) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'en-US';
  msg.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
};

const successSound = new Audio(
  'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'
);

function IDCard({ student }) {
  if (!student) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5 border border-gray-600">
      <div className="flex flex-col items-center border border-gray-200 rounded-md p-4 mb-6">
        {student.photo ? (
          <img
            src={`http://localhost:5000${student.photo}`}
            alt="student"
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md border border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-user.png'; // fallback default image in public folder
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#ccc',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '36px',
              color: '#666',
              marginBottom: '1rem',
            }}
          >
            👤
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold mt-3 text-gray-700 text-center">
          {student.name}
        </h2>
        <p className="text-sm sm:text-[16px] text-gray-600">Roll No: {student.rollNo}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 font-medium">
        <div className="border-b border-gray-300 max-w-full sm:max-w-[150px]">
          <p className="text-gray-500">Date of Birth</p>
          <p>{student.dob}</p>
        </div>
        <div className="border-b border-gray-300 max-w-full sm:max-w-[150px]">
          <p className="text-gray-500">Phone</p>
          <p>{student.phone}</p>
        </div>
        <div className="border-b border-gray-300 max-w-full sm:max-w-[150px]">
          <p className="text-gray-500">Faculty</p>
          <p>{student.faculty}</p>
        </div>
        <div className="border-b border-gray-300 max-w-full sm:max-w-[150px]">
          <p className="text-gray-500">Semester / Year</p>
          <p>{student.semester || student.year}</p>
        </div>
        <div className="col-span-1 sm:col-span-2 border-b border-gray-300 max-w-full">
          <p className="text-gray-500">Address</p>
          <p>{student.address}</p>
        </div>
        <div className="col-span-1 sm:col-span-2 border-b border-gray-300 max-w-full">
          <p className="text-gray-500">Validity Date</p>
          <p>{student.validity}</p>
        </div>
      </div>
    </div>
  );
}

export default function QRScanner() {
  const [students, setStudents] = useState([]);
  const [lastScannedStudent, setLastScannedStudent] = useState(null);
  const recentlyScanned = useRef(new Set());
  const html5QrcodeScannerRef = useRef(null);
  const qrCodeRegionId = 'html5qr-code-full-region';
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let Html5Qrcode;
    import('html5-qrcode').then((module) => {
      Html5Qrcode = module.Html5Qrcode;

      html5QrcodeScannerRef.current = new Html5Qrcode(qrCodeRegionId);

      html5QrcodeScannerRef.current
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          handleScan,
          (errorMessage) => {
            // handle scan errors here
          }
        )
        .catch((err) => {
          console.error('Unable to start scanning:', err);
          toast.error('Unable to access camera or start scanner.');
        });
    });

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleScan = async (decodedText) => {
    if (!decodedText) return;

    const studentId = decodedText.trim();
    if (recentlyScanned.current.has(studentId)) return;

    recentlyScanned.current.add(studentId);
    setTimeout(() => recentlyScanned.current.delete(studentId), 5000);

    if (students.some((s) => s.id === studentId && s.lastDate === today)) {
      toast.info('Student already marked present today.');
      speak('Student already marked present today.');
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/qrcode/student/${studentId}`
      );
      const student = res.data;

      if (!student) {
        toast.error('Student not found');
        speak('Student not found');
        return;
      }

      const studentData = {
        id: student._id || student.id,
        name: student.name,
        rollNo: student.rollNo,
        faculty: student.faculty,
        semester: student.semester,
        year: student.year,
        phone: student.phone,
        dob: student.dob,
        address: student.address,
        validity: student.validity,
        photo: student.photo,
        lastDate: today,
      };

      setStudents((prev) => [...prev, studentData]);
      setLastScannedStudent(studentData);

      toast.success(`${student.name}, Roll No: ${student.rollNo}, Present`);
      successSound.play();
      speak(`${student.name}, Roll Number ${student.rollNo}, Present`);
    } catch (error) {
      toast.error('Invalid QR code');
      speak('Invalid QR code');
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" autoClose={2000} />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          QR Code Attendance Scanner
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md sm:max-w-4xl">
          <div
            id={qrCodeRegionId}
            style={{
              width: '100%',
              maxWidth: 320,
              height: 320,
              borderRadius: 12,
              overflow: 'hidden',
              margin: '0 auto',
            }}
          ></div>

          <div className="w-full">
            <IDCard student={lastScannedStudent} />
          </div>
        </div>
      </div>
    </>
  );
}
