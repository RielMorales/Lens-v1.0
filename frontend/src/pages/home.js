import React from 'react';
// import OblationPlaza from '../components/detailModals/oblationPlaza';
// import MainBuilding from '../components/detailModals/mainBuilding';
// import ICC from '../components/detailModals/icc';

//import carousel
import CarouselImage from '../components/carousel';
import Lens from '../components/introLens';

const Home = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <CarouselImage />
            <Lens />
        </div>
    );
};

export default Home;