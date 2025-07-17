import React from 'react';
import { Link } from 'react-router-dom';
import imageData from './preview';
import '../styles/imageCards.css';

function ImageCard() {
    return (
        <div className="image-gallery">
            {imageData.map(item => (
                <Link to={`/home/details/${item.id}`} key={item.id} className="image-card-link">
                    <div className="image-card">
                        <img src={item.image} alt={item.title} className="image-thumb" />
                        <div className="image-info">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ImageCard; 