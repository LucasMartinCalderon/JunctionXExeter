import React from 'react';
import './style.scss';
import video1 from '../../assets/logos/video.mp4';
import { connect } from 'react-redux';

import * as ContentSelectors from '../../redux/staticcontent/selectors';

import HeroImage from '../../components/HeroImage/index';
import TwoColumnSection from '../../components/TwoColumnSection/index';
import SingleColumnSection from '../../components/SingleColumnSection/index';
import Divider from '../../components/Divider/index';
import Markdown from '../../components/Markdown/index';
import Image from '../../components/Image';
import GradientLink from '../../components/GradientLink';

const HomePage = ({ getText, getMedia }) => {
    return (
        <div className="HomePage">  
            <HeroImage image={getMedia('homePageHeaderImage')}>
                <Image
                    className="HomePage--logo"
                    transformation={{ width: 400 }}
                    image={getMedia('homePageHeroCtaLogo')}
                />
                <Divider size="sm" />
                <h2 className="HomePage--title">{getText('homePageHeroCtaSubtitle')}</h2>
                <Divider size="md" />
                <video className='videoTag' autoPlay loop muted>
                <source src={video1} type='video/mp4' />
                </video>  
                <GradientLink href="https://docs.google.com/forms/d/e/1FAIpQLSeZbCJwzt3ONvPElB3uKT6cq-W5u-eW8FfqP4ozQWS6Yg6LBg/viewform" text="PARTICIPANT APPLICATION" class="button1" />
                <Divider size="md" />
                <GradientLink href="https://exeentrepreneursoc.typeform.com/to/CxaMhe" text="VOLUNTEER APPLICATION" class="button2"/>
            </HeroImage>
            <SingleColumnSection title="Europe's leading network of hackathons is taking over the UK for the first time!" />
            <Divider size="lg" />
            <TwoColumnSection
                title="This is JunctionX Exeter."
                subtitle="Hackathon = The goal of a hackathon is to gather, network, build and create a functioning product or idea by the end of the event."
            >
                <Markdown source={getText('homePageIntroText')} />
            </TwoColumnSection>
            <Divider size="lg" />
            <SingleColumnSection title="Our Partners" subtitle="Check out some of our partners:">
                <Markdown source={getText('homePageIntroText')} />
            </SingleColumnSection>
            <Divider size="lg" />
        </div>
    );
};



const mapStateToProps = state => {
    return {
        getText: ContentSelectors.buildGetText(state),
        getMedia: ContentSelectors.buildGetMedia(state)
    };
};

export default connect(mapStateToProps)(HomePage);
