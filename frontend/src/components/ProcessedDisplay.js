import React from 'react';

const ProcessedDisplay = ({ processedUrl }) => {
  return (
    <div>
      <h1>Processed AR Video</h1>
      {processedUrl ? (
        <img src={processedUrl} alt="Processed Frame" width="100%" height="550rem" style={{objectFit: "cover"}} />
      ) : (
        <p>Waiting for video...</p>
      )}
    </div>
  );
};

export default ProcessedDisplay;
