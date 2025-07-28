import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Map of marker IDs to video file paths
const VIDEO_MAP = {
  '1': '/assets/videos/A Prelude to the 25th Anniversary Audio-Visual Presentation.mp4',
  '2': '/assets/videos/Launching of UPOU Projects Audio-Visual Presentation.mp4',
  '3': '/assets/videos/UPOU 24th Anniversary (2019) Audio-Visual Presentation.mp4',
}

export default function PoseRenderer({ poses }) {
  const meshRefs = useRef({})
  const videoRefs = useRef({})
  const markerVisibleFrames = useRef({})
  const [videoTextures, setVideoTextures] = useState({})

  const smoothArray = (prev, curr, alpha = 0.2) => {
    if (!prev) return curr
    return prev.map((p, i) => p * (1 - alpha) + curr[i] * alpha)
  }

  useEffect(() => {
    Object.entries(VIDEO_MAP).forEach(([id, path]) => {
      const video = document.createElement('video')
      video.src = path
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = false // enable audio
      video.playsInline = true

      video.addEventListener('canplaythrough', () => {
        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBFormat

        videoRefs.current[id] = video

        setVideoTextures(prev => ({
          ...prev,
          [id]: { video, texture }
        }))
      })

      video.load()
    })
  }, [])

  useFrame(() => {
    Object.entries(videoTextures).forEach(([id, { video }]) => {
      const mesh = meshRefs.current[id]
      if (mesh) mesh.visible = false

      // Decrease visibility count
      markerVisibleFrames.current[id] = Math.max((markerVisibleFrames.current[id] || 0) - 1, 0)

      if (markerVisibleFrames.current[id] === 0 && !video.paused) {
        video.pause()
      }
    })

    if (!poses || poses.length === 0) return

    poses.forEach(({ id, rvec, tvec }) => {
      const mesh = meshRefs.current[id]
      const entry = videoTextures[id]
      if (!mesh || !entry) return

      // Increase visibility count
      markerVisibleFrames.current[id] = 15

      mesh.visible = true
      const { video } = entry

      if (video.paused) {
        video.play().catch(e => console.warn(`Playback error: ${e}`))
      }

      const scaleFactor = 10
      const prevPose = mesh.userData.prevPose || {}
      const smoothedTvec = smoothArray(prevPose.tvec, tvec)

      mesh.position.set(
        smoothedTvec[0] * scaleFactor + 0.2,
        -smoothedTvec[1] * scaleFactor - 0.0,
        -smoothedTvec[2] * scaleFactor - 0.0
      )

      const theta = Math.sqrt(rvec[0] ** 2 + rvec[1] ** 2 + rvec[2] ** 2)
      if (theta > 0) {
        const axis = new THREE.Vector3(...rvec).normalize()
        const q = new THREE.Quaternion().setFromAxisAngle(axis, theta)
        const adjustQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.PI / 1, 0, 0)
        )
        q.multiply(adjustQuat)

        if (!prevPose.quaternion) {
          mesh.quaternion.copy(q)
        } else {
          mesh.quaternion.slerp(q, 0.2)
        }

        mesh.userData.prevPose = { quaternion: q.clone(), tvec: smoothedTvec }
      }
    })
  })

  return (
    <>
      {Object.entries(videoTextures).map(([id, { texture }]) => (
        <mesh
          key={id}
          ref={(ref) => (meshRefs.current[id] = ref)}
          scale={[3, 1.68, 1]}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}
