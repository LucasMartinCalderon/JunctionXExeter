import React from 'react';
import './style.scss';

import Image from '../Image';

const HeroImage = ({ image, children, darkness = 0.75 }) => {
    return (
        <div className="HeroImage">
            <Image image={image} className="HeroImage--img" />
            <div className="HeroImage--content" style={{ background: `rgba(0,0,0,${darkness})` }}>
                {children}
            </div>
        </div>
    );
};

export default HeroImage;
