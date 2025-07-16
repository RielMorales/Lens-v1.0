import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture.js';
import ProcessedDisplay from '../components/ProcessedDisplay.js';


function Scanner() {
    const [processedUrl, setProcessedUrl] = useState(null);

    return (
        <div>
            <CameraCapture setProcessedUrl={setProcessedUrl} />
            <ProcessedDisplay processedUrl={processedUrl} />
        </div>
    );
};

export default Scanner;
