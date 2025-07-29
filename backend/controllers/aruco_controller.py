from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import io

# Create a FastAPI router for ArUco-related endpoints
router = APIRouter()

# Load camera calibration data (intrinsic matrix and distortion coefficients)
camera_matrix = np.load("./controllers/camera_matrix.npy")
dist_coeffs = np.load("./controllers/dist_coeffs.npy")

# Initialize the predefined ArUco marker dictionary and detection parameters
aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50) 
parameters = cv2.aruco.DetectorParameters()

# Endpoint to receive a video frame, detect ArUco markers, and return pose data
@router.post("/process-frame/")
async def process_frame(file: UploadFile = File(...)):
    # Read image bytes from the uploaded file
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Print dimensions of the received image frame
    height, width = frame.shape[:2]
    print(f"✅ Received frame size: {width}x{height}")

    # Detect ArUco markers in the frame
    corners, ids, _ = cv2.aruco.detectMarkers(frame, aruco_dict, parameters=parameters)

    poses = []  # List to store detected marker poses

    if ids is not None:
        # If markers are detected, estimate the pose of each
        rvecs, tvecs, _ = cv2.aruco.estimatePoseSingleMarkers(
            corners, 0.025, camera_matrix, dist_coeffs      # 0.025 = marker side length in meters
        )

        # Convert the detected pose (rotation and translation) vectors to a list format
        for i in range(len(ids)):
            poses.append({
                "id": int(ids[i]),                  # Marker ID
                "rvec": rvecs[i][0].tolist(),       # Rotation vector
                "tvec": tvecs[i][0].tolist()        # Translation vector
            })
    else:
        # Return an empty array if no markers are detected
        return { "poses": [] }
    
    # Print the result for debugging
    print(poses)
    # Return the list of detected poses
    return {"poses": poses}