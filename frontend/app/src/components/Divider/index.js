import React from 'react';
import './style.scss';

const Divider = ({ size = 'md' }) => {
    return <div className={`Divider Divider-${size}`} />;
};

export default Divider;
