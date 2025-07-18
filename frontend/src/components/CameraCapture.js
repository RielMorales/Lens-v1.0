import { useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export default function CameraCapture({ onPoseUpdate }) {
  const videoRef = useRef()
  const canvasRef = useRef()
  const streamRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: {ideal: 1280},
            height: {ideal: 720},
            facingMode: 'environment' 
          }, // or 'user' for front cam
          audio: false,
        })
        videoRef.current.srcObject = stream
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.error("Autoplay error:", err)
          })
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    getCamera()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          console.log("✅ Frame size:", img.width, "x", img.height)
          URL.revokeObjectURL(url)
        }
        img.src = url

        const formData = new FormData()
        formData.append('file', blob, 'frame.jpg')
      

        try {
            const res = await axios.post(
            `${API_URL}/process-frame/`, // 🔁 adjust if hosted
            formData
            )

            // console.log("📦 res.data content:", res.data.poses[0])
            

            if (res.data.poses[0] === undefined){
                onPoseUpdate(null)
            } else {
                const { rvec, tvec } = res.data.poses[0]
                console.log("Sending pose:", rvec, tvec)
                // console.log("📦 res.data type:", typeof res.data)
                // console.log("📦 res.data content:", res.data)
                // console.log("rvec:", rvec)
                // console.log("tvec:", tvec)

                if (rvec && tvec) {
                    onPoseUpdate({ rvec, tvec })
                } else {
                    onPoseUpdate(null)
                }
            }
        } catch (err) {
          console.error('Error sending frame:', err)
        }
      }, 'image/jpeg')
    }, 60) // adjust interval for performance

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
