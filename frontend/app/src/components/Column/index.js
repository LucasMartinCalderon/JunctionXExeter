import React from 'react';
import './style.scss';

const Column = ({ children }) => {
    return (
        <div className="Column">
            <div className="Column--inner">{children}</div>
        </div>
    );
};

export default Column;
