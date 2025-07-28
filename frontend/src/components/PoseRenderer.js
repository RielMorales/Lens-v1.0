import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PoseRenderer({ rvec, tvec }) {
  const meshRef = useRef()
  const videoRef = useRef(null)
  const [videoTexture, setVideoTexture] = useState(null)
  const previousPose = useRef({ quaternion: null, tvec: null })
  const [markerVisible, setMarkerVisible] = useState(false)
  const markerTimeout = useRef(null)

  // Smooth interpolation helper
  const smoothArray = (prev, curr, alpha = 0.1) => {
    if (!prev) return curr
    return prev.map((p, i) => p * (1 - alpha) + curr[i] * alpha)
  }

  useEffect(() => {
    const video = document.createElement('video')
    video.src = '/assets/videos/A Prelude to the 25th Anniversary Audio-Visual Presentation.mp4'
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = false
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

    return () => {
      // CLEANUP on unmount
      video.pause()
      video.src = ''
      video.load()
      video.remove()
    }
  }, [])


  // Marker visibility tracker
  useEffect(() => {
    if (rvec && tvec) {
      setMarkerVisible(true)
      clearTimeout(markerTimeout.current)
      markerTimeout.current = setTimeout(() => {
        setMarkerVisible(false)
      }, 1000) // Hide mesh & pause video if no updates for 1 sec
    }
  }, [rvec, tvec])

  useFrame(() => {
    const mesh = meshRef.current
    const video = videoRef.current

    if (!mesh || !videoTexture) return

    if (markerVisible) {
      mesh.visible = true

      if (video.paused || video.ended) {
        video.play().catch(e => console.warn("Video play error:", e))
        video.muted = false
      }

    } else {
      mesh.visible = false

      // FULL AUDIO STOP: pause, rewind, unload source
      if (!video.paused) {
        video.pause()
        video.currentTime = 0

        // Unload video to stop any residual playback
        const tempSrc = video.src
        video.src = ''
        video.load() // Force stop audio
        video.src = tempSrc // Restore source, will auto play later
      }
    }

    if (!rvec || !tvec) {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.src = ''
        videoRef.current.load()
      }
      if (meshRef.current) meshRef.current.visible = false
      return
    }

    // Smooth translation
    const scaleFactor = 10
    const smoothedTvec = smoothArray(previousPose.current.tvec, tvec)
    mesh.position.set(
      smoothedTvec[0] * scaleFactor + 0.20,
      -smoothedTvec[1] * scaleFactor - 0.50,
      -smoothedTvec[2] * scaleFactor - 2.00
    )

    // Smooth rotation from rvec → quaternion
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

    mesh.quaternion.copy(previousPose.current.quaternion)
    previousPose.current.tvec = smoothedTvec
  })

  return (
    <>
      {videoTexture && (
        <mesh ref={meshRef} scale={[3, 1.68, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      )}
    </>
  )
}
