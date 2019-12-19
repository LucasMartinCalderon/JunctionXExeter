import { createSelector } from 'reselect';
import * as Helpers from './helpers';
const CONTENT_MAX_AGE_MS = 0; //1000 * 60 * 10;

export const textfields = state => state.staticContent.textfields;
export const mediafields = state => state.staticContent.mediafields;
export const contentUpdated = state => state.staticContent.lastUpdate;
export const contentLoading = state => state.staticContent.loading;
export const contentError = state => state.staticContent.error;
export const editorMode = state => state.staticContent.editorMode;

export const shouldUpdate = createSelector(
    contentUpdated,
    updated => {
        return Date.now() - updated > CONTENT_MAX_AGE_MS;
    }
);

export const buildGetText = createSelector(
    textfields,
    editorMode,
    (textfields, editorMode) => Helpers.getText(textfields, editorMode)
);

export const buildGetMedia = createSelector(
    mediafields,
    editorMode,
    (mediafields, editorMode) => Helpers.getMedia(mediafields, editorMode)
);
