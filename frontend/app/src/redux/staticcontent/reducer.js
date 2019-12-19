import * as ActionTypes from './actionTypes';
import { handle } from 'redux-pack';
import { reduce } from 'lodash-es';

const initialState = {
    textfields: {},
    mediafields: {},
    loading: false,
    error: false,
    lastUpdate: 0,
    editorMode: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.UPDATE_STATIC_CONTENT: {
            return handle(state, action, {
                start: prevState => ({ ...prevState, loading: true, error: false }),
                finish: prevState => ({ ...prevState, loading: false }),
                failure: prevState => ({ ...prevState, error: true }),
                success: prevState => {
                    const { textfields, mediafields } = action.payload.data;
                    return {
                        ...prevState,
                        textfields: reduce(
                            textfields,
                            (result, item) => {
                                result[item.key.trim()] = item;
                                return result;
                            },
                            {}
                        ),
                        mediafields: reduce(
                            mediafields,
                            (result, item) => {
                                result[item.key.trim()] = item;
                                return result;
                            },
                            {}
                        ),
                        lastUpdate: Date.now()
                    };
                }
            });
        }
        case ActionTypes.TOGGLE_EDITOR_MODE: {
            return {
                ...state,
                editorMode: action.payload
            };
        }
        default:
            return state;
    }
}
