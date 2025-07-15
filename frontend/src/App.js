import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [processedUrl, setProcessedUrl] = useState(null);

  // Start camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch(err => console.error("Autoplay error:", err));
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  // Start streaming frames immediately
  useEffect(() => {
    const interval = setInterval(captureAndSend, 200); // ~16 FPS
    return () => clearInterval(interval);
  }, []);

  // Capture and send frame to backend
  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await axios.post('http://127.0.0.1:8000/process-frame/', formData, {
          responseType: 'blob',
        });

        const imgUrl = URL.createObjectURL(response.data);
        setProcessedUrl(prev => {
          if (prev) URL.revokeObjectURL(prev); // Clean up old blobs
          return imgUrl;
        });
      } catch (error) {
        console.error('Processing error:', error);
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <h1>Processed AR Video</h1>

      {/* Hidden video and canvas for processing only */}
      <video ref={videoRef} width="320" height="240" autoPlay muted playsInline style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

      {/* Display only processed video */}
      <div>
        {processedUrl ? (
          <img src={processedUrl} alt="Processed Frame" width="320" height="240" />
        ) : (
          <p>Waiting for video...</p>
        )}
      </div>
    </div>
  );
}

export default App;
