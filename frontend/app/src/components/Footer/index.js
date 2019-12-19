import React, { PureComponent } from 'react';
import './style.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Divider from '../Divider';
import Image from '../Image';

import * as ContentSelectors from '../../redux/staticcontent/selectors';

class Footer extends PureComponent {
    render() {
        const { getText, getMedia } = this.props;

        return (
            <footer className="Footer">
                <div className="FooterInner">
                    <div className="FooterInner--left">
                        <Image
                            className="FooterInner--left__logo"
                            image={getMedia('navMenuTopLogo')}
                            alt="Junction logo"
                        />
                        <p className="FooterInner--left__slogan">
                            {getText('siteSlogan')}
                        </p>
                        <a
                            className="FooterInner--left__contact"
                            href={`mailto:${getText('siteContactEmail')}`}
                        >
                            {getText('siteContactEmail')}
                        </a>
                        <Divider sm />
                    </div>
                    <div className="FooterInner--separator" />
                    <nav className="FooterInner--right">
                        <div className="FooterInner--right__section">
                            <Link to="/">
                                <h5 className="FooterInner--right__section-title">
                                    Home
                                </h5>
                            </Link>
                            <Link
                                className="FooterInner--right__section-link"
                                to="#info"
                            >
                                Practical Info
                            </Link>
                            <Link
                                className="FooterInner--right__section-link"
                                to="#challenges"
                            >
                                Tracks & Challenges
                            </Link>
                            <Link
                                className="FooterInner--right__section-link"
                                to="#sponsors"
                            >
                                Sponsors
                            </Link>
                        </div>
                        <div className="FooterInner--right__section">
                            <Link to="/team">
                                <h5 className="FooterInner--right__section-title">
                                    Contact
                                </h5>
                            </Link>

                            <Link
                                className="FooterInner--right__section-link"
                                to="#volunteer"
                            >
                                Volunteer Info
                            </Link>
                            <Link
                                className="FooterInner--right__section-link"
                                to="mailto:exeter@hackjunction.com"
                            >
                                Email
                            </Link>
                        </div>
                        <div className="FooterInner--right__section">
                            <a
                                href=""
                                alt="flickr"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <h5 className="FooterInner--right__section-title">
                                    Photo Gallery (after event)
                                </h5>
                            </a>

                            <a
                                className="FooterInner--right__section-link"
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </a>
                            <a
                                className="FooterInner--right__section-link"
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Terms & Conditions
                            </a>
                            <a
                                className="FooterInner--right__section-link"
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Code of Conduct
                            </a>
                        </div>
                    </nav>
                </div>
                <div className="FooterBottom">
                    <span className="FooterBottom--text">
                        Designed and developed with{' '}
                        <span role="img" aria-label="love">
                            💕
                        </span>{' '}
                        &{' '}
                        <span role="img" aria-label="coffee">
                            ☕
                        </span>{' '}
                        by Exeter Entreprenurs and Junction.
                    </span>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = state => {
    return {
        getText: ContentSelectors.buildGetText(state),
        getMedia: ContentSelectors.buildGetMedia(state)
    };
};

export default connect(mapStateToProps)(Footer);
