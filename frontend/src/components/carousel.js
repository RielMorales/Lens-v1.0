import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/carousel.css';

// import images
import UPOU from '../assets/images/upou.jpg';
import MainBldg from '../assets/images/upou-main-building.jpg';
import Oblation from '../assets/images/upou-oblation.jpg';

function CarouselImage() {
    const images = [UPOU, Oblation, MainBldg];

    return (
        <Carousel fade interval={3000}>
            {images.map((src, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="carousel d-block w-100"
                        src={src}
                        alt={`Slide ${index}`}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );

};

export default CarouselImage;