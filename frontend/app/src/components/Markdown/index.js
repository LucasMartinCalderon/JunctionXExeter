import React, { PureComponent } from 'react';
import './style.scss';

import ReactMarkdown from 'react-markdown';
import YouTube from 'react-youtube';
import breaks from 'remark-breaks';
import { take } from 'lodash-es';

import { isYoutubeUrl } from '../../utils/regex';

class Markdown extends PureComponent {
    render() {
        const { source } = this.props;
        return (
            <div className={`Markdown ${this.props.className || ''}`}>
                <ReactMarkdown
                    plugins={[breaks]}
                    source={source}
                    renderers={{
                        delete: () => <br />,
                        image: ({ src, alt }) => {
                            let youtubeId = isYoutubeUrl(src);
                            if (youtubeId) {
                                return (
                                    <YouTube
                                        videoId={youtubeId}
                                        containerClassName="Markdown--youtube"
                                        className="Markdown--youtube__video"
                                        opts={{
                                            width: '100%',
                                            height: '100%',
                                            playerVars: {
                                                cc_lang_pref: 'en-US',
                                                cc_load_policy: 1
                                            }
                                        }}
                                    />
                                );
                            }

                            return <img className="Markdown--image" alt={alt} src={src} />;
                        },
                        paragraph: ({ children }) => {
                            const imgIndexes = [];
                            const result = [];

                            children.forEach((child, index) => {
                                if (typeof child === 'object' && child.key && !!child.key.match(/image/g)) {
                                    imgIndexes.push(index);
                                }
                            });

                            if (imgIndexes.length === 0) {
                                return <p>{children}</p>;
                            }

                            imgIndexes.forEach(imgIndex => {
                                const childrenBefore = take(children, imgIndex);
                                if (childrenBefore.length > 0) {
                                    result.push(
                                        <p key={'startswith-' + children[0].key}>{take(children, imgIndex)}</p>
                                    );
                                }
                                result.push(children[imgIndex]);
                            });

                            const restOfChildren = children.slice(imgIndexes[imgIndexes.length - 1] + 1);
                            if (restOfChildren.length > 0) {
                                result.push(<p key={'startsWith-' + restOfChildren[0].key}>{restOfChildren}</p>);
                            }

                            return result;
                        }
                    }}
                />
            </div>
        );
    }
}

export default Markdown;
