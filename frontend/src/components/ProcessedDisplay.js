import React from 'react';

const ProcessedDisplay = ({ processedUrl }) => {
  return (
    <div>
      <h1>Processed AR Video</h1>
      {processedUrl ? (
        <img src={processedUrl} alt="Processed Frame" style={{objectFit: "cover", width: "100vw", height:"100vh"}} />
      ) : (
        <p>Waiting for video...</p>
      )}
    </div>
  );
};

export default ProcessedDisplay;
