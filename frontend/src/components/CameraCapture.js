import { useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export default function CameraCapture({ onPoseUpdate }) {
  const videoRef = useRef()         // Reference to the video element
  const canvasRef = useRef()        // Reference to the hidden canvas element
  const streamRef = useRef(null);   // Store the media stream for cleanup

  useEffect(() => {
    // Request access to device camera on mount
    const getCamera = async () => {
      try {
         // Request video stream with preferred resolution and back camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: {ideal: 1280},
            height: {ideal: 720},
            facingMode: 'environment' // use 'user' for front camera
          },
          audio: false,
        })
        videoRef.current.srcObject = stream     // Set video source to stream
        streamRef.current = stream;             // Save stream for cleanup
        videoRef.current.onloadedmetadata = () => {
          // Autoplay video when metadata is loaded
          videoRef.current.play().catch((err) => {
            console.error("Autoplay error:", err)
          })
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    getCamera()   // Start camera stream
  }, [])

  useEffect(() => {
    // Periodically capture frames and send to backend for pose detection
    const interval = setInterval(async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d')
      canvas.width = video.videoWidth     // Match canvas size to video
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)   // Draw video frame on canvas

      canvas.toBlob(async (blob) => {
        if (!blob) return

        // Debug: log frame dimensions
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          console.log("✅ Frame size:", img.width, "x", img.height)
          URL.revokeObjectURL(url)
        }
        img.src = url

        // Prepare frame as form data for API request
        const formData = new FormData()
        formData.append('file', blob, 'frame.jpg')
      

        try {
            // Send frame to backend for pose estimation
            const res = await axios.post(
            `${API_URL}/process-frame/`, // // adjust URL if backend is hosted elsewhere
            formData
            )

            // console.log("📦 res.data content:", res.data.poses[0])
            
            // Update parent component with detected poses or empty array if none
            if (Array.isArray(res.data.poses) && res.data.poses.length > 0) {
              // Pass the entire array of marker poses
              onPoseUpdate(res.data.poses) // each should have id, rvec, tvec
            } else {
              onPoseUpdate([]) // no markers detected
            }
        } catch (err) {
          console.error('Error sending frame:', err)
        }
      }, 'image/jpeg')
    }, 500) // Capture every 500ms; adjust interval for performance

    // Cleanup on unmount: stop video tracks and clear interval
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      clearInterval(interval)
    }
  }, [onPoseUpdate])

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 0,
        }}
      />

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  )
}
