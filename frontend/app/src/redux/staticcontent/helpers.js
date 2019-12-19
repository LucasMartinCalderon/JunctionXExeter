export const getText = (textfields, isEditor) => key => {
    if (textfields.hasOwnProperty(key)) {
        return `${isEditor ? key : textfields[key].content}`;
    } else {
        return `${isEditor ? key : ''}`;
    }
};

export const getMedia = (mediafields, isEditor) => key => {
    if (mediafields.hasOwnProperty(key)) {
        return mediafields[key].media;
    } else {
        return {
            url: isEditor ? key : ''
        };
    }
};
