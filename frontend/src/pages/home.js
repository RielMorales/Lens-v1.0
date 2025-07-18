import React from 'react';

//import carousel
import CarouselImage from '../components/carousel';
import Lens from '../components/introLens';
import ImageCard from '../components/imageCards';
import Layout from '../components/Layout';

const Home = () => {
    return (
        <Layout>
            <div style={{ padding: '1rem' }}>
                <CarouselImage />
                <Lens />
                <ImageCard />
            </div>
        </Layout>
    );
};

export default Home;