// Import necessary React modules and components
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'

// Import local components
import CameraCapture from '../components/CameraCapture'
import PoseRenderer from '../components/PoseRenderer'
import Layout from '../components/Layout'

const Scanner = () => {
    // Store the current pose data
    const [pose, setPose] = useState(null)
    // Track whether the user has tapped to start (for audio permissions)
    const [started, setStarted] = useState(false)

    // Handler to start the experience (removes overlay and enables audio)
    const handleStart = () => {
        setStarted(true)
    }
    
    return (
        <Layout>    {/* Page layout wrapper with shared navbar */}
            <div>
                {/* Tap-to-start fullscreen overlay (enables audio and starts camera) */}
                {!started && (
                <div
                    onClick={handleStart}
                    style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    zIndex: 10,
                    cursor: 'pointer',
                    }}
                >
                    Tap to Start Audio
                </div>
                )}
                {/* Always keep the camera feed visible */}
                {/* Camera input and ArUco marker detection */}
                <CameraCapture onPoseUpdate={setPose} />
        
                {/* Overlay the 3D Canvas on top */}
                {/* WebGL Canvas for rendering 3D overlays */}
                <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',  // ensures canvas doesn't block interactions
                }}
                >
                <Canvas camera={{ position: [0, 0, 1] }}>
                    {/* Ambient light to illuminate 3D scene */}
                    <ambientLight />
                    {/* Optional helpers for debugging */}
                    {/* <axesHelper args={[0.1]} />
                    <gridHelper args={[1, 10]} /> */}
        
                    {/* Only the model disappears if pose is null */}
                    {/* Render video-textured plane only when pose data exists */}
                    {pose && <PoseRenderer poses={pose} />}
                </Canvas>
                </div>
            </div>
        </Layout>
    )
}

export default Scanner
