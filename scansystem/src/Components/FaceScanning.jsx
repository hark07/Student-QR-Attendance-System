import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceScanning() {
  // 1. Refs for video and canvas elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 2. Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // 3. Students list with image URLs (use clear face photos)
  const [students, setStudents] = useState([
    {
      name: "Hark Dhami",
      roll: "1",
      lastDate: null,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Janak Saud",
      roll: "2",
      lastDate: null,
      image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      name: "Suresh Raj Pant",
      roll: "3",
      lastDate: null,
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Deepak Bohora",
      roll: "4",
      lastDate: null,
      image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
  ]);

  // 4. State variables for UI feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedFaces, setDetectedFaces] = useState(0);

  // 5. To avoid marking attendance multiple times rapidly
  const recentlyMarked = useRef(new Set());

  // 6. Store face descriptors for recognition
  const labeledDescriptors = useRef(null);

  // 7. Load models and prepare labeled descriptors
  useEffect(() => {
    // IMPORTANT: Use '/models' assuming your model files are inside public/models
    const MODEL_URL = "/models";

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ])
      .then(async () => {
        // Prepare labeled face descriptors for each student
        const labeledFaceDescriptors = [];

        for (const student of students) {
          try {
            const img = await faceapi.fetchImage(student.image);
            const detection = await faceapi
              .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (!detection) {
              console.warn(`No face detected for ${student.name}, skipping.`);
              continue;
            }

            labeledFaceDescriptors.push(
              new faceapi.LabeledFaceDescriptors(student.roll, [detection.descriptor])
            );
          } catch (err) {
            console.error(`Error processing ${student.name}:`, err);
          }
        }

        if (labeledFaceDescriptors.length === 0) {
          setError("No valid student face data available.");
          return;
        }

        labeledDescriptors.current = labeledFaceDescriptors;
        setLoading(false);
        startVideo();
      })
      .catch((err) => {
        console.error("Error loading models or preparing descriptors:", err);
        setError("Failed to load face detection or recognition models.");
      });

    // 8. Start webcam video
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Cannot access webcam. Please allow camera permissions.");
      }
    }
  }, [students]);

  // 9. Face recognition and attendance marking loop
  useEffect(() => {
    if (!loading && !error && labeledDescriptors.current) {
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors.current, 0.6); // threshold = 0.6

      const interval = setInterval(async () => {
        if (
          videoRef.current &&
          canvasRef.current &&
          !videoRef.current.paused &&
          !videoRef.current.ended
        ) {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          setDetectedFaces(detections.length);

          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          };

          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

          // Match detected faces & mark attendance
          resizedDetections.forEach((detection) => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            if (bestMatch.label !== "unknown") {
              if (!recentlyMarked.current.has(bestMatch.label)) {
                recentlyMarked.current.add(bestMatch.label);
                setTimeout(() => recentlyMarked.current.delete(bestMatch.label), 5000); // cooldown 5 sec

                setStudents((prevStudents) => {
                  const updated = [...prevStudents];
                  const idx = updated.findIndex((s) => s.roll === bestMatch.label);
                  if (idx !== -1 && updated[idx].lastDate !== today) {
                    updated[idx].lastDate = today;
                  }
                  return updated;
                });
              }
            }
          });
        }
      }, 200); // run every 200 ms

      return () => clearInterval(interval);
    }
  }, [loading, error, today]);

  // 10. JSX for UI
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#222",
        color: "white",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <h2>Face Recognition Attendance Demo</h2>

      {loading && <p>Loading face detection and recognition models...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "360px",
            height: "270px",
            borderRadius: "12px",
            backgroundColor: "#000",
          }}
          onPlay={() => {
            if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "12px",
            pointerEvents: "none",
            width: "360px",
            height: "270px",
          }}
        />
      </div>

      <p style={{ marginTop: "10px" }}>
        Faces detected: <strong>{detectedFaces}</strong>
      </p>

      <h3>Attendance Today ({today})</h3>
      <div
        style={{
          maxWidth: 360,
          margin: "10px auto",
          textAlign: "left",
          backgroundColor: "#333",
          padding: 15,
          borderRadius: 8,
        }}
      >
        {students.map((s) => (
          <div
            key={s.roll}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 0",
              borderBottom: "1px solid #555",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={s.image}
                alt={s.name}
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
              />
              <span>
                {s.name} (Roll {s.roll})
              </span>
            </div>
            <span style={{ color: s.lastDate === today ? "lightgreen" : "tomato" }}>
              {s.lastDate === today ? "Present" : "Absent"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
