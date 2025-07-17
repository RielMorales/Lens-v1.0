import React from 'react';

//import carousel
import CarouselImage from '../components/carousel';
import Lens from '../components/introLens';
import ImageCard from '../components/imageCards';

const Home = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <CarouselImage />
            <Lens />
            <ImageCard />
        </div>
    );
};

export default Home;