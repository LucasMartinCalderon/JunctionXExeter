import React from 'react';
import './style.scss';
import Markdown from '../Markdown';
import Column from '../Column';
import Divider from '../Divider';

const TwoColumnSection = ({ title, subtitle, children }) => {
    return (
        <Column>
            <div className="TwoColumnSection">
                <div className="TwoColumnSection--left">
                    <h3 className="TwoColumnSection--left__title">{title}</h3>
                    <Markdown className="TwoColumnSection--left__subtitle" source={subtitle} />
                </div>
                <Divider size="md" />
                <div className="TwoColumnSection--right">{children}</div>
            </div>
        </Column>
    );
};

export default TwoColumnSection;
