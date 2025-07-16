import React from 'react';
// import OblationPlaza from '../components/detailModals/oblationPlaza';
// import MainBuilding from '../components/detailModals/mainBuilding';
// import ICC from '../components/detailModals/icc';

//import carousel
import CarouselImage from '../components/carousel';

const Home = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <CarouselImage />
            <h1>UPOU LENS</h1>
            <p>This is the default landing page of your app.</p>
        </div>
    );
};

export default Home;