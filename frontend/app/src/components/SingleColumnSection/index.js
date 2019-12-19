import React from 'react';
import './style.scss';
import Markdown from '../Markdown';
import Column from '../Column';
import Divider from '../Divider';

const SingleColumnSection = ({ title, subtitle, children }) => {
    return (
        <Column>
            <div className="SingleColumnSection">
                <div className="SingleColumnSection--top">
                    <h3 className="SingleColumnSection--top__title">{title}</h3>
                    <Markdown className="SingleColumnSection--top__subtitle" source={subtitle} />
                </div>
                <Divider size="sm" />
                <div className="SingleColumnSection--content">{children}</div>
            </div>
        </Column>
    );
};

export default SingleColumnSection;
