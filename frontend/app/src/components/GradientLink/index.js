import React from 'react';
import './style.scss';

const GradientLink = ({ text, href, color = 'default' }) => {
    return (
        <a href={href} className={`GradientLink GradientLink-${color}`}>
            {text}
        </a>
    );
};

export default GradientLink;
