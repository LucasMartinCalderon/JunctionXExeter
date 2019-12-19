import React, { PureComponent } from 'react';
import { Image as CloudinaryImage } from 'cloudinary-react';
import './style.scss';

class Image extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        };

        this.setLoaded = this.setLoaded.bind(this);
    }

    setLoaded() {
        this.setState({
            loaded: true
        });
    }

    render() {
        const { image = {}, alt, className, transformation = {} } = this.props;
        const { width, height, crop = 'fill', gravity = 'center' } = transformation;
        const { loaded } = this.state;

        if (image !== null && image.public_id) {
            return (
                <CloudinaryImage
                    className={`Image ${className} ${loaded ? '' : 'Image-loading'}`}
                    alt={alt}
                    publicId={image.public_id}
                    onLoad={this.setLoaded}
                    transformation={{
                        quality: 'auto',
                        fetchFormat: 'auto',
                        width,
                        height,
                        crop,
                        gravity
                    }}
                />
            );
        }

        return (
            <img
                src={image ? image.url : ''}
                alt={alt}
                className={`Image ${className} ${loaded ? '' : 'Image-loading'}`}
                onLoad={this.setLoaded}
            />
        );
    }
}

export default Image;
