import * as ActionTypes from './actionTypes';
import * as GraphqlService from '../../services/graphql/client';
import { shouldUpdate } from './selectors';

export const updateStaticContent = () => (dispatch, getState) => {
    if (!shouldUpdate(getState())) {
        return;
    }

    dispatch({
        type: ActionTypes.UPDATE_STATIC_CONTENT,
        promise: GraphqlService.getStaticContent(),
        meta: {
            onFailure: e => console.log('Error updating static content', e)
        }
    });
};

export const toggleEditorMode = value => dispatch => {
    dispatch({
        type: ActionTypes.TOGGLE_EDITOR_MODE,
        payload: value
    });
};
