import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [streaming, setStreaming] = useState(false);

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

  useEffect(() => {
    let interval;
    if (streaming) {
      interval = setInterval(captureAndSend, 60); // every 200ms
    }
    return () => clearInterval(interval);
  }, [streaming]);

  const captureAndSend = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await axios.post('http://127.0.0.1:8000/process-frame/', formData, {
          responseType: 'blob',
        });
        const imgUrl = URL.createObjectURL(response.data);
        setProcessedUrl(imgUrl);
      } catch (error) {
        console.error('Processing error:', error);
      }
    }, 'image/jpeg');
  };

  return (
    <div>
      <h1>Live Video Processing with FastAPI</h1>
      <video ref={videoRef} width="320" height="240" autoPlay muted playsInline />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
      <button onClick={() => setStreaming(!streaming)}>
        {streaming ? 'Stop Stream' : 'Start Stream'}
      </button>

      <div>
        <h2>Processed Video:</h2>
        {processedUrl && <img src={processedUrl} alt="Processed Frame" width="320" height="240" />}
      </div>
    </div>
  );
}

export default App;
