import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/carousel.css';

// import images
import MainBldg from '../assets/images/upou-main-building.png';
import Oblation from '../assets/images/upou-oblation.png';
import UPOUMap from '../assets/images/upou-map.png';
import WCMC from '../assets/images/upou-wcmc.png';
import CCDL from '../assets/images/upou-ccdl.png';

function CarouselImage() {
    const images = [UPOUMap, Oblation, MainBldg, WCMC, CCDL];

    return (
        <div className="carousel-wrapper">
            <Carousel fade interval={3000}>
                {images.map((src, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="carousel-images d-block w-100"
                            src={src}
                            alt={`Slide ${index}`}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>

    );

};

export default CarouselImage;