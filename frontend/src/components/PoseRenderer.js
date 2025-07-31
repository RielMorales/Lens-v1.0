import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Map of marker IDs to associated video file paths
const VIDEO_MAP = {
  '1': '/assets/videos/A Prelude to the 25th Anniversary Audio-Visual Presentation.mp4',
  '2': '/assets/videos/Launching of UPOU Projects Audio-Visual Presentation.mp4',
  '3': '/assets/videos/UPOU 24th Anniversary (2019) Audio-Visual Presentation.mp4',
}

export default function PoseRenderer({ poses }) {
  const meshRefs = useRef({})                 // Stores mesh references for each marker ID
  const videoRefs = useRef({})                // Stores video elements per marker ID
  const markerVisibleFrames = useRef({})      // Tracks how long a marker remains visible
  const [videoTextures, setVideoTextures] = useState({})  // Stores textures and video objects

  // Smooth transition between previous and current translation vectors
  const smoothArray = (prev, curr, alpha = 0.2) => {
    if (!prev) return curr
    return prev.map((p, i) => p * (1 - alpha) + curr[i] * alpha)
  }

  useEffect(() => {
    // Load and prepare video textures on component mount
    Object.entries(VIDEO_MAP).forEach(([id, path]) => {
      const video = document.createElement('video')
      video.src = path
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = false           // Audio enabled (adjust if needed)
      video.playsInline = true      // Required for mobile playback

      // Once video is ready, generate texture
      video.addEventListener('canplaythrough', () => {
        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBFormat

        // Save video and its texture
        videoRefs.current[id] = video
        setVideoTextures(prev => ({
          ...prev,
          [id]: { video, texture }
        }))
      })

      video.load()  // Begin loading
    })
  }, [])

  useFrame(() => {
    // Runs every frame (~60fps) to update marker visibility and video state
    Object.entries(videoTextures).forEach(([id, { video }]) => {
      const mesh = meshRefs.current[id]
      if (mesh) mesh.visible = false

      // Decrease visibility timer for this marker
      markerVisibleFrames.current[id] = Math.max((markerVisibleFrames.current[id] || 0) - 1, 0)

      // If not visible anymore and video is still playing, pause it
      if (markerVisibleFrames.current[id] === 0 && !video.paused) {
        video.pause()
      }
    })

    if (!poses || poses.length === 0) return

    // Loop through all detected poses
    poses.forEach(({ id, rvec, tvec }) => {
      const mesh = meshRefs.current[id]
      const entry = videoTextures[id]
      if (!mesh || !entry) return

      // Reset visibility timeout
      markerVisibleFrames.current[id] = 15
      mesh.visible = true

      const { video } = entry
      if (video.paused) {
        // Autoplay video if not already playing
        video.play().catch(e => console.warn(`Playback error: ${e}`))
      }

      const scaleFactor = 10
      const prevPose = mesh.userData.prevPose || {}
      // Smooth translation vector
      const smoothedTvec = smoothArray(prevPose.tvec, tvec)

      // Update 3D position based on smoothed translation vector
      mesh.position.set(
        smoothedTvec[0] * scaleFactor + 1.0,      // x: left/right
        -smoothedTvec[1] * scaleFactor + 1.0,     // y: up/down (inverted)
        -smoothedTvec[2] * scaleFactor - 5.0      // z: forward/backward (into screen)
      )

      // Convert rotation vector (rvec) to quaternion
      const theta = Math.sqrt(rvec[0] ** 2 + rvec[1] ** 2 + rvec[2] ** 2)
      if (theta > 0) {
        const axis = new THREE.Vector3(...rvec).normalize()
        const q = new THREE.Quaternion().setFromAxisAngle(axis, theta)
        
        // Adjust orientation (rotate 180° around X axis)
        const adjustQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.PI / 1, -0.5, 0)
        )
        q.multiply(adjustQuat)

        // Smooth rotation using slerp (spherical interpolation)
        if (!prevPose.quaternion) {
          mesh.quaternion.copy(q)
        } else {
          mesh.quaternion.slerp(q, 0.2)
        }

        // Save this pose as previous pose for next frame
        mesh.userData.prevPose = { quaternion: q.clone(), tvec: smoothedTvec }
      }
    })
  })

  return (
    <>
    {/* Create mesh for each marker ID and attach corresponding video texture */}
      {Object.entries(videoTextures).map(([id, { texture }]) => (
        <mesh
          key={id}
          ref={(ref) => (meshRefs.current[id] = ref)}
          scale={[6, 3.36, 1]}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />   {/* Flat plane to display video */}
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}
