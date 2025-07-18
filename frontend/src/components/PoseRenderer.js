import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function PoseRenderer({ rvec, tvec }) {
  const modelRef = useRef()
  // const [videoTexture, setVideoTexture] = useState(null)
  // const [videoScale, setVideoScale] = useState([])
  const gltf = useGLTF('/assets/gltf/asset.gltf') // or /assets/test.glb

  const previousPose = useRef({ rvec: null, tvec: null })

  const { gl } = useThree()

  // Low-pass filter function
  const smoothArray = (prev, curr, alpha = 0.1) => {
    if (!prev) return curr
    return prev.map((p, i) => p * (1 - alpha) + curr[i] * alpha)
  }

  useEffect(() => {

    // const canvas = gl.domElement

    // const width = 1024 * 1.5
    // const height = 576 * 1.5

    // canvas.style.width = `${width}px`
    // canvas.style.height = `${height}px`

    // gl.setSize(width, height, false)
    // gl.setPixelRatio(window.devicePixelRatio) // optional for sharpness
    // console.log("🎥 WebGL canvas size:", canvas.width, "x", canvas.height)

    const video = document.createElement('video')
    video.autoplay = true
    video.muted = true
    video.playsInline = true

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        video.srcObject = stream
        video.onloadedmetadata = () => {
          // const aspectRatio = video.videoWidth / video.videoHeight
          // const height = 10
          // const width = height * aspectRatio
          // setVideoScale([width, height, 1])
        }
        video.play()
        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        // setVideoTexture(texture)
      })
}, [gl])


  useFrame(() => {
      // if (!modelRef.current || !rvec || !tvec) return

      // console.log("✅ Pose Data", { rvec, tvec })

      // // Smooth the pose
      // const smoothedRvec = smoothArray(previousPose.current.rvec, rvec)
      // const smoothedTvec = smoothArray(previousPose.current.tvec, tvec)

      // previousPose.current = {
      //   rvec: smoothedRvec,
      //   tvec: smoothedTvec,
      // }

      // const scaleFactor = 10

      // // Convert translation from cm to meters, flip axes to match Three.js convention
      // const position = new THREE.Vector3(
      //   smoothedTvec[0] * scaleFactor +0.20, // +Right    -Left
      //   -smoothedTvec[1] * scaleFactor -0.50, //+Up       -Down
      //   -smoothedTvec[2] * scaleFactor -2.00 // +Forward  -Backward  
      // )

      // modelRef.current.position.copy(position)

      // // Convert rvec (Rodrigues) to quaternion
      // const theta = Math.sqrt(smoothedRvec[0] ** 2 + smoothedRvec[1] ** 2 + smoothedRvec[2] ** 2)
      // if (theta > 0) {
      // const axis = new THREE.Vector3(...smoothedRvec).normalize()
      // const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, theta)
      
      // // modelRef.current.quaternion.copy(quaternion)

      // // Manual rotation adjustment (example: rotate 90° on X)
      // const manualQuat = new THREE.Quaternion().setFromEuler(
      // new THREE.Euler(Math.PI / 1, 0.5, 0) // ← change angles here
      // )

      // // Combine rotations: marker * manual
      // modelRef.current.quaternion.copy(quaternion.multiply(manualQuat))
      // }
    if (!modelRef.current || !rvec || !tvec) return

    const scaleFactor = 10

    // === Smooth translation ===
    const smoothedTvec = smoothArray(previousPose.current.tvec, tvec)

    const position = new THREE.Vector3(
      smoothedTvec[0] * scaleFactor + 0.20,
      -smoothedTvec[1] * scaleFactor - 0.50,
      -smoothedTvec[2] * scaleFactor - 2.00
    )

    modelRef.current.position.copy(position)

    // === Convert rvec to quaternion ===
    const theta = Math.sqrt(rvec[0] ** 2 + rvec[1] ** 2 + rvec[2] ** 2)
    let quaternion = new THREE.Quaternion()
    if (theta > 0) {
      const axis = new THREE.Vector3(...rvec).normalize()
      quaternion.setFromAxisAngle(axis, theta)

      // Apply manual adjustment (e.g. 90° rotation)
      const manualQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI / 1, 0.5, 0)
      )
      quaternion.multiply(manualQuat)
    }

    // === Smooth quaternion ===
    if (!previousPose.current.quaternion) {
      previousPose.current.quaternion = quaternion.clone()
    } else {
      previousPose.current.quaternion.slerp(quaternion, 0.2)
    }

    modelRef.current.quaternion.copy(previousPose.current.quaternion)

    // Store smoothed tvec too
    previousPose.current.tvec = smoothedTvec
  })

  return (
    <>
      {/* {videoTexture && (
        <mesh scale={[gl.width, gl.height, 1]} position={[0, 0, -1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      )} */}

      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={0.005}
      />

        {/* <mesh ref={modelRef}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh> */}

    </>
  )
}
