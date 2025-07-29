import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraCapture from '../components/CameraCapture'
import PoseRenderer from '../components/PoseRenderer'
import Layout from '../components/Layout'

const Scanner = () => {
    const [pose, setPose] = useState(null)
    const [started, setStarted] = useState(false)

    const handleStart = () => {
        setStarted(true)
    }
    
    return (
        <Layout>
            <div>
                {/* ✅ Tap-to-start overlay */}
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
                {/* ✅ Always keep the camera feed visible */}
                <CameraCapture onPoseUpdate={setPose} />
        
                {/* ✅ Overlay the 3D Canvas on top */}
                <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
                >
                <Canvas camera={{ position: [0, 0, 1] }}>
                    {/* ✅ Optional: Add ambient light or helpers */}
                    <ambientLight />
                    {/* <axesHelper args={[0.1]} />
                    <gridHelper args={[1, 10]} /> */}
        
                    {/* ✅ Only the model disappears if pose is null */}
                    {pose && <PoseRenderer poses={pose} />}
                </Canvas>
                </div>
            </div>
        </Layout>
    )
}

export default Scanner
