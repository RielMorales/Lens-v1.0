import React, { useRef, useEffect, useState, useCallback} from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

const CameraCapture = ({ setProcessedUrl }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
           video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: "environment" }
           }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
            setCameraStarted(true);
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  const captureAndSend = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await axios.post(`${API_URL}/process-frame`, formData, {
          responseType: 'blob',
        });

        const imgUrl = URL.createObjectURL(response.data);
        setProcessedUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return imgUrl;
        });
      } catch (err) {
        console.error("Processing error:", err);
      }
    }, 'image/jpeg');
  }, [setProcessedUrl]);

  useEffect(() => {
    if (!cameraStarted) return;

    const interval = setInterval(captureAndSend, 500);
    return () => clearInterval(interval);
  }, [cameraStarted, captureAndSend]);

  return (
    <>
      <video ref={videoRef} width="auto" height="auto" autoPlay muted playsInline style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="auto" height="auto" style={{ display: 'none' }} />
    </>
  );
};

export default CameraCapture;
