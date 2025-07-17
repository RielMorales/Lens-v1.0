import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraCapture from '../components/CameraCapture'
import PoseRenderer from '../components/PoseRenderer'

const Scan = () => {
    const [pose, setPose] = useState(null)
    return (
        <div>
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
                {pose && <PoseRenderer rvec={pose.rvec} tvec={pose.tvec} />}
            </Canvas>
            </div>
        </div>
    )
}

export default Scan
