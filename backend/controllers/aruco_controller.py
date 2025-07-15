from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import io

router = APIRouter()

# Load ArUco dictionary and parameters
aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)

# ⚠️ Replace these with your actual calibrated values
# Mock camera intrinsics (fx, fy, cx, cy) and distortion coeffs
camera_matrix = np.array([[640, 0, 320],
                          [0, 640, 240],
                          [0, 0, 1]], dtype=np.float32)

dist_coeffs = np.zeros((5, 1), dtype=np.float32)  # assuming no distortion

# Define marker length in meters (real world size)
marker_length = 0.05  # 5 cm

@router.post("/process-frame/")
async def process_frame(file: UploadFile = File(...)):
    # Read and decode the uploaded image
    image_bytes = await file.read()
    npimg = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Detect ArUco markers
    corners, ids, _ = detector.detectMarkers(frame)

    if ids is not None:
        # Draw the detected markers
        cv2.aruco.drawDetectedMarkers(frame, corners, ids)

        # Estimate pose
        rvecs, tvecs, _ = cv2.aruco.estimatePoseSingleMarkers(
            corners, marker_length, camera_matrix, dist_coeffs
        )

        for i in range(len(ids)):
            rvec = rvecs[i]
            tvec = tvecs[i]

            # Draw axis on each marker (length = 0.03m)
            cv2.drawFrameAxes(frame, camera_matrix, dist_coeffs, rvec, tvec, 0.03)

            # Optionally add text to show position
            pos_text = f"x:{tvec[0][0]:.2f} y:{tvec[0][1]:.2f} z:{tvec[0][2]:.2f}"
            cv2.putText(frame, pos_text, (int(corners[i][0][0][0]), int(corners[i][0][0][1]) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

    # Encode and return JPEG
    _, img_encoded = cv2.imencode('.jpg', frame)
    return StreamingResponse(io.BytesIO(img_encoded.tobytes()), media_type="image/jpeg")
