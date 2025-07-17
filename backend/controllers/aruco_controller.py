from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import io

router = APIRouter()

# Load camera calibration (adjust with your actual data)
camera_matrix = np.load("./controllers/camera_matrix.npy")
dist_coeffs = np.load("./controllers/dist_coeffs.npy")

aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
parameters = cv2.aruco.DetectorParameters()

@router.post("/process-frame/")
async def process_frame(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    height, width = frame.shape[:2]
    print(f"✅ Received frame size: {width}x{height}")

    corners, ids, _ = cv2.aruco.detectMarkers(frame, aruco_dict, parameters=parameters)

    poses = []
    if ids is not None:
        # Estimate all poses at once
        rvecs, tvecs, _ = cv2.aruco.estimatePoseSingleMarkers(
            corners, 0.025, camera_matrix, dist_coeffs
        )

        for i in range(len(ids)):
            poses.append({
                "id": int(ids[i]),
                "rvec": rvecs[i][0].tolist(),
                "tvec": tvecs[i][0].tolist()
            })
    else:
        return { "poses": [] }
    
    print(poses)

    return {"poses": poses}