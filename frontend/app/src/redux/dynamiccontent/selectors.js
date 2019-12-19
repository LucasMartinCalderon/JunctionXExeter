import { createSelector } from 'reselect';
const CONTENT_MAX_AGE_MS = 0; //1000 * 60 * 10;

export const content = state => state.dynamicContent.content;
export const contentLoading = state => state.dynamicContent.loading;
export const contentError = state => state.dynamicContent.error;
export const contentUpdated = state => state.dynamicContent.lastUpdate;

export const shouldUpdate = createSelector(
    contentUpdated,
    updated => {
        return Date.now() - updated > CONTENT_MAX_AGE_MS;
    }
);

export const partners = state => state.dynamicContent.content.partners;
