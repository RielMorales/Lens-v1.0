UPOU Lens 📱✨
A marker-based Augmented Reality (AR) web application for exploring the University of the Philippines Open University (UPOU) campus through interactive video overlays.

🎯 Overview
UPOU Lens transforms campus exploration through Augmented Reality. Point your mobile camera at ArUco markers placed around the UPOU campus to unlock location-specific video content and information about buildings, landmarks, and campus history.
✨ Key Features

📱 Mobile-First Design - Runs entirely in web browsers, no app installation required
🎯 Marker-Based AR - Scan ArUco markers to trigger AR content
🎥 Video Overlays - High-quality video content aligned to physical markers
🏛️ Campus Information - Detailed information about UPOU buildings and landmarks
📐 3D Model Support - Ready support for 3D model overlays
🌐 Cross-Platform - Works on iOS Safari, Android Chrome, and modern browsers
⚡ Real-Time Processing - Live camera feed with AR rendering

🏗️ Architecture
Mobile Browser (React + Three.js)
        ↓
    Camera Feed
        ↓
FastAPI Backend (Python + OpenCV)
        ↓
   Marker Detection
        ↓
   AR Content Overlay

Tech Stack
Frontend:
React.js - UI framework
Three.js / React Three Fiber - 3D graphics, video and AR rendering
WebRTC - Camera access
Modern web browsers with WebGL support

Backend:
FastAPI - Python web framework
OpenCV - Computer vision and ArUco marker detection
Python 3.8+ - Core backend language

Deployment:
Netlify - Frontend hosting and CDN
Render - Backend API hosting

🚀 Getting Started
Prerequisites

Node.js 16+ and npm
Python 3.8+
Modern mobile browser with camera support
Stable internet connection (minimum 1 Mbps)

Setup
bash# Clone the repository
git clone https://github.com/RielMorales/Lens-v1.0.git

# Install dependencies in Frontend
npm install

# Start development server
npm start

# Create virtual environment
python -m venv venv
source venv/bin/activate  #On Linux/WSL

# Install dependencies in Backend
pip install -r requirements.txt

# Start development server
python3 main.py

Environment Variables
Create .env files in frontend:
Frontend (.env):
REACT_APP_API_URL= http://localhost:8000 or https://lens-v1-0.onrender.com

📱 Usage
Open the App: Visit the deployed URL (lensv1.netlify.app)(recommended) or run locally 
Grant Camera Permission: Allow browser access to your device camera
Find a Marker: Locate ArUco markers around the UPOU campus
Scan and Explore: Point your camera at markers to see AR content
Interact: Enjoy videos and information about campus locations

🎯 ArUco Markers
Specifications
Dictionary: ArUco 4x4, 5x5, and 6x6 supported (Currently using 4x4)
Size: 80mm x 80mm recommended
Quality: High-contrast printing on matte paper
Placement: Eye level (1.5-1.8m height) with good lighting

Campus Locations
-Oblation Plaza
-Main Building
-IMDPO Building
-Teaching and Learning Hub
-World Class Multimedia Center
-CCDL Auditorium
-ICC Building
-Academic Residences


🔧 Deployment
Frontend (Netlify)

Connect GitHub repository to Netlify
Set build command: npm run build
Set publish directory: build
Configure environment variables

Backend (Render)

Connect GitHub repository to Render
Set build command: pip install -r requirements.txt
Set start command: python3 main.py
Configure environment variables

🚀 Roadmap
Current Version (v1.0)

✅ Marker-based AR detection
✅ Video overlay functionality
✅ Mobile browser support
✅ UPOU campus content

Upcoming Features

🔄 Real location data integration
🔄 GPS-based AR functionality
🔄 Device orientation detection
🔄 UI/UX improvements
🔄 VR/3D experience support
🔄 ArUco marker generator


📚 Documentation
Software Requirements Specification

👥 Team
Current Development Team
Interns: Riel Jefferson Morales, Summer San Diego
Project Managers: Joshua Sta. Rita, Dan Zakai Pulmano

Acknowledgments
Special thanks to Allynha Louise Pisano (March 2025) for creating the initial prototype that made this project possible.