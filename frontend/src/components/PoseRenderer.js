import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PoseRenderer({ rvec, tvec }) {
  const meshRef = useRef()
  const videoRef = useRef(null)
  const [videoTexture, setVideoTexture] = useState(null)
  const previousPose = useRef({ quaternion: null, tvec: null })

  // Helper for smoothing translation
  const smoothArray = (prev, curr, alpha = 0.1) => {
    if (!prev) return curr
    return prev.map((p, i) => p * (1 - alpha) + curr[i] * alpha)
  }

  useEffect(() => {
    const video = document.createElement('video')
    video.src = '/assets/videos/A Prelude to the 25th Anniversary Audio-Visual Presentation.mp4' // ✅ Make sure this file exists in public/assets/
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    video.oncanplay = () => {
      video.play()
      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBFormat
      setVideoTexture(texture)
    }

    videoRef.current = video
  }, [])

  useFrame(() => {
    if (!meshRef.current || !rvec || !tvec || !videoTexture) return

    const scaleFactor = 10

    // === Smooth translation ===
    const smoothedTvec = smoothArray(previousPose.current.tvec, tvec)
    const position = new THREE.Vector3(
      smoothedTvec[0] * scaleFactor + 0.20,
      -smoothedTvec[1] * scaleFactor - 0.50,
      -smoothedTvec[2] * scaleFactor - 2.00
    )
    meshRef.current.position.copy(position)

    // === Convert rvec to quaternion ===
    const theta = Math.sqrt(rvec[0] ** 2 + rvec[1] ** 2 + rvec[2] ** 2)
    let quaternion = new THREE.Quaternion()
    if (theta > 0) {
      const axis = new THREE.Vector3(...rvec).normalize()
      quaternion.setFromAxisAngle(axis, theta)

      const manualQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI / 1, 0.5, 0)
      )
      quaternion.multiply(manualQuat)
    }

    if (!previousPose.current.quaternion) {
      previousPose.current.quaternion = quaternion.clone()
    } else {
      previousPose.current.quaternion.slerp(quaternion, 0.2)
    }

    meshRef.current.quaternion.copy(previousPose.current.quaternion)
    previousPose.current.tvec = smoothedTvec
  })

  return (
    <>
      {videoTexture && (
        <mesh ref={meshRef} scale={[1.5, 0.84, 1]}>
          {/* 16:9 video aspect ratio: 1.5 wide x 0.84 tall */}
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      )}
    </>
  )
}
