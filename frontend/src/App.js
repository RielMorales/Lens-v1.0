import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ProcessedDisplay from './components/ProcessedDisplay';

function App() {
  const [processedUrl, setProcessedUrl] = useState(null);

  return (
    <div>
      <CameraCapture setProcessedUrl={setProcessedUrl} />
      <ProcessedDisplay processedUrl={processedUrl} />
    </div>
  );
}

export default App;
