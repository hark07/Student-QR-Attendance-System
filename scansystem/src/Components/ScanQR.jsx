import React, { useState, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔊 SPEAK */
const speak = (text) => {
  if (!("speechSynthesis" in window)) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
};

/* 🔊 SOUNDS */
const successSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
);

export default function ScanQR() {
  const today = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([
    { name: "Hark Dhami", roll: "1", lastDate: null },
    { name: "Janak Saud", roll: "2", lastDate: null },
    { name: "Suresh Raj Pant", roll: "3", lastDate: null },
    { name: "Deepak Bohora", roll: "4", lastDate: null },
  ]);

  const recentlyScanned = useRef(new Set());
  const scanLocked = useRef(false);

  const handleScan = (result) => {
    if (!result) return;
    if (scanLocked.current) return;

    scanLocked.current = true;
    setTimeout(() => (scanLocked.current = false), 10);

    try {
      const data = JSON.parse(result.text);
      const roll = data.roll;

      if (recentlyScanned.current.has(roll)) {
        return;
      }

      const index = students.findIndex((s) => s.roll === roll);

      if (index === -1) {
        toast.error("Student not found");
        speak("Student not found");
        recentlyScanned.current.add(roll);
        setTimeout(() => recentlyScanned.current.delete(roll), 1000);
        return;
      }

      recentlyScanned.current.add(roll);
      setTimeout(() => recentlyScanned.current.delete(roll), 2000);

      if (students[index].lastDate !== today) {
        const updated = [...students];
        updated[index].lastDate = today;
        setStudents(updated);

        toast.success(
          `${updated[index].name}, RollNumber ${updated[index].roll}, Present`
        );
        successSound.play();
        speak(
          `${updated[index].name}, RollNumber ${updated[index].roll}, Present`
        );
      } else {
        toast.info(
          `${students[index].name}, RollNumber ${students[index].roll}, Already Present`
        );
        speak(
          `${students[index].name}, RollNumber ${students[index].roll}, Already Present`
        );
      }
    } catch {
      toast.error("Invalid QR");
      speak("Invalid QR code");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" autoClose={1500} />
      <div className="min-h-screen bg-transparent flex justify-center items-center p-4">
        {/* iPhone Frame Container */}
        <div
          className="relative bg-gray-500 rounded-3xl shadow-2xl"
          style={{
            width: 370,
            height: 400,
            border: "16px solid #111",
            borderRadius: 60,
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 210,
              height: 30,
              background: "#111",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              zIndex: 10,
            }}
          ></div>

          {/* Header */}
          <header className="text-white text-center font-semibold text-xl p-4 pt-8 select-none">
            QR SCAN
          </header>

          {/* Scanner */}
          <div
            className="absolute inset-x-0 top-[72px] bottom-4 rounded-2xl overflow-hidden"
            style={{ margin: "0 20px" }}
          >
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              videoStyle={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
