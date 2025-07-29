import React from 'react';
import { useParams } from 'react-router-dom';
import FullDetails from '../components/detailsList';
import '../styles/details.css';
import DetailsLayout from '../components/detailsLayout';

function DetailsPage() {
  const { id } = useParams();
  const image = FullDetails.find(item => item.id === parseInt(id));


  console.log("Image data:", image); // check if image.year exists


  return (
    <DetailsLayout>
      <div className="details-page">
        <div className="details-header">
          <button className="back-button" onClick={() => window.history.back()}>
            ←
          </button>
          <h4>Building Details</h4>
        </div>
        <div className="image-wrapper">
          <img src={image.image} alt={image.title} className="details-image" />
        </div>
        <div className="details-content">
          <h3 className="details-title">{image.title}</h3>
          <p>Year Built: {image.year}</p>
          <p className="details-description">{image.description}</p>
        </div>

      </div>
    </DetailsLayout>
  );
};

export default DetailsPage;


