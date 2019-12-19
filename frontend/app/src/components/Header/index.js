import React from 'react';
import './style.scss';

import Image from '../Image';

const Header = () => {
    return (
        <div className="Header">
            <Image
                className="Header--logo"
                image={{
                    url: require('../../assets/logos/wordmark_white.png')
                }}
                alt="Junction wordmark"

            />
            <div className="Header--content" />
            <Image
                className="Header--emblem"
                image={{
                    url: require('../../assets/logos/emblem_white.png')
                }}
                alt="Junction emblem"
            />
        </div>
    );
};

export default Header;
