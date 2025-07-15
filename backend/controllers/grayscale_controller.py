from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from PIL import Image

import cv2
import numpy as np
import io

router = APIRouter()

# Load ArUco dictionary and detector params
aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
parameters = cv2.aruco.DetectorParameters()

@router.post("/process-frame/")
async def process_frame(file: UploadFile = File(...)):
    # image_bytes = await file.read()
    # img = Image.open(io.BytesIO(image_bytes)).convert("L")  # Convert to grayscale
    # buf = io.BytesIO()
    # img.save(buf, format="JPEG")
    # buf.seek(0)
    # return StreamingResponse(buf, media_type="image/jpeg")

    # Read the image bytes
    image_bytes = await file.read()
    npimg = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Detect ArUco markers
    detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)
    corners, ids, rejected = detector.detectMarkers(frame)

    # Draw detected markers
    if ids is not None:
        cv2.aruco.drawDetectedMarkers(frame, corners, ids)

    # Encode processed image to JPEG
    _, img_encoded = cv2.imencode('.jpg', frame)
    return StreamingResponse(io.BytesIO(img_encoded.tobytes()), media_type="image/jpeg")