const config = {
    CLOUDINARY_CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
    GRAPHQL_BASE_URL: process.env.REACT_APP_GRAPHQL_BASE_URL || '',
    IS_DEV: process.env.NODE_ENV === 'development',
    /**
     * If IS_DEBUG is set to true, the page will show some content editor tools
     * which are not intended for the live site. You can make this depend on e.g. the current url,
     * like below:
     */
    IS_DEBUG: window.location.hostname !== 'www.yourlivesite.com'
};

export default config;
